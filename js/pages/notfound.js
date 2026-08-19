/**
 * ==========================================================================
 * 404 PAGE — boot wrapper
 * ==========================================================================
 * 404.html sits at the site root (same depth as index.html), so it reuses
 * the Header/Footer "home" basePath ("" — no "../" prefixing needed).
 * Cloudflare Pages automatically serves this file for any unmatched route.
 * ==========================================================================
 */
(function (window, document) {
  "use strict";

  window.NotFoundBoot = {
    boot() {
      const h = window.SLSShared.h;
      const C = window.SITE_CONTENT;

      window.SLSShared.HeaderComponent.render("");
      // HeaderComponent's basePath assumes "" always means "this page has
      // the sections being linked to" (true for the homepage, false here).
      // Patch the logo + nav hash-links to point back to the homepage
      // sections instead of scrolling nowhere on this page.
      const header = document.getElementById("siteHeader");
      if (header) {
        header.querySelectorAll('a[href^="#"]').forEach((a) => {
          a.setAttribute("href", "index.html" + a.getAttribute("href"));
        });
      }
      const mobileMenu = document.getElementById("mobileMenu");
      if (mobileMenu) {
        mobileMenu.querySelectorAll('a[href^="#"]').forEach((a) => {
          a.setAttribute("href", "index.html" + a.getAttribute("href"));
        });
      }
      window.SLSShared.QuickEnquiryComponent.render();

      const section = h("section", { class: "problem", style: "padding-top:calc(var(--header-h) + 80px);padding-bottom:120px;text-align:center;" }, [
        h("div", { class: "p-head reveal in", style: "max-width:560px;margin-left:auto;margin-right:auto;text-align:center;" }, [
          h("span", { class: "tag mono" }, ["404"]),
          h("h1", {}, ["This page doesn't exist."]),
          h("p", {}, ["The page you're looking for may have moved, or the link might be outdated. Let's get you back on track."]),
        ]),
        h("div", { style: "display:flex;gap:14px;justify-content:center;flex-wrap:wrap;margin-top:12px;" }, [
          h("a", { href: "index.html", class: "btn-primary" }, ["Back to Home →"]),
          h("a", { href: "index.html#services", class: "btn-outline" }, ["View Services"]),
        ]),
      ]);
      document.getElementById("notfound-mount").appendChild(section);

      window.SLSShared.FooterComponent.render("");
      window.SLSShared.HeaderComponent.bind();
      window.SLSShared.QuickEnquiryComponent.bind();
    },
  };
})(window, document);
