/**
 * ==========================================================================
 * COMPONENT BUILDERS (Page Object Model)
 * ==========================================================================
 * Each function below is a "page object" for one homepage section:
 * it knows how to render itself from SITE_CONTENT and knows how to
 * wire up its own interactions. index.html only contains empty
 * <section id="..."> mount points — nothing is hardcoded in markup.
 *
 * Pattern per component:
 *   ComponentName.render(container)  -> builds and inserts DOM
 *   ComponentName.bind()             -> attaches events (if any)
 *
 * This keeps content, structure and behaviour separated so that future
 * changes only ever touch content.config.js, not this file.
 * ==========================================================================
 */
(function (window, document) {
  "use strict";

  const C = window.SITE_CONTENT;

  /* ---------------------------------------------------------------------
   * Small DOM helpers (framework-free, works in every modern browser)
   * ------------------------------------------------------------------- */
  const SVG_NS = "http://www.w3.org/2000/svg";
  const SVG_TAGS = ["svg", "path", "circle", "rect", "line", "polyline", "polygon", "g", "defs", "clipPath", "linearGradient", "stop", "ellipse", "text", "tspan"];

  function h(tag, attrs, children) {
    const node = SVG_TAGS.indexOf(tag) !== -1
      ? document.createElementNS(SVG_NS, tag)
      : document.createElement(tag);
    attrs = attrs || {};
    Object.keys(attrs).forEach((key) => {
      if (key === "class") {
        // className is read-only on SVG elements in some browsers; setAttribute works for both.
        node.setAttribute("class", attrs[key]);
      }
      else if (key === "html") node.innerHTML = attrs[key];
      else if (key.indexOf("on") === 0 && typeof attrs[key] === "function") {
        node.addEventListener(key.slice(2).toLowerCase(), attrs[key]);
      } else {
        node.setAttribute(key, attrs[key]);
      }
    });
    (children || []).forEach((child) => {
      if (child == null) return;
      if (typeof child === "string") node.appendChild(document.createTextNode(child));
      else node.appendChild(child);
    });
    return node;
  }

  function whatsappLink(prefillMessage) {
    const msg = encodeURIComponent(prefillMessage || C.contact.whatsappMessage);
    return "https://wa.me/" + C.contact.whatsappNumber + "?text=" + msg;
  }

  function logoImg(assetPrefix, extraClass) {
    const src = (assetPrefix || "") + C.brand.logoSrc;
    return h("img", { src, alt: C.brand.name + " logo", class: "logo-mark" + (extraClass ? " " + extraClass : "") });
  }

  /* ---------------------------------------------------------------------
   * SERVICE ICON REGISTRY — one small line-icon per service key. Services
   * reference an icon by name (content.config.js -> services.items[].icon)
   * so the actual SVG markup lives in exactly one place.
   * ------------------------------------------------------------------- */
  const SERVICE_ICONS = {
    website: '<circle cx="12" cy="12" r="9" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M3 12h18M12 3c2.5 2.5 3.8 5.7 3.8 9s-1.3 6.5-3.8 9c-2.5-2.5-3.8-5.7-3.8-9s1.3-6.5 3.8-9z" stroke="currentColor" stroke-width="1.6" fill="none"/>',
    cart: '<circle cx="9" cy="20" r="1.4" fill="currentColor"/><circle cx="17" cy="20" r="1.4" fill="currentColor"/><path d="M2.5 3h2.4l2 12.2a2 2 0 002 1.7h8.4a2 2 0 002-1.6l1.5-7.8H6.2" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    invoice: '<rect x="5" y="2.5" width="14" height="19" rx="1.6" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M8.5 8h7M8.5 12h7M8.5 16h4" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    megaphone: '<path d="M3 10v4a1.5 1.5 0 001.5 1.5H6l1 5h2l-1-5h1l9 4V6l-9 4H4.5A1.5 1.5 0 003 10z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><path d="M19 9.5v5" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    search: '<circle cx="10.5" cy="10.5" r="6.5" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M19.5 19.5l-4.3-4.3" stroke="currentColor" stroke-width="1.6" stroke-linecap="round"/>',
    video: '<rect x="2.5" y="5.5" width="14" height="13" rx="2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M16.5 10l5-3v10l-5-3" stroke="currentColor" stroke-width="1.6" stroke-linejoin="round" fill="none"/>',
  };
  function serviceIcon(key, cls) {
    const paths = SERVICE_ICONS[key] || SERVICE_ICONS.website;
    return h("svg", { class: cls || "", viewBox: "0 0 22 22", width: "16", height: "16", fill: "none", html: paths });
  }

  function mount(id, node) {
    const target = document.getElementById(id);
    if (!target) return;
    target.appendChild(node);
  }

  /* ---------------------------------------------------------------------
   * HEADER + MOBILE MENU
   * ------------------------------------------------------------------- */
  const HeaderComponent = {
    render(basePath) {
      basePath = basePath || ""; // "" on homepage, "../index.html" on service pages
      const linkHref = (href) => (href.indexOf("#") === 0 ? basePath + href : href);
      const assetPrefix = basePath ? "../" : "";

      const logo = () =>
        h("div", { class: "logo" }, [
          logoImg(assetPrefix),
          document.createTextNode(C.brand.name),
        ]);

      const logoLink = h("a", { href: basePath ? "../index.html" : "#top", "aria-label": C.brand.name + " home" }, [logo()]);

      const deskNav = h("nav", { class: "desknav" }, [
        h("ul", {}, C.nav.map((item) => h("li", {}, [h("a", { href: linkHref(item.href) }, [item.label])]))),
      ]);

      const navRight = h("div", { class: "nav-right" }, [
        h("a", { href: linkHref(C.hero.ctaPrimary.href), class: "nav-cta" }, [C.hero.ctaPrimary.label]),
        h("button", { class: "burger", id: "burgerBtn", "aria-label": "Open menu", "aria-expanded": "false", "aria-controls": "mobileMenu" }, [
          h("span", {}), h("span", {}), h("span", {}),
        ]),
      ]);

      const header = h("header", { id: "siteHeader", class: basePath ? "always-solid" : "" }, [logoLink, deskNav, navRight]);

      const mobileMenu = h("div", { class: "mobile-menu", id: "mobileMenu" }, [
        h("div", { class: "mtop" }, [
          h("div", { class: "logo" }, [logoImg(assetPrefix), C.brand.name]),
          h("button", { class: "close-x", id: "closeMenu", "aria-label": "Close menu" }, ["✕"]),
        ]),
        h("ul", {}, C.nav.map((item) => h("li", {}, [h("a", { href: linkHref(item.href) }, [item.label])]))),
        h("a", { href: linkHref(C.hero.ctaPrimary.href), class: "btn-primary mcta" }, [C.hero.ctaPrimary.label]),
      ]);

      document.body.insertBefore(mobileMenu, document.body.firstChild);
      document.body.insertBefore(header, document.body.firstChild);
    },
    bind() {
      const header = document.getElementById("siteHeader");
      const burger = document.getElementById("burgerBtn");
      const menu = document.getElementById("mobileMenu");
      const closeBtn = document.getElementById("closeMenu");

      const onScroll = () => header.classList.toggle("solid", window.scrollY > 30);
      window.addEventListener("scroll", onScroll, { passive: true });
      onScroll();

      function openMenu() {
        menu.classList.add("open");
        burger.setAttribute("aria-expanded", "true");
        document.body.style.overflow = "hidden";
      }
      function closeMenu() {
        menu.classList.remove("open");
        burger.setAttribute("aria-expanded", "false");
        document.body.style.overflow = "";
      }
      burger.addEventListener("click", openMenu);
      closeBtn.addEventListener("click", closeMenu);
      menu.querySelectorAll("a").forEach((a) => a.addEventListener("click", closeMenu));
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && menu.classList.contains("open")) closeMenu();
      });
    },
  };

  /* ---------------------------------------------------------------------
   * HERO
   * ------------------------------------------------------------------- */
  const HeroComponent = {
    render() {
      const words = C.hero.headline.split(" ");
      const splitAt = words.length - C.hero.headlineAccentWords;
      const plain = words.slice(0, splitAt).join(" ");
      const accent = words.slice(splitAt).join(" ");

      const copy = h("div", { class: "hero-copy reveal in" }, [
        h("span", { class: "eyebrow" }, [C.hero.eyebrow]),
        h("h1", {}, [plain + " ", h("span", { class: "accent", id: "hero-accent-word" }, [accent])]),
        h("p", { class: "lead" }, [C.hero.lead]),
        h("div", { class: "hero-actions" }, [
          h("a", { href: C.hero.ctaPrimary.href, class: "btn-primary" }, [C.hero.ctaPrimary.label + " →"]),
          h("a", { href: C.hero.ctaSecondary.href, class: "btn-outline" }, [C.hero.ctaSecondary.label]),
        ]),
        h("div", { class: "hero-services-inline" }, C.services.items.map((s) => h("span", {}, [s.title]))),
      ]);

      const visual = h("div", { class: "hero-visual reveal in", id: "hero-visual" }, [
        h("div", { class: "stack-card card-site" }, [
          h("div", { class: "browser-dots" }, [h("span", {}), h("span", {}), h("span", {})]),
          h("div", { class: "bl w40" }), h("div", { class: "bl w80" }), h("div", { class: "bl w60" }),
          h("div", { class: "hero-block" }),
        ]),
        h("div", { class: "stack-card card-analytics" }, [
          h("div", { class: "lbl" }, ["Traffic Growth"]),
          h("div", { class: "bars" }, [35, 52, 40, 68, 58, 82, 74].map((v) => h("i", { style: "height:" + v + "%" }))),
        ]),
        h("div", { class: "stack-card card-billing" }, [
          h("div", { class: "row" }, [h("div", { class: "a" }), h("div", { class: "b" })]),
          h("div", { class: "row" }, [h("div", { class: "a", style: "width:35%" }), h("div", { class: "b", style: "width:15%" })]),
          h("div", { class: "total" }, [h("span", {}, ["Invoice Total"]), "₹ 24,500.00"]),
        ]),
      ]);

      const section = h("section", { class: "hero", id: "top" }, [
        h("div", { class: "hero-grid-lines" }), copy, visual,
      ]);
      mount("hero-mount", section);
    },
    bind() {
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

      // Accent word rotator — cycles through the real service list from
      // content.config.js. No invented copy: first frame is always the
      // configured headline accent text, then each configured service title.
      const accentEl = document.getElementById("hero-accent-word");
      if (accentEl && !reduceMotion) {
        const words = words_for_rotation();
        let i = 0;
        setInterval(() => {
          i = (i + 1) % words.length;
          accentEl.classList.add("swap-out");
          setTimeout(() => {
            accentEl.textContent = words[i];
            accentEl.classList.remove("swap-out");
          }, 260);
        }, 2400);
      }

      function words_for_rotation() {
        const words = C.hero.headline.split(" ");
        const splitAt = words.length - C.hero.headlineAccentWords;
        const original = words.slice(splitAt).join(" ");
        return [original].concat(C.services.items.map((s) => s.title));
      }

      // Subtle mouse-parallax tilt on the hero visual — desktop pointer only.
      const heroSection = document.querySelector(".hero");
      const visualEl = document.getElementById("hero-visual");
      if (heroSection && visualEl && !reduceMotion && window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
        heroSection.addEventListener("mousemove", (e) => {
          const rect = heroSection.getBoundingClientRect();
          const x = (e.clientX - rect.left) / rect.width - 0.5;
          const y = (e.clientY - rect.top) / rect.height - 0.5;
          visualEl.style.transform = "rotateY(" + (x * 5) + "deg) rotateX(" + (y * -5) + "deg)";
        });
        heroSection.addEventListener("mouseleave", () => {
          visualEl.style.transform = "rotateY(0deg) rotateX(0deg)";
        });
      }
    },
  };

  /* ---------------------------------------------------------------------
   * VALUE STRIP
   * ------------------------------------------------------------------- */
  const ValueStripComponent = {
    render() {
      const buildPill = (s) =>
        h("div", { class: "marquee-card" }, [
          h("span", { class: "marquee-card-num" }, [serviceIcon(s.icon)]),
          h("span", {}, [s.title]),
        ]);
      // Rendered twice back-to-back so the CSS animation (translateX 0 -> -50%)
      // loops seamlessly with no visible jump.
      const track = h("div", { class: "marquee-track" }, [
        ...C.services.items.map(buildPill),
        ...C.services.items.map(buildPill),
      ]);

      const node = h("div", { class: "value-strip" }, [
        h("div", { class: "wrap" }, [
          h("div", { class: "vs-inner" }, [h("h2", {}, [C.valueStrip.heading])]),
        ]),
        h("div", { class: "marquee-wrap" }, [track]),
      ]);
      mount("value-strip-mount", node);
    },
  };

  /* ---------------------------------------------------------------------
   * PROBLEM -> SOLUTION
   * ------------------------------------------------------------------- */
  const ProblemComponent = {
    render() {
      const section = h("section", { class: "problem", id: "about-problem" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [C.problem.tag]),
          h("h2", {}, [C.problem.heading]),
        ]),
        h("div", { class: "problem-grid" }, C.problem.points.map((p) =>
          h("div", { class: "problem-item reveal" }, [h("span", { class: "x" }, ["✕"]), h("p", {}, [p])])
        )),
        h("div", { class: "solution-banner reveal" }, [
          h("h3", {}, [
            C.problem.solutionHeadingPrefix + " ",
            h("span", {}, [C.problem.solutionHeadingAccent]),
            " " + C.problem.solutionHeadingSuffix,
          ]),
          h("a", { href: C.problem.solutionCta.href, class: "btn-outline" }, [C.problem.solutionCta.label + " →"]),
        ]),
      ]);
      mount("problem-mount", section);
    },
  };

  /* ---------------------------------------------------------------------
   * SERVICES
   * ------------------------------------------------------------------- */
  const ServicesComponent = {
    render() {
      const arrowIcon = () => h("span", { class: "arrow" }, [
        h("svg", { width: "14", height: "14", viewBox: "0 0 14 14", html:
          '<path d="M3 11L11 3M11 3H4M11 3V10" stroke="#0A0F1C" stroke-width="1.6" fill="none"/>' }),
      ]);

      const section = h("section", { class: "services", id: "services" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [C.services.tag]),
          h("h2", {}, [C.services.heading]),
        ]),
        h("div", { class: "service-list" }, C.services.items.map((s) =>
          h("a", { class: "service-row reveal", href: "services/index.html?service=" + s.slug }, [
            h("span", { class: "snum" }, [serviceIcon(s.icon)]),
            h("h3", {}, [s.title]),
            h("p", {}, [s.description]),
            arrowIcon(),
          ])
        )),
      ]);
      mount("services-mount", section);
    },
  };

  /* ---------------------------------------------------------------------
   * WHY US
   * ------------------------------------------------------------------- */
  /* ---------------------------------------------------------------------
   * QUIZ — "Which service do I need?" lightweight 2-step decision tree.
   * Reads entirely from C.quiz + C.servicesDetail (for result content),
   * so adding/editing options is a config-only change.
   * ------------------------------------------------------------------- */
  const QuizComponent = {
    render() {
      const q = C.quiz;
      const card = h("div", { class: "quiz-card reveal", id: "quizCard" });

      const section = h("section", { class: "quiz" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [q.tag]),
          h("h2", {}, [q.heading]),
          h("p", {}, [q.lead]),
        ]),
        card,
      ]);
      mount("quiz-mount", section);
      this.renderStep("step1");
    },
    renderStep(stepKey) {
      const q = C.quiz;
      const card = document.getElementById("quizCard");
      if (!card) return;
      const step = q[stepKey];
      card.innerHTML = "";
      card.appendChild(
        h("div", { class: "quiz-progress" }, [
          h("span", { class: stepKey === "step1" ? "dot active" : "dot" }),
          h("span", { class: stepKey === "step2" ? "dot active" : "dot" }),
        ])
      );
      card.appendChild(h("h3", { class: "quiz-question" }, [step.question]));
      const optionsWrap = h("div", { class: "quiz-options" });
      step.options.forEach((opt) => {
        const btn = h("button", { type: "button", class: "quiz-option" }, [opt.label]);
        btn.addEventListener("click", () => {
          if (opt.next) this.renderStep(opt.next);
          else this.renderResult(opt.result);
        });
        optionsWrap.appendChild(btn);
      });
      card.appendChild(optionsWrap);
    },
    renderResult(slug) {
      const q = C.quiz;
      const service = C.servicesDetail[slug];
      const card = document.getElementById("quizCard");
      if (!card || !service) return;
      card.innerHTML = "";
      card.appendChild(
        h("div", { class: "quiz-result" }, [
          h("span", { class: "tag mono", style: "color:var(--blue);display:block;margin-bottom:10px;" }, ["Recommended For You"]),
          h("h3", {}, [service.navLabel]),
          h("p", {}, [service.hero.description]),
          h("div", { class: "quiz-result-actions" }, [
            h("a", { href: "services/index.html?service=" + slug, class: "btn-primary" }, [q.resultCtaPrimary + " →"]),
            h("a", { href: whatsappLink(), target: "_blank", rel: "noopener", class: "btn-outline-dark" }, [q.resultCtaSecondary]),
          ]),
          h("button", { type: "button", class: "quiz-retake" }, [q.retakeLabel]),
        ])
      );
      card.querySelector(".quiz-retake").addEventListener("click", () => this.renderStep("step1"));
    },
  };

  const WhyComponent = {
    render() {
      const section = h("section", { class: "why", id: "why" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [C.why.tag]),
          h("h2", {}, [C.why.heading]),
        ]),
        h("div", { class: "why-grid" }, C.why.items.map((w) =>
          h("div", { class: "why-card reveal" }, [
            h("div", { class: "wn" }, [w.num]),
            h("h4", {}, [w.title]),
            h("p", {}, [w.description]),
          ])
        )),
      ]);
      mount("why-mount", section);
    },
  };

  /* ---------------------------------------------------------------------
   * PROCESS
   * ------------------------------------------------------------------- */
  const ProcessComponent = {
    render(data, mountId) {
      data = data || C.process;
      mountId = mountId || "process-mount";
      const section = h("section", { class: "process", id: "process" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [data.tag]),
          h("h2", {}, [data.heading]),
        ]),
        h("div", { class: "process-track" }, data.steps.map((s) =>
          h("div", { class: "process-node reveal" }, [
            h("div", { class: "pdot" }, [s.num]),
            h("h4", {}, [s.title]),
            h("p", {}, [s.description]),
          ])
        )),
      ]);
      mount(mountId, section);
    },
  };

  /* ---------------------------------------------------------------------
   * WORK
   * ------------------------------------------------------------------- */
  const WorkComponent = {
    render() {
      const body = C.work.hasProjects && C.work.projects.length
        ? h("div", { class: "work-grid reveal" }, C.work.projects.map((p) =>
            p.link
              ? h("a", { class: "work-card", href: p.link, target: "_blank", rel: "noopener" }, [
                  h("h3", {}, [p.title]),
                  h("p", {}, [p.description]),
                  h("span", { class: "work-card-link" }, ["Visit site →"]),
                ])
              : h("div", { class: "work-card" }, [h("h3", {}, [p.title]), h("p", {}, [p.description])])
          ))
        : h("div", { class: "work-empty reveal" }, [
            h("div", { class: "wmark" }, [
              h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", html:
                '<path d="M12 2v20M2 12h20" stroke="#2F6BFF" stroke-width="1.6"/>' }),
            ]),
            h("h3", {}, [C.work.emptyState.title]),
            h("p", {}, [C.work.emptyState.description]),
            h("a", { href: C.work.emptyState.cta.href, class: "btn-outline", style: "color:var(--text-dark);border-color:var(--paper-line);" }, [C.work.emptyState.cta.label]),
          ]);

      const section = h("section", { class: "work", id: "work" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [C.work.tag]),
          h("h2", {}, [C.work.heading]),
        ]),
        body,
      ]);
      mount("work-mount", section);
    },
  };

  /* ---------------------------------------------------------------------
   * TRANSFORMATION
   * ------------------------------------------------------------------- */
  const TransformComponent = {
    render() {
      const list = (points) => h("ul", {}, points.map((p) => h("li", {}, [p])));

      const section = h("section", { class: "transform" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [C.transform.tag]),
          h("h2", {}, [C.transform.heading]),
        ]),
        h("div", { class: "tf-row reveal" }, [
          h("div", { class: "tf-panel tf-before" }, [
            h("span", { class: "lbl mono" }, [C.transform.before.label]),
            h("h4", {}, [C.transform.before.title]),
            list(C.transform.before.points),
          ]),
          h("div", { class: "tf-arrow" }, [
            h("svg", { width: "18", height: "18", viewBox: "0 0 18 18", html:
              '<path d="M3 9h12M11 5l4 4-4 4" stroke="#fff" stroke-width="1.8" fill="none"/>' }),
          ]),
          h("div", { class: "tf-panel tf-after" }, [
            h("span", { class: "lbl mono" }, [C.transform.after.label]),
            h("h4", {}, [C.transform.after.title]),
            list(C.transform.after.points),
          ]),
        ]),
      ]);
      mount("transform-mount", section);
    },
  };

  /* ---------------------------------------------------------------------
   * FAQ (accordion — one open at a time, keyboard + ARIA accessible)
   * ------------------------------------------------------------------- */
  const FaqComponent = {
    render(data, mountId, idPrefix) {
      data = data || C.faq;
      mountId = mountId || "faq-mount";
      idPrefix = idPrefix || "faq";
      const items = data.items.map((item, i) => {
        const qId = idPrefix + "-h-" + i;
        const aId = idPrefix + "-a-" + i;
        return h("div", { class: "faq-item", "data-open": "false" }, [
          h("h3", {}, [
            h("button", { class: "faq-q", "aria-expanded": "false", "aria-controls": aId, id: qId }, [
              item.q,
              h("span", { class: "plus", "aria-hidden": "true" }),
            ]),
          ]),
          h("div", { class: "faq-a-wrap", id: aId, role: "region", "aria-labelledby": qId }, [
            h("div", { class: "faq-a-inner" }, [h("p", { class: "faq-a" }, [item.a])]),
          ]),
        ]);
      });

      const section = h("section", { class: "faq", id: mountId === "faq-mount" ? "faq" : mountId.replace("-mount", "") }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [data.tag]),
          h("h2", {}, [data.heading]),
          h("p", {}, [data.lead]),
        ]),
        h("div", { class: "faq-list reveal" }, items),
      ]);
      mount(mountId, section);
    },
    bind() {
      const items = Array.from(document.querySelectorAll(".faq-item"));
      items.forEach((item) => {
        const btn = item.querySelector(".faq-q");
        btn.addEventListener("click", () => {
          const isOpen = item.getAttribute("data-open") === "true";
          items.forEach((other) => {
            other.setAttribute("data-open", "false");
            other.querySelector(".faq-q").setAttribute("aria-expanded", "false");
          });
          if (!isOpen) {
            item.setAttribute("data-open", "true");
            btn.setAttribute("aria-expanded", "true");
          }
        });
        btn.addEventListener("keydown", (e) => {
          const idx = items.indexOf(item);
          if (e.key === "ArrowDown") { e.preventDefault(); (items[idx + 1] || items[0]).querySelector(".faq-q").focus(); }
          if (e.key === "ArrowUp") { e.preventDefault(); (items[idx - 1] || items[items.length - 1]).querySelector(".faq-q").focus(); }
        });
      });
    },
  };

  /* ---------------------------------------------------------------------
   * CTA
   * ------------------------------------------------------------------- */
  const CtaComponent = {
    render(data, mountId) {
      data = data || C.cta;
      mountId = mountId || "cta-mount";
      const primaryHref = (data.ctaPrimary && data.ctaPrimary.href) || C.hero.ctaPrimary.href;
      const primaryLabel = (data.ctaPrimary && data.ctaPrimary.label) || C.cta.ctaPrimary.label;
      const secondaryLabel = (data.ctaSecondary && data.ctaSecondary.label) || C.cta.ctaSecondary.label;
      const section = h("section", { class: "cta-section" }, [
        h("div", { class: "inner reveal" }, [
          h("h2", {}, [data.heading]),
          h("p", {}, [data.lead]),
          h("div", { class: "cta-actions" }, [
            h("a", { href: primaryHref, class: "btn-primary" }, [primaryLabel + " →"]),
            h("a", { href: whatsappLink(), target: "_blank", rel: "noopener", class: "btn-outline" }, [secondaryLabel]),
          ]),
        ]),
      ]);
      mount(mountId, section);
    },
  };

  /* ---------------------------------------------------------------------
   * CONTACT
   * ------------------------------------------------------------------- */
  const ContactComponent = {
    render() {
      const icon = (pathHtml) => h("div", { class: "ic" }, [h("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", html: pathHtml })]);

      const details = h("div", { class: "contact-details reveal" }, [
        h("div", { class: "cdrow" }, [
          icon('<path d="M20.5 3.5A11 11 0 003.7 17.4L3 21l3.7-1a11 11 0 0013.8-16.5z" stroke="#2F6BFF" stroke-width="1.6"/>'),
          h("div", {}, [h("small", {}, ["WhatsApp"]), h("a", { href: whatsappLink(), target: "_blank", rel: "noopener" }, [C.contact.phoneDisplay])]),
        ]),
        h("div", { class: "cdrow" }, [
          icon('<path d="M3 5c0 9 7 16 16 16l3-4-6-3-2 2c-2-1-4-3-5-5l2-2-3-6-4 1" stroke="#2F6BFF" stroke-width="1.6" stroke-linejoin="round"/>'),
          h("div", {}, [h("small", {}, ["Phone"]), h("a", { href: "tel:" + C.contact.phoneE164 }, [C.contact.phoneDisplay])]),
        ]),
        h("div", { class: "cdrow" }, [
          icon('<rect x="3" y="5" width="18" height="14" rx="2" stroke="#2F6BFF" stroke-width="1.6"/><path d="M3 7l9 6 9-6" stroke="#2F6BFF" stroke-width="1.6"/>'),
          h("div", {}, [h("small", {}, ["Email"]), h("a", { href: "mailto:" + C.contact.email }, [C.contact.email])]),
        ]),
      ]);

      const form = h("form", { class: "enquiry reveal" }, [
        h("div", { class: "f-row2" }, [
          h("input", { type: "text", name: "name", placeholder: "Your name", required: "required", autocomplete: "name" }),
          h("input", { type: "text", name: "business", placeholder: "Business name", required: "required", autocomplete: "organization" }),
        ]),
        h("div", { class: "f-row2" }, [
          h("input", { type: "tel", name: "phone", placeholder: "Phone number", required: "required", autocomplete: "tel" }),
          h("input", { type: "email", name: "email", placeholder: "Email address", required: "required", autocomplete: "email" }),
        ]),
        h("select", { name: "service", required: "required", "aria-label": "Service required" }, [
          h("option", { value: "", disabled: "disabled", selected: "selected" }, ["Service required"]),
          ...C.contactSection.form.services.map((s) => h("option", {}, [s])),
        ]),
        h("textarea", { rows: "4", name: "message", placeholder: "Tell us about your business", required: "required" }),
        h("button", { type: "submit" }, [C.contactSection.form.submitLabel]),
        h("p", { class: "form-status", "aria-live": "polite" }),
      ]);

      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const f = C.contactSection.form;
        const button = form.querySelector("button");
        const status = form.querySelector(".form-status");
        const endpoint = f.endpoint;

        if (!endpoint) {
          // No form service configured yet — keep the site usable without
          // pretending the message was sent anywhere. See README for setup.
          status.textContent = "Contact form isn't fully set up yet — please reach out via WhatsApp, phone, or email above.";
          status.classList.add("form-status-error");
          return;
        }

        button.disabled = true;
        button.textContent = f.submitLabelSending;
        status.textContent = "";
        status.classList.remove("form-status-error", "form-status-success");

        fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        })
          .then((res) => {
            if (res.ok) {
              button.textContent = f.submitLabelSuccess;
              status.textContent = "Thanks — we'll get back to you soon.";
              status.classList.add("form-status-success");
              form.reset();
            } else {
              throw new Error("Form submission failed");
            }
          })
          .catch(() => {
            button.disabled = false;
            button.textContent = f.submitLabel;
            status.textContent = f.submitLabelError + " — or reach us directly via WhatsApp/phone above.";
            status.classList.add("form-status-error");
          });
      });

      const section = h("section", { class: "contact", id: "contact" }, [
        h("div", {}, [
          h("div", { class: "p-head reveal", style: "margin-bottom:36px;" }, [
            h("span", { class: "tag mono" }, [C.contactSection.tag]),
            h("h2", {}, [C.contactSection.heading]),
          ]),
          details,
        ]),
        form,
      ]);
      mount("contact-mount", section);
    },
  };

  /* ---------------------------------------------------------------------
   * FOOTER + WHATSAPP FLOAT
   * ------------------------------------------------------------------- */
  const FooterComponent = {
    render(basePath) {
      basePath = basePath || "";
      const linkHref = (href) => (href.indexOf("#") === 0 ? basePath + href : href);
      const assetPrefix = basePath ? "../" : "";
      const footer = h("footer", {}, [
        h("div", { class: "foot-grid" }, [
          h("div", { class: "foot-brand" }, [
            h("div", { class: "logo", style: "color:#fff;" }, [logoImg(assetPrefix), C.brand.name]),
            h("p", {}, [C.brand.tagline]),
          ]),
          h("div", {}, [
            h("h5", {}, ["Services"]),
            h("ul", {}, C.services.items.map((s) => h("li", {}, [h("a", { href: basePath ? "index.html?service=" + s.slug : "services/index.html?service=" + s.slug }, [s.title])]))),
          ]),
          h("div", {}, [
            h("h5", {}, ["Quick Links"]),
            h("ul", {}, C.footer.quickLinks.map((l) => h("li", {}, [h("a", { href: linkHref(l.href) }, [l.label])]))),
          ]),
          h("div", {}, [
            h("h5", {}, ["Contact"]),
            h("ul", {}, [
              h("li", {}, [h("a", { href: "tel:" + C.contact.phoneE164 }, [C.contact.phoneDisplay])]),
              h("li", {}, [h("a", { href: "mailto:" + C.contact.email }, [C.contact.email])]),
            ]),
          ]),
        ]),
        h("div", { class: "foot-bottom" }, [
          h("span", {}, ["© " + C.footer.year + " " + C.brand.name + ". All rights reserved."]),
          h("span", {}, [C.footer.bottomNote]),
        ]),
      ]);
      mount("footer-mount", footer);

      const waFloat = h("a", { class: "wa-float", href: whatsappLink(), target: "_blank", rel: "noopener", "aria-label": "Chat on WhatsApp" }, [
        h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", html: '<path d="M20.5 3.5A11 11 0 003.7 17.4L3 21l3.7-1a11 11 0 0013.8-16.5z" stroke="#fff" stroke-width="1.8"/>' }),
        h("span", { class: "wa-text" }, ["Let's Talk"]),
      ]);
      document.body.appendChild(waFloat);

      // Sticky mobile Call + WhatsApp bar — mobile-only (see CSS), hidden on
      // desktop. The existing wa-float button is hidden on mobile via CSS
      // once this bar is present, so there's no duplicate WhatsApp CTA.
      const mobileBar = h("div", { class: "mobile-cta-bar" }, [
        h("a", { href: "tel:" + C.contact.phoneE164, class: "mcb-btn mcb-call" }, [
          h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", html: '<path d="M3 5c0 9 7 16 16 16l3-4-6-3-2 2c-2-1-4-3-5-5l2-2-3-6-4 1" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' }),
          "Call Now",
        ]),
        h("a", { href: whatsappLink(), target: "_blank", rel: "noopener", class: "mcb-btn mcb-wa" }, [
          h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", html: '<path d="M20.5 3.5A11 11 0 003.7 17.4L3 21l3.7-1a11 11 0 0013.8-16.5z" stroke="currentColor" stroke-width="1.8"/>' }),
          "WhatsApp",
        ]),
      ]);
      document.body.appendChild(mobileBar);
    },
  };

  /* ---------------------------------------------------------------------
   * SHARED EXPORTS — reused as-is by service pages (js/pages/service.js)
   * so there is exactly ONE Header, Footer, FAQ, CTA and Process
   * implementation across the whole site, never a duplicate.
   * ------------------------------------------------------------------- */
  /* ---------------------------------------------------------------------
   * QUICK ENQUIRY — user-initiated slide-in tab (not an automatic popup).
   * Sits alongside the WhatsApp float, appended once to <body> on every
   * page (home + all service pages). Reuses the same Formspree endpoint
   * as the main contact form — single source of truth for delivery.
   * ------------------------------------------------------------------- */
  const QuickEnquiryComponent = {
    render() {
      const q = C.quickEnquiry;

      const overlay = h("div", { class: "qe-overlay", id: "qeOverlay" });

      const tab = h("button", { class: "qe-tab", id: "qeTab", "aria-expanded": "false", "aria-controls": "qePanel" }, [q.tabLabel]);

      const form = h("form", { class: "qe-form" }, [
        h("input", { type: "hidden", name: "_subject", value: "Quick Enquiry — ShutterLockSolutions" }),
        h("input", { type: "text", name: "name", placeholder: "Your name", required: "required", autocomplete: "name" }),
        h("input", { type: "tel", name: "phone", placeholder: "Phone number", required: "required", autocomplete: "tel" }),
        h("input", { type: "email", name: "email", placeholder: "Email address", required: "required", autocomplete: "email" }),
        h("button", { type: "submit" }, [q.submitLabel]),
        h("p", { class: "form-status", "aria-live": "polite" }),
      ]);

      const panel = h("div", { class: "qe-panel", id: "qePanel", role: "dialog", "aria-modal": "true", "aria-labelledby": "qeHeading" }, [
        h("button", { class: "qe-close", id: "qeClose", "aria-label": "Close quick enquiry" }, ["✕"]),
        h("h3", { id: "qeHeading" }, [q.heading]),
        h("p", { class: "qe-lead" }, [q.lead]),
        form,
      ]);

      document.body.appendChild(overlay);
      document.body.appendChild(tab);
      document.body.appendChild(panel);
    },
    bind() {
      const tab = document.getElementById("qeTab");
      const panel = document.getElementById("qePanel");
      const overlay = document.getElementById("qeOverlay");
      const closeBtn = document.getElementById("qeClose");
      if (!tab || !panel) return;

      function open() {
        panel.classList.add("open");
        overlay.classList.add("open");
        tab.setAttribute("aria-expanded", "true");
        const firstInput = panel.querySelector("input");
        if (firstInput) firstInput.focus();
      }
      function close() {
        panel.classList.remove("open");
        overlay.classList.remove("open");
        tab.setAttribute("aria-expanded", "false");
        tab.focus();
      }

      tab.addEventListener("click", () => {
        panel.classList.contains("open") ? close() : open();
      });
      closeBtn.addEventListener("click", close);
      overlay.addEventListener("click", close);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("open")) close();
      });

      const form = panel.querySelector(".qe-form");
      const status = form.querySelector(".form-status");
      const q = C.quickEnquiry;
      form.addEventListener("submit", (e) => {
        e.preventDefault();
        const endpoint = C.contactSection.form.endpoint;
        const button = form.querySelector("button[type=submit]");

        if (!endpoint) {
          status.textContent = "Quick enquiry isn't fully set up yet — please use WhatsApp instead.";
          status.classList.add("form-status-error");
          return;
        }

        button.disabled = true;
        button.textContent = q.submitLabelSending;
        status.textContent = "";
        status.classList.remove("form-status-error", "form-status-success");

        fetch(endpoint, {
          method: "POST",
          body: new FormData(form),
          headers: { Accept: "application/json" },
        })
          .then((res) => {
            if (res.ok) {
              status.textContent = q.submitLabelSuccess;
              status.classList.add("form-status-success");
              button.textContent = q.submitLabel;
              button.disabled = false;
              form.reset();
            } else {
              throw new Error("Quick enquiry submission failed");
            }
          })
          .catch(() => {
            button.disabled = false;
            button.textContent = q.submitLabel;
            status.textContent = q.submitLabelError;
            status.classList.add("form-status-error");
          });
      });
    },
  };

  window.SLSShared = {
    h, mount, whatsappLink,
    HeaderComponent, FooterComponent, FaqComponent, CtaComponent, ProcessComponent, QuickEnquiryComponent,
  };

  /* ---------------------------------------------------------------------
   * PAGE OBJECT — orchestrates every component (single entry point)
   * ------------------------------------------------------------------- */
  window.SLSPage = {
    components: [
      HeaderComponent, HeroComponent, ValueStripComponent, ProblemComponent,
      ServicesComponent, QuizComponent, WhyComponent, ProcessComponent, WorkComponent,
      TransformComponent, FaqComponent, CtaComponent, ContactComponent, FooterComponent,
      QuickEnquiryComponent,
    ],
    renderAll() {
      this.components.forEach((c) => c.render && c.render());
    },
    bindAll() {
      this.components.forEach((c) => c.bind && c.bind());
    },
  };
})(window, document);
