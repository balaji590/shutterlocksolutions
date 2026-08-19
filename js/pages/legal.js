/**
 * ==========================================================================
 * LEGAL PAGE — boot wrapper (Privacy Policy)
 * ==========================================================================
 * privacy/index.html is a static, one-level-deep page (same depth as
 * services/index.html), so it reuses the exact same Header/Footer basePath
 * pattern as service pages. Content comes from content.config.js -> legal,
 * so there is still a single source of truth for the site's real contact
 * details and data-collection practices.
 * ==========================================================================
 */
(function (window, document) {
  "use strict";

  window.LegalPageBoot = {
    boot() {
      const h = window.SLSShared.h;
      const mount = window.SLSShared.mount;
      const C = window.SITE_CONTENT;
      const data = C.legal.privacy;

      window.SLSShared.HeaderComponent.render("../index.html");
      window.SLSShared.QuickEnquiryComponent.render();

      const section = h("section", { class: "problem", style: "padding-top:calc(var(--header-h) + 48px);" }, [
        h("div", { class: "p-head reveal in", style: "max-width:820px;" }, [
          h("span", { class: "tag mono" }, ["Legal"]),
          h("h1", {}, [data.heading]),
          h("p", {}, [data.updated]),
        ]),
        h("div", { class: "legal-body reveal in" }, data.sections.map((s) =>
          h("div", { class: "legal-block" }, [
            h("h3", {}, [s.heading]),
            ...s.paragraphs.map((p) => h("p", {}, [p])),
          ])
        )),
      ]);
      document.getElementById("legal-mount").appendChild(section);

      window.SLSShared.FooterComponent.render("../index.html");
      window.SLSShared.HeaderComponent.bind();
      window.SLSShared.QuickEnquiryComponent.bind();
    },
  };
})(window, document);
