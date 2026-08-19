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
    const data = {
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": C.brand.name,
      "url": C.siteUrl,
      "logo": C.siteUrl + C.brand.logoSrc,
      "description": C.brand.tagline,
      "email": C.contact.email,
      "telephone": C.contact.phoneE164,
      "contactPoint": {
        "@type": "ContactPoint",
        "telephone": C.contact.phoneE164,
        "email": C.contact.email,
        "contactType": "customer service",
      },
    };
    const script = document.createElement("script");
    script.type = "application/ld+json";
    script.textContent = JSON.stringify(data);
    document.head.appendChild(script);
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
