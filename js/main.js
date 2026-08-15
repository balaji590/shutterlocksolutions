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
    } else {
      if (!window.HomePage) {
        console.error("ShutterLockSolutions: homepage scripts failed to load.");
        return;
      }
      window.HomePage.boot();
    }

    initScrollReveal();
    initSmoothAnchors();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", boot);
  } else {
    boot();
  }
})(window, document);
