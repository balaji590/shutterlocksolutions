/**
 * ==========================================================================
 * SERVICE PAGE — reusable component (Page Object Model)
 * ==========================================================================
 * ONE component renders services/index.html for all five services. It
 * receives a single resolved service data object (from content.config.js
 * -> servicesDetail[slug], resolved by js/pages/service.js from the URL
 * ?service=<slug> query string) and builds Breadcrumbs, Hero, Problem,
 * Solution, Features and Benefits.
 *
 * Header, Footer, Process, FAQ and CTA are NOT duplicated here — they are
 * the exact same components used on the homepage, imported from
 * js/components/homeSections.js via window.SLSShared, just called with
 * service-specific data instead of homepage data.
 *
 * To add a new service: add ONE object to
 * content.config.js -> servicesDetail. No new HTML, no new component code.
 * ==========================================================================
 */
(function (window, document) {
  "use strict";

  const Shared = window.SLSShared;
  const h = Shared.h;
  const mount = Shared.mount;
  const C = window.SITE_CONTENT;

  /* ---------------------------------------------------------------------
   * BREADCRUMBS
   * ------------------------------------------------------------------- */
  const Breadcrumbs = {
    render(service, mountId) {
      const nav = h("nav", { class: "breadcrumbs reveal in", "aria-label": "Breadcrumb" }, [
        h("ol", {}, [
          h("li", {}, [h("a", { href: "../index.html" }, ["Home"])]),
          h("li", { "aria-hidden": "true" }, ["/"]),
          h("li", {}, [h("a", { href: "../index.html#services" }, ["Services"])]),
          h("li", { "aria-hidden": "true" }, ["/"]),
          h("li", { "aria-current": "page" }, [service.navLabel]),
        ]),
      ]);
      mount(mountId, nav);
    },
  };

  /* ---------------------------------------------------------------------
   * SERVICE HERO
   * ------------------------------------------------------------------- */
  /* ---------------------------------------------------------------------
   * SERVICE-SPECIFIC HERO VISUALS — one distinct mockup per service icon,
   * rendered inside the same browser-chrome frame. Falls back to the
   * generic "website" layout for any icon not covered.
   * ------------------------------------------------------------------- */
  function buildScreenContent(service) {
    // service.icon doesn't exist on servicesDetail entries — icon is
    // defined once on services.items (the homepage list) and looked up
    // here by slug, so there's no duplicated icon data between the two.
    const match = C.services.items.find((s) => s.slug === service.slug);
    const icon = match && match.icon;

    if (icon === "cart") {
      // E-commerce: small product grid + cart total bar.
      return [
        h("div", { class: "sv-mock-products" }, [1, 2, 3].map(() =>
          h("div", { class: "sv-mock-product" }, [
            h("span", { class: "sv-mock-thumb" }),
            h("span", { class: "bl w80" }),
            h("span", { class: "bl w40" }),
          ])
        )),
        h("div", { class: "sv-mock-cartbar" }, [
          h("span", { class: "bl w30" }),
          h("span", { class: "sv-mock-pill" }),
        ]),
      ];
    }

    if (icon === "invoice") {
      // Billing: invoice line items + total row.
      return [
        h("div", { class: "sv-mock-invoice" }, [1, 2, 3].map(() =>
          h("div", { class: "sv-mock-invoice-row" }, [
            h("span", { class: "bl w60" }),
            h("span", { class: "bl w20" }),
          ])
        )),
        h("div", { class: "sv-mock-invoice-total" }, [
          h("span", { class: "bl w30" }),
          h("span", { class: "sv-mock-pill" }),
        ]),
      ];
    }

    if (icon === "megaphone") {
      // Digital Marketing: social post grid with engagement row.
      return [
        h("div", { class: "sv-mock-social-grid" }, [1, 2, 3, 4].map(() =>
          h("div", { class: "sv-mock-social-card" }, [
            h("span", { class: "sv-mock-social-media" }),
            h("div", { class: "sv-mock-social-meta" }, [
              h("span", { class: "bl w60" }),
              h("span", { class: "sv-mock-heart" }),
            ]),
          ])
        )),
      ];
    }

    if (icon === "search") {
      // SEO: search bar + ranked result rows.
      return [
        h("div", { class: "sv-mock-searchbar" }, [
          h("span", { class: "sv-mock-search-icon" }),
          h("span", { class: "bl w40" }),
        ]),
        h("div", { class: "sv-mock-results" }, [1, 2, 3].map((i) =>
          h("div", { class: "sv-mock-result" }, [
            h("span", { class: "sv-mock-rank" }, [String(i)]),
            h("div", { class: "sv-mock-result-text" }, [
              h("span", { class: "bl w60" }),
              h("span", { class: "bl w80", style: "opacity:.5;margin-top:6px;" }),
            ]),
          ])
        )),
      ];
    }

    if (icon === "video") {
      // AI Promotional Videos: real client work sample (Eco Connex promo),
      // not a mockup — this is the one service where a live example is
      // more convincing than an animated placeholder. Falls back to the
      // waveform-only mockup below it for extra visual rhythm.
      return [
        h("video", {
          class: "sv-real-video", poster: "../assets/video/ecoconnex-promo-poster.jpg",
          controls: "controls", preload: "metadata", playsinline: "playsinline",
        }, [
          h("source", { src: "../assets/video/ecoconnex-promo.mp4", type: "video/mp4" }),
        ]),
        h("div", { class: "sv-mock-waveform", style: "margin-top:14px;" }, [30, 55, 40, 70, 45, 65, 35, 60, 42].map((v) => h("i", { style: "height:" + v + "%" }))),
      ];
    }

    // Default (website-development and any other/future icon): generic
    // homepage-style layout — nav lines + large hero block.
    return [
      h("div", { class: "bl w40" }), h("div", { class: "bl w80" }), h("div", { class: "bl w60" }),
      h("div", { class: "hero-block" }),
    ];
  }

  const ServiceHero = {
    render(service, mountId) {
      const hero = service.hero;
      const words = hero.headline.split(" ");
      const splitAt = Math.max(words.length - (hero.headlineAccentWords || 2), 0);
      const plain = words.slice(0, splitAt).join(" ");
      const accent = words.slice(splitAt).join(" ");

      const copy = h("div", { class: "hero-copy reveal in" }, [
        h("span", { class: "eyebrow" }, [hero.eyebrow]),
        h("h1", {}, [plain + (plain ? " " : ""), h("span", { class: "accent" }, [accent])]),
        h("p", { class: "lead" }, [hero.description]),
        h("div", { class: "hero-actions" }, [
          h("a", { href: "../index.html#contact", class: "btn-primary" }, [hero.ctaPrimary.label + " →"]),
          h("a", { href: Shared.whatsappLink(), target: "_blank", rel: "noopener", class: "btn-outline" }, [hero.ctaSecondary.label]),
        ]),
      ]);

      // Service-specific visual. Services with a dedicated `hero.banner`
      // (website-development, ecommerce, billing-software,
      // digital-marketing, seo) render that real photo/composite
      // edge-to-edge inside the same .card-site box, with no browser-dots
      // chrome overlaying it. Services without a `hero.banner` (currently
      // only ai-promotional-videos, which renders its own real
      // <video>/poster via buildScreenContent) keep the original
      // browser-chrome + buildScreenContent() treatment untouched.
      const cardSiteChildren = service.hero.banner
        ? [
            h("picture", { class: "svc-banner-pic" }, [
              h("source", { srcset: "../assets/images/banners/" + service.hero.banner + ".webp", type: "image/webp" }),
              h("img", {
                class: "svc-banner-img",
                src: "../assets/images/banners/" + service.hero.banner + ".jpg",
                alt: hero.eyebrow, loading: "eager",
              }),
            ]),
          ]
        : [
            h("div", { class: "browser-dots" }, [h("span", {}), h("span", {}), h("span", {})]),
            ...buildScreenContent(service),
          ];

      const visual = h("div", { class: "hero-visual reveal in" }, [
        h("div", { class: "stack-card card-site" + (service.hero.banner ? " card-site-banner" : ""), style: "width:88%;" }, cardSiteChildren),
      ]);

      const section = h("section", { class: "hero service-hero", id: "top" }, [
        h("div", { class: "hero-grid-lines" }), copy, visual,
      ]);
      mount(mountId, section);
    },
  };

  /* ---------------------------------------------------------------------
   * SERVICE PROBLEM (reuses homepage .problem visual language)
   * ------------------------------------------------------------------- */
  const ServiceProblem = {
    render(service, mountId) {
      const p = service.problem;
      const section = h("section", { class: "problem" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [p.tag]),
          h("h2", {}, [p.heading]),
        ]),
        h("div", { class: "problem-grid" }, p.points.map((point) =>
          h("div", { class: "problem-item reveal" }, [h("span", { class: "x" }, ["✕"]), h("p", {}, [point])])
        )),
      ]);
      mount(mountId, section);
    },
  };

  /* ---------------------------------------------------------------------
   * SERVICE SOLUTION (reuses .solution-banner)
   * ------------------------------------------------------------------- */
  const ServiceSolution = {
    render(service, mountId) {
      const s = service.solution;
      const section = h("section", { class: "service-solution" }, [
        h("div", { class: "solution-banner reveal" }, [
          h("div", {}, [
            h("span", { class: "tag mono", style: "color:var(--blue-bright);display:block;margin-bottom:14px;" }, [s.tag]),
            h("h3", {}, [s.heading]),
            h("p", { style: "color:var(--text-soft);font-size:1rem;line-height:1.65;margin-top:16px;max-width:640px;font-weight:400;" }, [s.body]),
          ]),
        ]),
      ]);
      mount(mountId, section);
    },
  };

  /* ---------------------------------------------------------------------
   * SERVICE FEATURES (reuses homepage .why-grid / .why-card visual system)
   * ------------------------------------------------------------------- */
  const ServiceFeatures = {
    render(service, mountId) {
      const f = service.features;
      const section = h("section", { class: "why" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [f.tag]),
          h("h2", {}, [f.heading]),
        ]),
        h("div", { class: "why-grid" }, f.items.map((item) =>
          h("div", { class: "why-card reveal" }, [
            h("div", { class: "wn" }, [item.num]),
            h("h3", {}, [item.title]),
            h("p", {}, [item.description]),
          ])
        )),
      ]);
      mount(mountId, section);
    },
  };

  /* ---------------------------------------------------------------------
   * SERVICE BENEFITS (checklist, reuses .tf-after check-mark styling)
   * ------------------------------------------------------------------- */
  const ServiceBenefits = {
    render(service, mountId) {
      const b = service.benefits;
      const section = h("section", { class: "transform" }, [
        h("div", { class: "p-head reveal" }, [
          h("span", { class: "tag mono" }, [b.tag]),
          h("h2", {}, [b.heading]),
        ]),
        h("div", { class: "tf-panel tf-after benefits-panel reveal" }, [
          h("ul", {}, b.points.map((point) => h("li", {}, [point]))),
        ]),
      ]);
      mount(mountId, section);
    },
  };

  /* ---------------------------------------------------------------------
   * SEO METADATA (document head, from service.seo)
   * ------------------------------------------------------------------- */
  function applySeo(service) {
    document.title = service.seo.title;
    const setMeta = (name, content, isProperty) => {
      const attr = isProperty ? "property" : "name";
      let tag = document.querySelector(`meta[${attr}="${name}"]`);
      if (!tag) {
        tag = document.createElement("meta");
        tag.setAttribute(attr, name);
        document.head.appendChild(tag);
      }
      tag.setAttribute("content", content);
    };
    const pageUrl = C.siteUrl + "services/index.html?service=" + service.slug;
    const imageUrl = C.siteUrl + C.brand.logoSrc;

    setMeta("description", service.seo.description);
    setMeta("og:title", service.seo.title, true);
    setMeta("og:description", service.seo.description, true);
    setMeta("og:type", "website", true);
    setMeta("og:url", pageUrl, true);
    setMeta("og:image", imageUrl, true);
    setMeta("twitter:card", "summary_large_image");
    setMeta("twitter:title", service.seo.title);
    setMeta("twitter:description", service.seo.description);
    setMeta("twitter:image", imageUrl);

    let canonical = document.querySelector('link[rel="canonical"]');
    if (!canonical) {
      canonical = document.createElement("link");
      canonical.setAttribute("rel", "canonical");
      document.head.appendChild(canonical);
    }
    canonical.setAttribute("href", pageUrl);

    // The static shell ships noindex (it has no service context until JS
    // resolves ?service=). Once a valid service renders, the page is a
    // real, indexable page — remove the fallback directive.
    const robotsFallback = document.getElementById("seo-robots-fallback");
    if (robotsFallback) robotsFallback.remove();
  }

  /* ---------------------------------------------------------------------
   * ORCHESTRATOR — the single ServicePage renderer
   * ------------------------------------------------------------------- */
  window.ServicePage = {
    /**
     * @param {Object} service - a resolved entry from
     *   content.config.js -> servicesDetail[slug]. Slug resolution and
     *   the "service not found" case are handled by js/pages/service.js;
     *   this renderer only ever receives a valid service object.
     */
    render(service) {
      applySeo(service);

      Breadcrumbs.render(service, "breadcrumb-mount");
      ServiceHero.render(service, "service-hero-mount");
      ServiceProblem.render(service, "service-problem-mount");
      ServiceSolution.render(service, "service-solution-mount");
      ServiceFeatures.render(service, "service-features-mount");
      ServiceBenefits.render(service, "service-benefits-mount");
      Shared.ProcessComponent.render(C.process, "process-mount"); // shared, standard process
      Shared.FaqComponent.render({ tag: "FAQ", heading: "Questions about " + service.navLabel, lead: "A few things businesses usually ask before starting.", items: service.faqs }, "faq-mount", "sfaq");
      Shared.CtaComponent.render(
        { heading: service.cta.heading, lead: service.cta.lead, ctaPrimary: { href: "../index.html#contact", label: "Start Your Project" }, ctaSecondary: { label: "WhatsApp Us" } },
        "cta-mount"
      );
      Shared.FooterComponent.render("../index.html");
    },
    bind() {
      Shared.FaqComponent.bind();
    },
  };
})(window, document);
