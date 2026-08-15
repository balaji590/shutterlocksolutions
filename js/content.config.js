/**
 * ==========================================================================
 * SHUTTERLOCKSOLUTIONS — CONTENT CONFIGURATION
 * ==========================================================================
 * This is the ONLY file that should change for routine content updates:
 * phone number, email, services, FAQ, process steps, WhatsApp message, etc.
 *
 * Nothing below is rendered directly in HTML — every section in index.html
 * is built at runtime by js/components.js reading this object (Page Object
 * Model pattern: DATA -> COMPONENT BUILDER -> DOM).
 *
 * Do NOT hardcode business content anywhere else in the codebase.
 * ==========================================================================
 */
window.SITE_CONTENT = {

  brand: {
    name: "ShutterLockSolutions",
    tagline: "Digital solutions designed to help businesses grow.",
  },

  contact: {
    phoneDisplay: "+91 95664 08789",
    phoneE164: "+919566408789",       // used for tel: links
    whatsappNumber: "919566408789",    // used for wa.me links (no + or spaces)
    whatsappMessage: "Hi ShutterLockSolutions, I'm interested in building a digital solution for my business.",
    email: "shutterlocksolutions@gmail.com",
  },

  nav: [
    { label: "Services", href: "#services" },
    { label: "How We Work", href: "#process" },
    { label: "Our Work", href: "#work" },
    { label: "About", href: "#why" },
    { label: "FAQ", href: "#faq" },
    { label: "Contact", href: "#contact" },
  ],

  hero: {
    eyebrow: "Digital Solutions For Growing Businesses",
    headline: "Your business deserves a stronger digital presence.",
    headlineAccentWords: 2, // number of trailing words (from headline) to highlight in accent color
    lead: "From websites and e-commerce to billing software, digital marketing and SEO — we build digital solutions designed to help businesses grow.",
    ctaPrimary: { label: "Start Your Project", href: "#contact" },
    ctaSecondary: { label: "Explore Our Services", href: "#services" },
  },

  valueStrip: {
    heading: "One Partner. Multiple Digital Solutions.",
  },

  problem: {
    tag: "The Reality",
    heading: "Still relying on scattered tools to run your business online?",
    points: [
      "No professional website",
      "Poor online presence",
      "Manual, error-prone billing",
      "Difficult customer management",
      "Low online visibility",
      "Inconsistent branding",
    ],
    solutionHeadingPrefix: "We bring your",
    solutionHeadingAccent: "digital presence",
    solutionHeadingSuffix: "together.",
    solutionCta: { label: "See how", href: "#services" },
  },

  services: {
    tag: "What We Do",
    heading: "Everything your business needs to grow online.",
    items: [
      {
        num: "01",
        title: "Website Development",
        description: "Modern, responsive websites that turn visitors into customers.",
      },
      {
        num: "02",
        title: "E-commerce",
        description: "Online stores designed for browsing, trust and conversion.",
      },
      {
        num: "03",
        title: "Billing Software",
        description: "Practical software that simplifies billing and business operations.",
      },
      {
        num: "04",
        title: "Digital Marketing",
        description: "Reach the right audience and build a stronger digital presence.",
      },
      {
        num: "05",
        title: "SEO",
        description: "Improve discoverability so customers find your business online.",
      },
    ],
  },

  why: {
    tag: "Why ShutterLockSolutions",
    heading: "Not just what looks good — what your business actually needs.",
    items: [
      { num: "01", title: "Business First", description: "We focus on what the business needs, not just what looks good." },
      { num: "02", title: "Built Around Your Goals", description: "Every solution we build has a clear purpose behind it." },
      { num: "03", title: "Modern & Responsive", description: "Designed for today's customers, across mobile and desktop." },
      { num: "04", title: "Long-Term Thinking", description: "We build solutions that can evolve as your business grows." },
    ],
  },

  process: {
    tag: "How We Work",
    heading: "From first call to going live.",
    steps: [
      { num: "01", title: "Understand", description: "We understand your business, audience and goals." },
      { num: "02", title: "Plan", description: "We define the right digital solution for you." },
      { num: "03", title: "Build", description: "We design and develop the full experience." },
      { num: "04", title: "Grow", description: "We help you improve your digital presence over time." },
    ],
  },

  work: {
    tag: "Our Work",
    heading: "Built for real business goals.",
    emptyState: {
      title: "Our Work Is Growing",
      description: "We're currently building out our portfolio alongside new client projects. If you'd like to be one of our early showcase businesses, let's talk.",
      cta: { label: "Start a project with us", href: "#contact" },
    },
    // When real projects exist, add objects here: { title, description, tags: [], link }
    // and set work.hasProjects = true. Rendering logic already supports both states.
    hasProjects: false,
    projects: [],
  },

  transform: {
    tag: "The Shift",
    heading: "From just having a business — to being found, trusted and chosen.",
    before: {
      label: "Before",
      title: "Just Having A Business",
      points: [
        "No proper website",
        "Scattered, manual processes",
        "Hard to find online",
        "Inconsistent branding",
      ],
    },
    after: {
      label: "After",
      title: "A Business People Can Find, Trust & Buy From",
      points: [
        "Professional, fast website",
        "Organised billing & operations",
        "Visible in search results",
        "A consistent digital ecosystem",
      ],
    },
  },

  faq: {
    tag: "FAQ",
    heading: "Questions Before You Get Started?",
    lead: "Here are a few things businesses usually want to know before starting a digital project.",
    items: [
      { q: "What type of websites do you build?", a: "We build modern, responsive business websites tailored to the business, audience and goals." },
      { q: "Do you build e-commerce websites?", a: "Yes. We can build e-commerce experiences designed around products, customers, payments and business requirements." },
      { q: "Can you build a website from scratch?", a: "Yes. We can take a project from initial idea and planning through design, development and launch." },
      { q: "Do you provide billing software?", a: "Yes. We provide practical billing software solutions based on the business workflow and requirements." },
      { q: "Do you provide SEO and digital marketing?", a: "Yes. SEO and digital marketing can be provided as part of a broader digital growth strategy or as individual services." },
      { q: "How long does a website take to build?", a: "The timeline depends on the scope, number of pages, features, content and integrations. After understanding the requirements, we can provide a realistic timeline." },
      { q: "Can you maintain the website after launch?", a: "Yes. Ongoing maintenance and improvements can be discussed based on the business requirements." },
      { q: "How do I get started?", a: "Simply tell us about your business and what you are trying to achieve. We will understand your requirements and suggest the right solution." },
    ],
  },

  cta: {
    heading: "Ready to take your business to the next level?",
    lead: "Let's build a digital presence that works as hard as your business does.",
    ctaPrimary: { label: "Let's Talk About Your Business", href: "#contact" },
    ctaSecondary: { label: "WhatsApp Us" }, // href built from contact.whatsappNumber
  },

  contactSection: {
    tag: "Get In Touch",
    heading: "Start the conversation.",
    form: {
      submitLabel: "Start the Conversation",
      submitLabelSuccess: "Message received ✓",
      services: ["Website Development", "E-commerce", "Billing Software", "Digital Marketing", "SEO", "Not sure yet"],
    },
  },

  footer: {
    quickLinks: [
      { label: "Home", href: "#top" },
      { label: "Services", href: "#services" },
      { label: "Our Work", href: "#work" },
      { label: "About", href: "#why" },
      { label: "FAQ", href: "#faq" },
      { label: "Contact", href: "#contact" },
    ],
    bottomNote: "Built for businesses ready to grow online.",
    year: new Date().getFullYear(),
  },
};
