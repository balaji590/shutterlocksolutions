/**
 * ==========================================================================
 * APP ENTRY POINT
 * ==========================================================================
 * Boots the page: renders every component from content.config.js,
 * binds interactions, and sets up scroll-reveal with a safe fallback
 * for browsers without IntersectionObserver.
 * ==========================================================================
 */
(function (window, document) {
  "use strict";

  function initScrollReveal() {
    const revealEls = document.querySelectorAll(".reveal");
    if (!("IntersectionObserver" in window)) {
      // Fallback for older browsers: show content immediately, no animation gate.
      revealEls.forEach((el) => el.classList.add("in"));
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealEls.forEach((el) => io.observe(el));

    // Journey route draw: adds .in-view to the section once, which drives
    // the stroke-dashoffset transition in CSS. Desktop-only concern (the
    // route SVG is hidden on mobile), but harmless to run everywhere.
    const journeySection = document.querySelector(".journey");
    if (journeySection && "IntersectionObserver" in window) {
      const jio = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              journeySection.classList.add("in-view");
              jio.unobserve(entry.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      jio.observe(journeySection);
    }
  }

  function initSmoothAnchors() {
    // Native scroll-behavior:smooth is used via CSS; this only fixes
    // browsers (older Safari) that ignore it, using a light JS fallback.
    const supportsNativeSmooth = "scrollBehavior" in document.documentElement.style;
    if (supportsNativeSmooth) return;

    document.addEventListener("click", (e) => {
      const link = e.target.closest('a[href^="#"]');
      if (!link) return;
      const id = link.getAttribute("href").slice(1);
      const target = document.getElementById(id);
      if (!target) return;
      e.preventDefault();
      const headerOffset = 88;
      const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset;
      window.scrollTo({ top, left: 0 });
    });
  }

  function initAnalyticsClickTracking() {
    // Delegated on document so every WhatsApp/call/CTA link on every page
    // (header, hero, footer, mobile bar, CTA section, service pages) is
    // covered from one place — no per-component duplication needed.
    document.addEventListener("click", (e) => {
      if (typeof window.gtag !== "function") return;
      const waLink = e.target.closest('a[href*="wa.me"]');
      if (waLink) {
        window.gtag("event", "contact_whatsapp", { link_url: waLink.href });
        return;
      }
      const telLink = e.target.closest('a[href^="tel:"]');
      if (telLink) {
        window.gtag("event", "contact_phone_call", { link_url: telLink.href });
        return;
      }
      const ctaLink = e.target.closest("a.btn-primary, a.nav-cta");
      if (ctaLink) {
        window.gtag("event", "click_start_project", { link_text: (ctaLink.textContent || "").trim() });
      }
    });
  }

  function initStructuredData() {
    const C = window.SITE_CONTENT;
    // LocalBusiness (not the generic bare "Organization") so Google can
    // show hours/area/service richness in local search results. Area-level
    // location only — no exact street address published in structured data.
    const data = {
      "@context": "https://schema.org",
      "@type": "ProfessionalService",
      "name": C.brand.name,
      "url": C.siteUrl,
      "logo": C.siteUrl + C.brand.logoSrc,
      "image": C.siteUrl + C.brand.logoSrc,
      "description": C.brand.tagline,
      "email": C.contact.email,
      "telephone": C.contact.phoneE164,
      "priceRange": "$$",
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Arani",
        "addressRegion": "Tamil Nadu",
        "addressCountry": "IN",
      },
      "areaServed": {
        "@type": "State",
        "name": "Tamil Nadu",
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
        "opens": "09:00",
        "closes": "18:00",
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": C.contact.phoneE164,
        "email": C.contact.email,
        "contactType": "customer service",
        "areaServed": "IN",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);

    // FAQPage schema — only where the FAQ content is actually visible to
    // the user, per Google's structured-data guidelines. That's the
    // homepage (site-wide FAQ) and every service page (each renders its
    // own service-specific FAQ section) — not the legal/404 shells, which
    // have no FAQ content at all.
    const pageType = document.body.getAttribute("data-page");
    let faqItems = null;
    if (pageType !== "service" && pageType !== "legal" && pageType !== "notfound"
      && C.faq && C.faq.items && C.faq.items.length) {
      faqItems = C.faq.items;
    } else if (pageType === "service") {
      const params = new URLSearchParams(window.location.search);
      const slug = params.get("service");
      const service = slug && C.servicesDetail && C.servicesDetail[slug];
      if (service && service.faqs && service.faqs.length) {
        faqItems = service.faqs;
      }
    }
    if (faqItems) {
      const faqData = {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": faqItems.map((item) => ({
          "@type": "Question",
          "name": item.q,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.a,
          },
        })),
      };
      const faqScript = document.createElement("script");
      faqScript.type = "application/ld+json";
      faqScript.textContent = JSON.stringify(faqData);
      document.head.appendChild(faqScript);
    }
  }

  function boot() {
    if (!window.SITE_CONTENT) {
      console.error("ShutterLockSolutions: content configuration failed to load.");
      return;
    }
    const pageType = document.body.getAttribute("data-page") || "home";

    if (pageType === "service") {
      if (!window.ServicePageBoot) {
        console.error("ShutterLockSolutions: service page scripts failed to load.");
        return;
      }
      window.ServicePageBoot.boot();
    } else if (pageType === "legal") {
      if (!window.LegalPageBoot) {
        console.error("ShutterLockSolutions: legal page scripts failed to load.");
        return;
      }
      window.LegalPageBoot.boot();
    } else if (pageType === "notfound") {
      if (!window.NotFoundBoot) {
        console.error("ShutterLockSolutions: 404 page scripts failed to load.");
        return;
      }
      window.NotFoundBoot.boot();
    } else {
      if (!window.HomePage) {
        console.error("ShutterLockSolutions: homepage scripts failed to load.");
        return;
      }
      window.HomePage.boot();
    }

    initStructuredData();
    initScrollReveal();
    initSmoothAnchors();
    initAnalyticsClickTracking();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window, document);
