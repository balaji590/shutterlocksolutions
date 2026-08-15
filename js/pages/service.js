/**
 * ==========================================================================
 * SERVICE PAGE — boot wrapper
 * ==========================================================================
 * services/index.html is the ONE static shell for all five services.
 * The slug is resolved from the URL query string, e.g.
 *   services/index.html?service=website-development
 *   services/index.html?service=seo
 *
 * This wrapper resolves that slug and delegates to the single reusable
 * window.ServicePage renderer (js/components/servicePage.js). Adding a
 * new service later means adding one object to
 * js/config/content.config.js -> servicesDetail — this file never changes.
 * ==========================================================================
 */
(function (window, document) {
  "use strict";

  function resolveSlug() {
    const params = new URLSearchParams(window.location.search);
    return params.get("service");
  }

  function renderNotFound() {
    const main = document.createElement("section");
    main.className = "problem";
    main.style.paddingTop = "160px";
    main.innerHTML =
      '<div class="p-head reveal in">' +
      '<span class="tag mono">Services</span>' +
      "<h2>We couldn't find that service.</h2>" +
      '<p style="margin-top:14px;color:var(--text-soft);">' +
      'Please choose a service from the homepage, or <a href="../index.html#services" style="color:var(--blue);font-weight:600;">view all services</a>.' +
      "</p></div>";
    document.body.appendChild(main);
  }

  window.ServicePageBoot = {
    boot() {
      const slug = resolveSlug();
      const service = slug && window.SITE_CONTENT.servicesDetail[slug];

      // Header/Footer always render so the page never looks broken, even
      // for an unknown/missing slug.
      window.SLSShared.HeaderComponent.render("../index.html");

      if (!service) {
        console.error("Service page: no matching service for slug '" + slug + "'.");
        renderNotFound();
        window.SLSShared.FooterComponent.render("../index.html");
        window.SLSShared.HeaderComponent.bind();
        return;
      }

      window.ServicePage.render(service);
      window.ServicePage.bind();
    },
  };
})(window, document);
