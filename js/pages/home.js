/**
 * ==========================================================================
 * HOME PAGE — boot wrapper
 * ==========================================================================
 * Thin wrapper around the existing window.SLSPage orchestrator defined in
 * js/components/homeSections.js. Kept separate so main.js can route between
 * "home" and "service" pages without caring about each page's internals.
 * The homepage itself is untouched — same components, same order, same
 * mount points as before.
 * ==========================================================================
 */
(function (window) {
  "use strict";
  window.HomePage = {
    boot() {
      window.SLSPage.renderAll();
      window.SLSPage.bindAll();
    },
  };
})(window);
