# ShutterLockSolutions — Website

A static, config-driven website for ShutterLockSolutions. No build step, no
framework, no server required — open `index.html` in a browser or deploy
the folder as-is to any static host.

## Structure

```text
├── index.html                     Homepage shell (mount points only)
├── services/
│   └── index.html                 Single reusable shell for all 5 service pages
│                                   (resolves ?service=<slug> at runtime)
├── css/
│   └── style.css                  All styles, design tokens, responsive rules
├── assets/
│   └── logo-mark.png              Brand logo
└── js/
    ├── config/
    │   └── content.config.js      SINGLE SOURCE OF TRUTH for all content —
    │                               business info, services, FAQ, copy, etc.
    ├── components/
    │   ├── homeSections.js        Shared components: Header, Footer, Hero,
    │   │                          Services, FAQ, CTA, Process, etc.
    │   └── servicePage.js         Reusable renderer for /services/?service=<slug>
    ├── pages/
    │   ├── home.js                Boots the homepage
    │   └── service.js             Resolves slug, boots a service page
    └── main.js                    Entry point — routes to home or service page
```

## Making common changes

| Change                          | File to edit                                   |
|----------------------------------|------------------------------------------------|
| Phone / WhatsApp number, email   | `js/config/content.config.js` → `contact`       |
| Contact form email delivery      | `js/config/content.config.js` → `contactSection.form.endpoint` (get from [formspree.io](https://formspree.io)) |
| Add/edit a service               | `js/config/content.config.js` → `servicesDetail`|
| Homepage copy (hero, FAQ, etc.)  | `js/config/content.config.js`                   |
| Visual design / spacing / colors | `css/style.css`                                 |
| Logo                             | `assets/logo-mark.png` + `content.config.js` → `brand.logoSrc` |

No business content is hardcoded in HTML or component files — everything
renders from `content.config.js` at runtime.

## Running locally

Any static file server works, e.g.:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

Opening `index.html` directly by double-clicking also works, but a local
server is recommended so relative paths behave exactly like production.

## Service pages

All 5 services (`website-development`, `ecommerce`, `billing-software`,
`digital-marketing`, `seo`) are served by the **same** file,
`services/index.html`, via a `?service=<slug>` query parameter — e.g.:

```text
services/index.html?service=seo
```

Adding a 6th service means adding one object to `servicesDetail` in
`content.config.js` — no new HTML files needed.

## Deploying

This is a static site — any static host works (GitHub Pages, Netlify,
Vercel, Cloudflare Pages, S3, etc.). No build command is required; deploy
the repository root as-is.
