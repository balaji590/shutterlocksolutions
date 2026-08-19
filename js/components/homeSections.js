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

  // Fires a Google Analytics (GA4) event if gtag is available. Safe no-op
  // otherwise, so nothing breaks if analytics is blocked/unavailable.
  function trackEvent(name, params) {
    if (typeof window.gtag === "function") {
      window.gtag("event", name, params || {});
    }
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
    // Decorative only — every icon sits next to a visible text label, so it
    // is hidden from assistive tech and removed from the tab order.
    return h("svg", {
      class: cls || "", viewBox: "0 0 22 22", width: "16", height: "16", fill: "none",
      "aria-hidden": "true", focusable: "false", html: paths,
    });
  }

  /* ---------------------------------------------------------------------
   * PROCESS ICON REGISTRY — one icon per journey stage. Steps reference an
   * icon by name (content.config.js -> process.steps[].icon).
   * ------------------------------------------------------------------- */
  const PROCESS_ICONS = {
    discover: '<circle cx="10" cy="10" r="6.5" stroke="currentColor" stroke-width="1.7" fill="none"/><path d="M19 19l-4.4-4.4" stroke="currentColor" stroke-width="1.7" stroke-linecap="round"/>',
    plan: '<rect x="3" y="3" width="7.5" height="7.5" rx="1.6" stroke="currentColor" stroke-width="1.7" fill="none"/><rect x="3" y="13.5" width="7.5" height="5.5" rx="1.6" stroke="currentColor" stroke-width="1.7" fill="none"/><rect x="13.5" y="3" width="5.5" height="16" rx="1.6" stroke="currentColor" stroke-width="1.7" fill="none"/>',
    build: '<path d="M7.5 6.5L3 11l4.5 4.5M14.5 6.5L19 11l-4.5 4.5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    grow: '<path d="M3 17l5-5.5 3.5 3L19 5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/><path d="M14 5h5v5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
  };
  function processIcon(key) {
    const paths = PROCESS_ICONS[key] || PROCESS_ICONS.discover;
    return h("svg", {
      viewBox: "0 0 22 22", width: "18", height: "18", fill: "none",
      "aria-hidden": "true", focusable: "false", html: paths,
    });
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

      const logoLink = h("a", { href: basePath ? "../index.html" : "#top", class: "pill-logo", "aria-label": C.brand.name + " home" }, [
        logoImg(assetPrefix),
      ]);

      const deskNav = h("nav", { class: "desknav" }, [
        h("ul", {}, C.nav.map((item) => h("li", {}, [h("a", { href: linkHref(item.href) }, [item.label])]))),
      ]);

      const navRight = h("div", { class: "nav-right" }, [
        h("a", { href: linkHref(C.hero.ctaPrimary.href), class: "nav-cta" }, [C.hero.ctaPrimary.label]),
        h("button", { class: "burger", id: "burgerBtn", "aria-label": "Open menu", "aria-expanded": "false", "aria-controls": "mobileMenu" }, [
          h("span", {}), h("span", {}), h("span", {}),
        ]),
      ]);

      const navPill = h("div", { class: "pill-nav" }, [deskNav, navRight]);

      const header = h("header", { id: "siteHeader", class: basePath ? "always-solid" : "" }, [logoLink, navPill]);

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

      // Business Growth ecosystem — a custom illustration (real client
      // artwork, not stock/AI-generated at request time) showing the six
      // services connected around a central growth platform.
      const visual = h("div", { class: "hero-visual reveal in", id: "hero-visual" }, [
        h("div", { class: "hero-glow" }),
        h("div", { class: "hero-blob", "aria-hidden": "true" }),
        h("picture", {}, [
          h("source", { srcset: "assets/hero-ecosystem.webp", type: "image/webp" }),
          h("img", {
            class: "hero-ecosystem-img", src: "assets/hero-ecosystem.png",
            alt: "Illustration of ShutterLockSolutions' connected digital services — website development, e-commerce, billing software, digital marketing, SEO and AI video — growing a business",
            width: "1400", height: "956", loading: "eager", fetchpriority: "high",
          }),
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
   * JOURNEY — curved digital-growth roadmap (replaces "The Reality" in
   * the render order below). One continuous SVG path connects four large
   * glass nodes in a zigzag flow, with alternating text either side.
   * ------------------------------------------------------------------- */
  const JOURNEY_ICONS = {
    compass: '<circle cx="11" cy="11" r="8.2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M14.3 7.7l-2 4.6-4.6 2 2-4.6 4.6-2z" stroke="currentColor" stroke-width="1.5" fill="none" stroke-linejoin="round"/>',
    route: '<circle cx="5.5" cy="6" r="2.2" stroke="currentColor" stroke-width="1.6" fill="none"/><circle cx="16.5" cy="16" r="2.2" stroke="currentColor" stroke-width="1.6" fill="none"/><path d="M5.5 8.2v2.3a4 4 0 0 0 4 4h3.3a4 4 0 0 1 4 4v-.3" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linecap="round" stroke-dasharray="1 3.2"/>',
    code: '<path d="M7.5 6.5L3 11l4.5 4.5M14.5 6.5L19 11l-4.5 4.5" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>',
    rocket: '<path d="M11 3c2.4 1.2 4 3.7 4 7.2 0 2.4-.9 4.4-2 5.8h-4c-1.1-1.4-2-3.4-2-5.8C7 6.7 8.6 4.2 11 3z" stroke="currentColor" stroke-width="1.6" fill="none" stroke-linejoin="round"/><circle cx="11" cy="9.8" r="1.4" stroke="currentColor" stroke-width="1.4" fill="none"/><path d="M8.3 15.8L6 19M13.7 15.8L16 19M9.5 17.5v2.8M12.5 17.5v2.8" stroke="currentColor" stroke-width="1.4" fill="none" stroke-linecap="round"/>',
  };
  function journeyIcon(key) {
    return h("svg", { viewBox: "0 0 22 22", width: "30", height: "30", fill: "none", "aria-hidden": "true", focusable: "false", html: JOURNEY_ICONS[key] || JOURNEY_ICONS.compass });
  }

  const JourneyComponent = {
    render() {
      const j = C.journey;
      const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      // Right-column map only (matches reference: text always sits to the
      // right of its node, never alternating sides — a two-column layout
      // with the heading fixed on the left, not a full-bleed zigzag).
      // viewBox is intentionally wider than the node spread so there is
      // always generous room for text to the right without ever
      // approaching the column's own edge.
      const nodePos = [
        { x: 480, y: 90 },
        { x: 250, y: 330 },
        { x: 480, y: 570 },
        { x: 250, y: 800 },
      ];
      const pathD = "M480,90 C441,129 250,243 250,330 C250,408 480,492 480,570 C480,648 288,762 250,800";
      const glowColors = ["#735DFF", "#C516E1", "#FF4B6C", "#FFD522"];

      const svgRoute = h("svg", {
        class: "journey-route", viewBox: "0 0 900 860", preserveAspectRatio: "none",
        "aria-hidden": "true", focusable: "false",
      }, [
        h("defs", {}, [
          h("linearGradient", { id: "journeyGrad", x1: "0", y1: "0", x2: "0", y2: "1" }, [
            h("stop", { offset: "0%", "stop-color": "#735DFF" }),
            h("stop", { offset: "38%", "stop-color": "#C516E1" }),
            h("stop", { offset: "70%", "stop-color": "#FF4B6C" }),
            h("stop", { offset: "100%", "stop-color": "#FFD522" }),
          ]),
        ]),
        h("path", { class: "journey-route-glow", d: pathD }),
        h("path", { class: "journey-route-line", d: pathD }),
        h("circle", { class: "journey-route-dot", r: "6" }, reduceMotion ? [] : [
          h("animateMotion", { dur: "9s", repeatCount: "indefinite", path: pathD }),
        ]),
      ]);

      const nodes = j.steps.map((step, i) => {
        const pos = nodePos[i];
        return h("div", {
          class: "journey-node reveal journey-node-" + step.num,
          style: "left:" + (pos.x / 900 * 100) + "%;top:" + (pos.y / 860 * 100) + "%; --node-glow:" + glowColors[i] + ";",
        }, [
          h("div", { class: "journey-halo", "aria-hidden": "true" }),
          h("div", { class: "journey-circle" }, [
            h("span", { class: "journey-badge" }, [step.num]),
            journeyIcon(step.icon),
          ]),
          h("div", { class: "journey-copy" }, [
            h("h3", { style: "color:" + glowColors[i] + ";" }, [step.title.toUpperCase()]),
            h("p", {}, [step.description]),
            h("span", { class: "journey-underline", style: "background:" + glowColors[i] + ";" }, [
              h("span", { class: "journey-underline-dot", style: "background:" + glowColors[i] + ";" }),
            ]),
          ]),
        ]);
      });

      const section = h("section", { class: "journey", id: "about-problem" }, [
        h("div", { class: "journey-blob journey-blob-1", "aria-hidden": "true" }),
        h("div", { class: "journey-blob journey-blob-2", "aria-hidden": "true" }),
        h("div", { class: "journey-grid-texture", "aria-hidden": "true" }),
        h("div", { class: "journey-inner" }, [
          h("div", { class: "journey-head reveal" }, [
            h("span", { class: "tag mono" }, [j.tag]),
            h("h2", {}, [j.heading.replace(j.accentWord, "").trim() + " ", h("span", { class: "journey-accent" }, [j.accentWord])]),
            h("p", {}, [j.lead]),
          ]),
          h("div", { class: "journey-map" }, [svgRoute, ...nodes]),
        ]),
      ]);
      mount("problem-mount", section);
    },
  };

  /* ---------------------------------------------------------------------
   * SERVICES
   * ------------------------------------------------------------------- */
  /* One small dark UI mockup per service icon — the same visual language
     already built for the service-page hero mockups, reused here so each
     bento card has a real visual anchor instead of just an icon + text. */
  function serviceVisualMockup(iconKey) {
    switch (iconKey) {
      case "website":
        return h("div", { "aria-hidden": "true" }, [
          h("div", { class: "browser-bar" }, [
            h("div", { class: "browser-dots" }, [h("span", {}), h("span", {}), h("span", {})]),
            h("div", { class: "browser-url" }, ["shutterlocksolutions.com"]),
          ]),
          h("div", { class: "site-body" }, [
            h("div", { class: "bl w40" }), h("div", { class: "bl w80" }), h("div", { class: "bl w60" }),
            h("div", { class: "hero-block" }),
            h("div", { class: "sv-mock-cta-row" }, [h("span", { class: "sv-mock-pill" }), h("span", { class: "bl w30", style: "margin:0;" })]),
          ]),
        ]);
      case "cart":
        return h("div", { "aria-hidden": "true" }, [
          h("div", { class: "sv-mock-products" }, [1, 2, 3].map(() => h("div", { class: "sv-mock-product" }, [h("span", { class: "sv-mock-thumb" })]))),
          h("div", { class: "sv-mock-cartbar" }, [h("span", { class: "bl w40", style: "margin:0;" }), h("span", { class: "sv-mock-pill" })]),
        ]);
      case "invoice":
        return h("div", { "aria-hidden": "true" }, [
          h("div", { class: "sv-mock-invoice" }, [1, 2].map(() =>
            h("div", { class: "sv-mock-invoice-row" }, [h("span", { class: "bl w40", style: "margin:0;" }), h("span", { class: "bl w20", style: "margin:0;" })])
          )),
          h("div", { class: "sv-mock-invoice-total" }, [h("span", { class: "bl w30", style: "margin:0;" }), h("span", { class: "sv-mock-pill" })]),
        ]);
      case "megaphone":
        return h("div", { class: "sv-mock-social-grid", "aria-hidden": "true" }, [1, 2].map(() =>
          h("div", { class: "sv-mock-social-card" }, [
            h("span", { class: "sv-mock-social-media" }),
            h("div", { class: "sv-mock-social-meta" }, [h("span", { class: "sv-mock-heart" }), h("span", { class: "bl w40", style: "margin:0;width:60%;" })]),
          ])
        ));
      case "search":
        return h("div", { "aria-hidden": "true" }, [
          h("div", { class: "sv-mock-searchbar" }, [h("span", { class: "sv-mock-search-icon" }), h("span", { class: "bl w60", style: "margin:0;" })]),
          h("div", { class: "sv-mock-results" }, [1, 2].map((i) =>
            h("div", { class: "sv-mock-result" }, [h("span", { class: "sv-mock-rank" }, [String(i)]), h("div", { class: "sv-mock-result-text" }, [h("span", { class: "bl w80", style: "margin:0 0 5px;" }), h("span", { class: "bl w40", style: "margin:0;" })])])
          )),
        ]);
      case "video":
        return h("div", { "aria-hidden": "true" }, [
          h("div", { class: "sv-mock-videoframe", style: "margin-bottom:12px;" }, [
            h("span", { class: "sv-mock-play" }, [h("svg", { width: "14", height: "14", viewBox: "0 0 24 24", fill: "none", focusable: "false", html: '<path d="M6 4l14 8-14 8V4z" fill="#fff"/>' })]),
          ]),
          h("div", { class: "sv-mock-waveform" }, [30, 55, 40, 70, 45, 65].map((v) => h("i", { style: "height:" + v + "%" }))),
        ]);
      default:
        return h("div", {});
    }
  }

  const ServicesComponent = {
    render() {
      const arrowIcon = () => h("span", { class: "svc-arrow", "aria-hidden": "true" }, [
        h("svg", { width: "15", height: "15", viewBox: "0 0 14 14", focusable: "false", html:
          '<path d="M3 11L11 3M11 3H4M11 3V10" stroke="currentColor" stroke-width="1.7" fill="none" stroke-linecap="round" stroke-linejoin="round"/>' }),
      ]);

      const section = h("section", { class: "services", id: "services" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [C.services.tag]),
          h("h2", {}, [C.services.heading]),
        ]),
        h("div", { class: "service-grid" }, C.services.items.map((s) =>
          // Website Development is the large anchor card of the bento
          // composition (see .service-card:nth-child(1) in style.css) —
          // it's also the most common reason a business owner gets in
          // touch, so the emphasis lines up with real content, not chance.
          h("a", {
            class: "service-card reveal" + (s.slug === "website-development" ? " is-featured" : ""),
            href: "services/index.html?service=" + s.slug,
          }, [
            h("div", { class: "svc-visual" }, [serviceVisualMockup(s.icon)]),
            h("div", { class: "svc-top" }, [
              h("span", { class: "svc-badge", "aria-hidden": "true" }, [serviceIcon(s.icon)]),
              h("span", { class: "svc-num" }, [s.num]),
            ]),
            h("h3", {}, [s.title]),
            h("p", {}, [s.description]),
            h("span", { class: "svc-link" }, [
              h("span", {}, ["Learn more"]),
              arrowIcon(),
            ]),
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
            h("h3", {}, [w.title]),
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
        h("ol", { class: "process-track" }, data.steps.map((s) =>
          h("li", { class: "process-node reveal" }, [
            h("div", { class: "pn-head" }, [
              h("span", { class: "pdot" }, [s.icon ? processIcon(s.icon) : null]),
              h("span", { class: "pnum" }, [s.num]),
            ]),
            h("div", { class: "pn-body" }, [
              h("h3", {}, [s.title]),
              s.label ? h("span", { class: "pn-label" }, [s.label]) : null,
              h("p", {}, [s.description]),
            ]),
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
      const projects = (C.work.hasProjects && C.work.projects) || [];
      const featured = projects.filter((p) => p.featured);
      const others = projects.filter((p) => !p.featured);

      // Stylised browser preview. This is deliberately an abstract
      // representation of the project's layout, not a screenshot — the repo
      // has no project imagery and none is invented here.
      const buildPreview = (p) =>
        h("div", { class: "cs-visual reveal" }, [
          h("div", { class: "cs-frame" }, [
            h("div", { class: "browser-bar" }, [
              h("div", { class: "browser-dots" }, [h("span", {}), h("span", {}), h("span", {})]),
              h("div", { class: "browser-url" }, [p.previewUrl || ""]),
            ]),
            p.previewImage
              ? h("img", { class: "cs-screenshot", src: p.previewImage, alt: p.previewImageAlt || (p.title + " website screenshot"), loading: "lazy" })
              : h("div", { class: "cs-screen", "aria-hidden": "true" }, [
                  h("div", { class: "cs-shop-head" }, [
                    h("span", { class: "cs-line w30" }),
                    h("span", { class: "cs-pillbar" }),
                  ]),
                  h("div", { class: "cs-products" }, [1, 2, 3, 4, 5, 6].map((i) =>
                    h("div", { class: "cs-product" }, [
                      h("span", { class: "cs-thumb" }),
                      h("span", { class: "cs-line w80" }),
                      h("span", { class: "cs-line w40" }),
                    ])
                  )),
                  h("div", { class: "cs-cartbar" }, [
                    h("span", { class: "cs-line w30" }),
                    h("span", { class: "cs-cta" }),
                  ]),
                ]),
          ]),
        ]);

      const buildCaseStudy = (p) =>
        h("article", { class: "case-study" }, [
          buildPreview(p),
          h("div", { class: "cs-info reveal" }, [
            h("span", { class: "tag mono cs-tag" }, ["Featured Project"]),
            h("h3", {}, [p.title]),
            p.category ? h("p", { class: "cs-category" }, [p.category]) : null,
            h("p", { class: "cs-desc" }, [p.description]),
            p.capabilities && p.capabilities.length
              ? h("ul", { class: "cs-caps" }, p.capabilities.map((c) => h("li", {}, [c])))
              : null,
            p.meta && p.meta.length
              ? h("dl", { class: "cs-meta" }, p.meta.reduce((acc, m) => {
                  acc.push(h("div", {}, [h("dt", {}, [m.label]), h("dd", {}, [m.value])]));
                  return acc;
                }, []))
              : null,
            p.link
              ? h("a", { class: "btn-primary cs-cta-btn", href: p.link, target: "_blank", rel: "noopener" }, [
                  (p.ctaLabel || "View Project") + " →",
                ])
              : null,
          ]),
        ]);

      let body;
      if (featured.length) {
        body = h("div", { class: "cs-wrap" }, [
          ...featured.map(buildCaseStudy),
          // Additional (non-featured) projects fall back to the compact card
          // grid, so future entries need no component changes.
          others.length
            ? h("div", { class: "work-grid reveal" }, others.map((p) =>
                p.link
                  ? h("a", { class: "work-card", href: p.link, target: "_blank", rel: "noopener" }, [
                      h("h3", {}, [p.title]), h("p", {}, [p.description]),
                      h("span", { class: "work-card-link" }, ["Visit site →"]),
                    ])
                  : h("div", { class: "work-card" }, [h("h3", {}, [p.title]), h("p", {}, [p.description])])
              ))
            : null,
        ]);
      } else if (others.length) {
        body = h("div", { class: "work-grid reveal" }, others.map((p) =>
          p.link
            ? h("a", { class: "work-card", href: p.link, target: "_blank", rel: "noopener" }, [
                h("h3", {}, [p.title]), h("p", {}, [p.description]),
                h("span", { class: "work-card-link" }, ["Visit site →"]),
              ])
            : h("div", { class: "work-card" }, [h("h3", {}, [p.title]), h("p", {}, [p.description])])
        ));
      } else {
        body = h("div", { class: "work-empty reveal" }, [
          h("div", { class: "wmark" }, [
            h("svg", { width: "24", height: "24", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", html:
              '<path d="M12 2v20M2 12h20" stroke="#735DFF" stroke-width="1.6"/>' }),
          ]),
          h("h3", {}, [C.work.emptyState.title]),
          h("p", {}, [C.work.emptyState.description]),
          h("a", { href: C.work.emptyState.cta.href, class: "btn-outline", style: "color:var(--text-dark);border-color:var(--paper-line);" }, [C.work.emptyState.cta.label]),
        ]);
      }

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
  /* ---------------------------------------------------------------------
   * AI VIDEO — homepage teaser for the AI Promotional Videos service.
   * Reuses the video-frame/waveform mockup built for the service page
   * (Phase 2) and the capability-chip styling from the portfolio case
   * study — no new visual system introduced for this section.
   * ------------------------------------------------------------------- */
  const AiVideoComponent = {
    render() {
      const av = C.aiVideoSection;
      const words = av.heading.split(" ");
      const splitAt = Math.max(words.length - (av.headingAccentWords || 1), 0);
      const plain = words.slice(0, splitAt).join(" ");
      const accent = words.slice(splitAt).join(" ");

      const visual = h("div", { class: "av-visual reveal" }, [
        h("div", { class: "av-frame" }, [
          h("div", { class: "sv-mock-videoframe", style: "margin-bottom:0;height:150px;" }, [
            h("span", { class: "sv-mock-play" }, [
              h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", html: '<path d="M6 4l14 8-14 8V4z" fill="#fff"/>' }),
            ]),
          ]),
          h("div", { class: "sv-mock-waveform", style: "margin-top:16px;" }, [30, 55, 40, 70, 45, 65, 35, 60, 42, 50].map((v) => h("i", { style: "height:" + v + "%" }))),
        ]),
        // Vertical reel preview — a second device layer signalling the
        // output is native to short-form/social video, not a flat panel.
        h("div", { class: "av-reel", "aria-hidden": "true" }, [
          h("div", { class: "reel-fill" }, [
            h("span", { class: "reel-play" }, [h("svg", { width: "10", height: "10", viewBox: "0 0 24 24", fill: "none", focusable: "false", html: '<path d="M6 4l14 8-14 8V4z" fill="#15152A"/>' })]),
          ]),
          h("div", { class: "reel-bar", style: "width:70%;" }), h("div", { class: "reel-bar", style: "width:45%;" }),
        ]),
        h("div", { class: "av-chip", "aria-hidden": "true" }, [h("span", { class: "dot" }), "AI-generated"]),
      ]);

      const info = h("div", { class: "av-info reveal" }, [
        h("span", { class: "tag mono" }, [av.tag]),
        h("h2", {}, [plain + (plain ? " " : ""), h("span", { class: "av-accent" }, [accent])]),
        h("p", {}, [av.lead]),
        h("ul", { class: "cs-caps av-caps" }, av.capabilities.map((c) => h("li", {}, [c]))),
        h("a", { class: "btn-primary", href: "services/index.html?service=ai-promotional-videos" }, [av.ctaLabel + " →"]),
      ]);

      const section = h("section", { class: "ai-video" }, [
        h("div", { class: "av-grid" }, [visual, info]),
      ]);
      mount("aivideo-mount", section);
    },
  };

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
            h("h3", {}, [C.transform.before.title]),
            list(C.transform.before.points),
          ]),
          h("div", { class: "tf-arrow", "aria-hidden": "true" }, [
            h("svg", { width: "18", height: "18", viewBox: "0 0 18 18", html:
              '<path d="M3 9h12M11 5l4 4-4 4" stroke="#fff" stroke-width="1.8" fill="none"/>' }),
          ]),
          h("div", { class: "tf-panel tf-after" }, [
            h("span", { class: "lbl mono" }, [C.transform.after.label]),
            h("h3", {}, [C.transform.after.title]),
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
      const f = C.contactSection.form;
      const icon = (pathHtml) => h("div", { class: "ic" }, [h("svg", { width: "20", height: "20", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", focusable: "false", html: pathHtml })]);

      const details = h("div", { class: "contact-details reveal" }, [
        h("div", { class: "cdrow" }, [
          icon('<path d="M20.5 3.5A11 11 0 003.7 17.4L3 21l3.7-1a11 11 0 0013.8-16.5z" stroke="#735DFF" stroke-width="1.6"/>'),
          h("div", {}, [h("small", {}, ["WhatsApp"]), h("a", { href: whatsappLink(), target: "_blank", rel: "noopener" }, [C.contact.phoneDisplay])]),
        ]),
        h("div", { class: "cdrow" }, [
          icon('<path d="M3 5c0 9 7 16 16 16l3-4-6-3-2 2c-2-1-4-3-5-5l2-2-3-6-4 1" stroke="#735DFF" stroke-width="1.6" stroke-linejoin="round"/>'),
          h("div", {}, [h("small", {}, ["Phone"]), h("a", { href: "tel:" + C.contact.phoneE164 }, [C.contact.phoneDisplay])]),
        ]),
        h("div", { class: "cdrow" }, [
          icon('<rect x="3" y="5" width="18" height="14" rx="2" stroke="#735DFF" stroke-width="1.6"/><path d="M3 7l9 6 9-6" stroke="#735DFF" stroke-width="1.6"/>'),
          h("div", {}, [h("small", {}, ["Email"]), h("a", { href: "mailto:" + C.contact.email }, [C.contact.email])]),
        ]),
      ]);

      const reassurance = (C.contactSection.reassurance || []).length
        ? h("ul", { class: "contact-reassure reveal" }, C.contactSection.reassurance.map((r) =>
            h("li", {}, [
              h("svg", { width: "15", height: "15", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", focusable: "false",
                html: '<path d="M4 12.5l5 5L20 6.5" stroke="#735DFF" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>' }),
              r,
            ])
          ))
        : null;

      // Fields are built from config so labels/order/types stay in one place.
      // The `name` attribute is passed through verbatim — Formspree depends
      // on these exact values.
      const buildField = (fd) => {
        const id = "cf-" + fd.name;
        const labelNode = h("label", { for: id }, [
          fd.label,
          fd.required ? h("span", { class: "req", "aria-hidden": "true" }, [" *"]) : null,
        ]);

        let control;
        if (fd.type === "select") {
          control = h("select", {
            id, name: fd.name,
            ...(fd.required ? { required: "required" } : {}),
          }, [
            h("option", { value: "", disabled: "disabled", selected: "selected" }, [f.servicePlaceholder || "Select"]),
            ...f.services.map((s) => h("option", {}, [s])),
          ]);
        } else if (fd.type === "textarea") {
          control = h("textarea", {
            id, name: fd.name, rows: String(fd.rows || 4),
            ...(fd.required ? { required: "required" } : {}),
          });
        } else {
          control = h("input", {
            id, name: fd.name, type: fd.type,
            ...(fd.autocomplete ? { autocomplete: fd.autocomplete } : {}),
            ...(fd.required ? { required: "required" } : {}),
          });
        }
        return h("div", { class: "field" + (fd.half ? " field-half" : "") }, [labelNode, control]);
      };

      const form = h("form", { class: "enquiry reveal" }, [
        h("div", { class: "field-grid" }, f.fields.map(buildField)),
        f.requiredNote ? h("p", { class: "form-required-note" }, [f.requiredNote]) : null,
        h("button", { type: "submit" }, [f.submitLabel]),
        f.submitNote ? h("p", { class: "form-submit-note" }, [f.submitNote]) : null,
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
              trackEvent("generate_lead", { form_name: "contact_form" });
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
        h("div", { class: "contact-left" }, [
          h("div", { class: "p-head reveal" }, [
            h("span", { class: "tag mono" }, [C.contactSection.tag]),
            h("h2", {}, [C.contactSection.heading]),
            C.contactSection.lead ? h("p", {}, [C.contactSection.lead]) : null,
          ]),
          details,
          reassurance,
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
            h("div", { class: "logo" }, [logoImg(assetPrefix), C.brand.name]),
            h("p", {}, [C.brand.tagline]),
            h("div", { class: "foot-social" }, [
              h("a", { href: C.social.instagram, target: "_blank", rel: "noopener", "aria-label": "ShutterLockSolutions on Instagram" }, [
                h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", focusable: "false", html:
                  '<rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" stroke-width="1.7"/><circle cx="12" cy="12" r="4.2" stroke="currentColor" stroke-width="1.7"/><circle cx="17.3" cy="6.7" r="1.1" fill="currentColor"/>' }),
              ]),
              h("a", { href: C.social.facebook, target: "_blank", rel: "noopener", "aria-label": "ShutterLockSolutions on Facebook" }, [
                h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", focusable: "false", html:
                  '<path d="M15 8.5h2V5.3c-.35-.05-1.55-.15-2.96-.15-2.93 0-4.94 1.79-4.94 5.08v2.77H6v3.6h3.1V21h3.7v-4.4h3l.48-3.6h-3.48v-2.4c0-1.04.29-1.75 1.78-1.75z" fill="currentColor"/>' }),
              ]),
            ]),
          ]),
          h("div", {}, [
            h("h3", {}, ["Services"]),
            h("ul", {}, C.services.items.map((s) => h("li", {}, [h("a", { href: basePath ? "index.html?service=" + s.slug : "services/index.html?service=" + s.slug }, [s.title])]))),
          ]),
          h("div", {}, [
            h("h3", {}, ["Quick Links"]),
            h("ul", {}, C.footer.quickLinks.map((l) => h("li", {}, [h("a", { href: linkHref(l.href) }, [l.label])]))),
          ]),
          h("div", {}, [
            h("h3", {}, ["Contact"]),
            h("ul", {}, [
              h("li", {}, [h("a", { href: "tel:" + C.contact.phoneE164 }, [C.contact.phoneDisplay])]),
              h("li", {}, [h("a", { href: "mailto:" + C.contact.email }, [C.contact.email])]),
            ]),
          ]),
        ]),
        h("div", { class: "foot-bottom" }, [
          h("span", {}, ["© " + C.footer.year + " " + C.brand.name + ". All rights reserved."]),
          h("span", { style: "display:flex;gap:16px;align-items:center;flex-wrap:wrap;" }, [
            h("a", { href: basePath ? "../privacy/index.html" : "privacy/index.html", style: "text-decoration:underline;text-underline-offset:3px;" }, ["Privacy Policy"]),
            h("span", {}, [C.footer.bottomNote]),
          ]),
        ]),
      ]);
      mount("footer-mount", footer);

      const waFloat = h("a", { class: "wa-float", href: whatsappLink(), target: "_blank", rel: "noopener", "aria-label": "Chat on WhatsApp" }, [
        h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", focusable: "false", html: '<path d="M20.5 3.5A11 11 0 003.7 17.4L3 21l3.7-1a11 11 0 0013.8-16.5z" stroke="#fff" stroke-width="1.8"/>' }),
        h("span", { class: "wa-text" }, ["Let's Talk"]),
      ]);
      document.body.appendChild(waFloat);

      // Sticky mobile Call + WhatsApp bar — mobile-only (see CSS), hidden on
      // desktop. The existing wa-float button is hidden on mobile via CSS
      // once this bar is present, so there's no duplicate WhatsApp CTA.
      const mobileBar = h("div", { class: "mobile-cta-bar" }, [
        h("a", { href: "tel:" + C.contact.phoneE164, class: "mcb-btn mcb-call" }, [
          h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", focusable: "false", html: '<path d="M3 5c0 9 7 16 16 16l3-4-6-3-2 2c-2-1-4-3-5-5l2-2-3-6-4 1" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"/>' }),
          "Call Now",
        ]),
        h("a", { href: whatsappLink(), target: "_blank", rel: "noopener", class: "mcb-btn mcb-wa" }, [
          h("svg", { width: "18", height: "18", viewBox: "0 0 24 24", fill: "none", "aria-hidden": "true", focusable: "false", html: '<path d="M20.5 3.5A11 11 0 003.7 17.4L3 21l3.7-1a11 11 0 0013.8-16.5z" stroke="currentColor" stroke-width="1.8"/>' }),
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
      document.body.appendChild(panel);
    },
    bind() {
      const panel = document.getElementById("qePanel");
      const overlay = document.getElementById("qeOverlay");
      const closeBtn = document.getElementById("qeClose");
      if (!panel || !overlay) return;

      let lastFocused = null;
      function open() {
        lastFocused = document.activeElement;
        panel.classList.add("open");
        overlay.classList.add("open");
        const firstInput = panel.querySelector("input");
        if (firstInput) firstInput.focus();
      }
      function close() {
        panel.classList.remove("open");
        overlay.classList.remove("open");
        if (lastFocused && typeof lastFocused.focus === "function") lastFocused.focus();
      }

      closeBtn.addEventListener("click", close);
      overlay.addEventListener("click", close);
      document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && panel.classList.contains("open")) close();
      });

      // Center-screen popup shown automatically, once per browser session,
      // shortly after the visitor arrives — no side tab to click. If they
      // close it (✕, overlay click, or Escape), it stays closed for the
      // rest of the session and does not reappear.
      const AUTO_OPEN_KEY = "sls_qe_auto_shown";
      try {
        if (!sessionStorage.getItem(AUTO_OPEN_KEY)) {
          setTimeout(() => {
            if (!panel.classList.contains("open")) open();
            try { sessionStorage.setItem(AUTO_OPEN_KEY, "1"); } catch (err) {}
          }, 1500);
        }
      } catch (err) {
        // sessionStorage unavailable (e.g. strict privacy mode) — fall back
        // to a one-time auto-open for this page load only.
        setTimeout(() => { if (!panel.classList.contains("open")) open(); }, 4000);
      }

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
              trackEvent("generate_lead", { form_name: "quick_enquiry_popup" });
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
      // Order follows the target scroll-story:
      // Hero -> Trust strip -> Journey -> Services -> Quiz -> Why ->
      // Portfolio -> Process -> Benefits -> FAQ -> CTA -> Contact -> Footer
      HeaderComponent, HeroComponent, ValueStripComponent, JourneyComponent,
      ServicesComponent, QuizComponent, WhyComponent, WorkComponent, AiVideoComponent, ProcessComponent,
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
