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

  siteUrl: "https://shutterlocksolutions.com/",

  brand: {
    name: "ShutterLockSolutions",
    tagline: "Digital solutions designed to help businesses grow.",
    logoSrc: "assets/logo-mark.png", // relative to site root; components prefix with basePath when needed
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
        slug: "website-development",
        icon: "website",
      },
      {
        num: "02",
        title: "E-commerce",
        description: "Online stores designed for browsing, trust and conversion.",
        slug: "ecommerce",
        icon: "cart",
      },
      {
        num: "03",
        title: "Billing Software",
        description: "Practical software that simplifies billing and business operations.",
        slug: "billing-software",
        icon: "invoice",
      },
      {
        num: "04",
        title: "Digital Marketing",
        description: "Reach the right audience and build a stronger digital presence.",
        slug: "digital-marketing",
        icon: "megaphone",
      },
      {
        num: "05",
        title: "SEO",
        description: "Improve discoverability so customers find your business online.",
        slug: "seo",
        icon: "search",
      },
      {
        num: "06",
        title: "AI Promotional Videos",
        description: "Scroll-stopping promotional videos created and edited with AI, built for your business.",
        slug: "ai-promotional-videos",
        icon: "video",
      },
    ],
  },

  quiz: {
    tag: "Not Sure Where to Start?",
    heading: "Find the right service in 2 quick questions.",
    lead: "Answer a couple of questions and we'll point you to what fits your business.",
    retakeLabel: "Start Over",
    resultCtaPrimary: "View This Service",
    resultCtaSecondary: "Talk on WhatsApp",
    step1: {
      question: "What best describes your situation right now?",
      options: [
        { label: "I don't have a website yet", result: "website-development" },
        { label: "I want to sell products online", result: "ecommerce" },
        { label: "I need to simplify billing or operations", result: "billing-software" },
        { label: "I want to promote my business with video", result: "ai-promotional-videos" },
        { label: "I have a website but not enough customers", next: "step2" },
      ],
    },
    step2: {
      question: "What matters more right now?",
      options: [
        { label: "Getting found on Google search", result: "seo" },
        { label: "Reaching people through ads and social media", result: "digital-marketing" },
      ],
    },
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
    // Existing wording kept — it's concise and makes no delivery promises.
    // `label` is a short "what happens at this stage" cue; `icon` maps to
    // the PROCESS_ICONS registry in js/components/homeSections.js.
    steps: [
      { num: "01", title: "Understand", description: "We understand your business, audience and goals.", label: "You share your goals", icon: "discover" },
      { num: "02", title: "Plan", description: "We define the right digital solution for you.", label: "We propose the approach", icon: "plan" },
      { num: "03", title: "Build", description: "We design and develop the full experience.", label: "We design and develop", icon: "build" },
      { num: "04", title: "Grow", description: "We help you improve your digital presence over time.", label: "Live, then improved", icon: "grow" },
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
    // Reusable case-study schema. The first project with featured:true renders
    // as the large case study; any additional projects can be added to this
    // array later without changing the component.
    hasProjects: true,
    projects: [
      {
        featured: true,
        title: "Eco Connex",
        category: "EV Spare Parts E-commerce",
        // Every claim below was verified against the live site before being
        // listed here. Do not add capabilities that aren't actually shipped.
        description:
          "An e-commerce site for an EV spare parts supplier in Tiruvannamalai — built so riders, workshops and dealers can browse genuine parts and place an order without friction.",
        capabilities: [
          "Product catalogue",
          "Category navigation",
          "Shopping cart",
          "WhatsApp checkout",
          "Dealer / bulk enquiry",
          "Responsive design",
          "On-page SEO",
        ],
        meta: [
          { label: "Industry", value: "EV / Automotive" },
          { label: "Project", value: "E-commerce Website" },
          { label: "Focus", value: "Web Development + SEO" },
        ],
        previewUrl: "ecoconnex.in",
        link: "https://ecoconnex.in",
        ctaLabel: "View Project",
      },
    ],
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

  quickEnquiry: {
    tabLabel: "Quick Enquiry",
    heading: "Get a fast callback",
    lead: "Leave your details and we'll call you back — no long form to fill.",
    submitLabel: "Request Callback",
    submitLabelSending: "Sending…",
    submitLabelSuccess: "Thanks — we'll call you back soon.",
    submitLabelError: "Something went wrong — try WhatsApp instead.",
  },

  contactSection: {
    tag: "Get In Touch",
    heading: "Start the conversation.",
    form: {
      // Get this from https://formspree.io after creating a form — looks
      // like "https://formspree.io/f/xxxxxabcd". Leave empty to disable
      // real submission (form will show a local-only confirmation instead).
      endpoint: "https://formspree.io/f/maewpenj",
      submitLabel: "Start the Conversation",
      submitLabelSending: "Sending…",
      submitLabelSuccess: "Message sent ✓",
      submitLabelError: "Something went wrong — try again",
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

  /**
   * ------------------------------------------------------------------------
   * SERVICE PAGES — single source of truth for /services/<slug>/
   * ------------------------------------------------------------------------
   * Every service page is rendered by the SAME reusable ServicePage
   * component (js/components/servicePage.js) using ONE of the objects
   * below. To add a new service page in future:
   *   1. Add a new object here, keyed by slug.
   *   2. Create /services/<slug>/index.html copying an existing shell
   *      (only the <body data-service-slug="..."> value changes).
   * No component code needs to change for a new service.
   * ------------------------------------------------------------------------
   */
  servicesDetail: {

    "website-development": {
      slug: "website-development",
      navLabel: "Website Development",
      seo: {
        title: "Website Development Company | ShutterLockSolutions",
        description: "Need a new website for your business? We design and create modern, responsive websites built around your business, your customers and your goals.",
      },
      hero: {
        eyebrow: "Website Development",
        headline: "Your website should work as hard as your business.",
        headlineAccentWords: 3,
        description: "Modern, responsive websites designed around your business, your customers and your goals.",
        ctaPrimary: { label: "Start Your Project" },
        ctaSecondary: { label: "Talk on WhatsApp" },
      },
      problem: {
        tag: "The Problem",
        heading: "An outdated website quietly costs you customers.",
        points: [
          "Looks dated on modern devices",
          "Poor mobile experience",
          "Confusing navigation",
          "Slow to load",
          "Unclear customer journey",
          "Low visitor trust",
        ],
      },
      solution: {
        tag: "Our Approach",
        heading: "Websites built around business goals, not just visuals.",
        body: "We design and build websites with your customers' journey in mind — clear navigation, fast performance, responsive layouts, and structure that's easy to maintain and grow as your business grows.",
      },
      features: {
        tag: "What's Included",
        heading: "Capabilities built into every website.",
        items: [
          { num: "01", title: "Responsive Design", description: "Looks and works correctly across mobile, tablet, laptop and desktop." },
          { num: "02", title: "Fast Performance", description: "Optimised loading so visitors don't drop off before the page appears." },
          { num: "03", title: "SEO-Ready Structure", description: "Semantic HTML and clean structure built to be discoverable." },
          { num: "04", title: "Conversion-Focused UX", description: "Clear pathways that guide visitors toward contacting you." },
        ],
      },
      benefits: {
        tag: "Business Outcome",
        heading: "What a stronger website means for your business.",
        points: [
          "Build stronger customer trust",
          "Make the business easier to discover",
          "Improve customer experience",
          "Create a professional online presence",
          "Make future growth easier",
        ],
      },
      faqs: [
        { q: "Do I need to provide the website content myself?", a: "We can work with content you provide, or help shape it together — either way, the structure and design are built around your business." },
        { q: "Will the website work well on mobile?", a: "Yes. Every website is designed responsive-first so it works properly across mobile, tablet and desktop." },
        { q: "Can the website be updated later?", a: "Yes. Websites are built to be maintainable, and updates or improvements can be discussed as your business evolves." },
      ],
      cta: {
        heading: "Ready to build a website that works as hard as you do?",
        lead: "Let's talk about what your business needs.",
      },
    },

    "ecommerce": {
      slug: "ecommerce",
      navLabel: "E-commerce",
      seo: {
        title: "E-commerce Website Development | ShutterLockSolutions",
        description: "Want to sell online? We build e-commerce websites and online stores designed around products, customers, payments and business requirements.",
      },
      hero: {
        eyebrow: "E-commerce Development",
        headline: "An online store people can actually shop on.",
        headlineAccentWords: 3,
        description: "Product discovery, cart and checkout designed around how customers actually shop.",
        ctaPrimary: { label: "Start Your Project" },
        ctaSecondary: { label: "Talk on WhatsApp" },
      },
      problem: {
        tag: "The Problem",
        heading: "A hard-to-shop store loses sales before checkout.",
        points: [
          "Confusing product discovery",
          "Weak search and filtering",
          "Clunky cart experience",
          "Difficult checkout flow",
          "Poor mobile shopping experience",
          "Low buyer confidence",
        ],
      },
      solution: {
        tag: "Our Approach",
        heading: "Stores designed around browsing, trust and conversion.",
        body: "We structure categories, search and product pages around how customers actually shop, and design cart and checkout to reduce friction — so more visits turn into completed orders.",
      },
      features: {
        tag: "What's Included",
        heading: "Capabilities built into every store.",
        items: [
          { num: "01", title: "Product Discovery", description: "Clear categories and search so customers find what they want quickly." },
          { num: "02", title: "Cart & Checkout", description: "A streamlined path from product page to completed order." },
          { num: "03", title: "Mobile Shopping", description: "Designed for the majority of customers shopping from their phone." },
          { num: "04", title: "Customer Experience", description: "Product pages and flows built around buyer confidence." },
        ],
      },
      benefits: {
        tag: "Business Outcome",
        heading: "What a better store means for your business.",
        points: [
          "Sell to customers online, not just in person",
          "Reduce drop-off during checkout",
          "Give customers a trustworthy shopping experience",
          "Make products easier to discover",
          "Create a store that can grow with your catalogue",
        ],
      },
      faqs: [
        { q: "Can I manage products myself after launch?", a: "Yes, the store is set up so you can manage your product catalogue going forward." },
        { q: "Do you handle payment setup?", a: "Payment methods are configured as part of the build based on what your business needs." },
        { q: "Can the store grow as I add more products?", a: "Yes. The structure is built to scale as your catalogue and traffic grow." },
      ],
      cta: {
        heading: "Ready to sell online without the friction?",
        lead: "Let's talk about what your store needs.",
      },
    },

    "billing-software": {
      slug: "billing-software",
      navLabel: "Billing Software",
      seo: {
        title: "Billing Software Development | ShutterLockSolutions",
        description: "Simplify invoicing, customer records and business operations with practical billing software built around your workflow.",
      },
      hero: {
        eyebrow: "Billing Software",
        headline: "Billing that matches how your business actually works.",
        headlineAccentWords: 3,
        description: "Practical software that simplifies invoicing, customer records and business operations.",
        ctaPrimary: { label: "Start Your Project" },
        ctaSecondary: { label: "Talk on WhatsApp" },
      },
      problem: {
        tag: "The Problem",
        heading: "Manual billing quietly slows the whole business down.",
        points: [
          "Manual, error-prone invoicing",
          "Scattered customer records",
          "No consistent billing process",
          "Time lost on repetitive paperwork",
          "Difficult to track what's pending",
          "Hard to hand off or scale",
        ],
      },
      solution: {
        tag: "Our Approach",
        heading: "Practical software built around your billing workflow.",
        body: "We build billing tools around the way your business actually operates — not a generic template — so invoicing, customer records and day-to-day operations become simpler to manage.",
      },
      features: {
        tag: "What's Included",
        heading: "Capabilities built into every billing solution.",
        items: [
          { num: "01", title: "Invoicing", description: "Create and manage invoices without repetitive manual work." },
          { num: "02", title: "Customer Records", description: "Keep customer and billing information organised in one place." },
          { num: "03", title: "Business Operations", description: "Workflows shaped around how your business actually runs." },
          { num: "04", title: "Reporting", description: "Visibility into billing activity where applicable to your business." },
        ],
      },
      benefits: {
        tag: "Business Outcome",
        heading: "What better billing means for your business.",
        points: [
          "Spend less time on repetitive paperwork",
          "Reduce billing errors",
          "Keep customer records organised",
          "Get a clearer view of business operations",
          "Make day-to-day operations easier to manage",
        ],
      },
      faqs: [
        { q: "Will the software match how my business already works?", a: "Yes. We build around your existing billing workflow rather than forcing a generic template." },
        { q: "Can it grow as my business grows?", a: "Yes, solutions are built with future changes in mind." },
        { q: "Do you provide support after setup?", a: "Ongoing support and improvements can be discussed based on your requirements." },
      ],
      cta: {
        heading: "Ready to simplify your billing?",
        lead: "Let's talk about your current process.",
      },
    },

    "digital-marketing": {
      slug: "digital-marketing",
      navLabel: "Digital Marketing",
      seo: {
        title: "Digital Marketing Services | ShutterLockSolutions",
        description: "Reach the right audience and build a stronger digital presence with digital marketing services shaped around your business goals.",
      },
      hero: {
        eyebrow: "Digital Marketing",
        headline: "Reach the customers who are already looking for you.",
        headlineAccentWords: 4,
        description: "Reach the right audience and build a stronger digital presence around your business.",
        ctaPrimary: { label: "Start Your Project" },
        ctaSecondary: { label: "Talk on WhatsApp" },
      },
      problem: {
        tag: "The Problem",
        heading: "Being online isn't the same as being visible.",
        points: [
          "Low online visibility",
          "Inconsistent brand presence",
          "No clear content strategy",
          "Difficult to reach the right audience",
          "Unclear customer acquisition path",
          "Scattered messaging across platforms",
        ],
      },
      solution: {
        tag: "Our Approach",
        heading: "Marketing built around audience and business goals.",
        body: "We approach digital marketing around who your customers actually are — audience, content and campaign strategy shaped to build a consistent, recognisable presence for your business.",
      },
      features: {
        tag: "What's Included",
        heading: "Capabilities built into every marketing engagement.",
        items: [
          { num: "01", title: "Audience Strategy", description: "Understanding who your customers are and where they spend time." },
          { num: "02", title: "Content Direction", description: "Messaging and content shaped around your brand and audience." },
          { num: "03", title: "Campaign Strategy", description: "Structured campaigns built around business goals." },
          { num: "04", title: "Brand Presence", description: "A more consistent presence across the channels that matter." },
        ],
      },
      benefits: {
        tag: "Business Outcome",
        heading: "What stronger marketing means for your business.",
        points: [
          "Reach the audience most relevant to your business",
          "Build a more consistent brand presence",
          "Create a clearer customer acquisition path",
          "Make your business more recognisable",
          "Support long-term digital growth",
        ],
      },
      faqs: [
        { q: "Do you guarantee specific results?", a: "No — we don't make guaranteed-results claims. We focus on strategy built around your audience and goals." },
        { q: "Which platforms do you work with?", a: "This depends on where your audience actually is; we can discuss the right channels for your business." },
        { q: "Can this work alongside my existing website?", a: "Yes, digital marketing is designed to work alongside your existing or new digital presence." },
      ],
      cta: {
        heading: "Ready to build a stronger digital presence?",
        lead: "Let's talk about your audience and goals.",
      },
    },

    "seo": {
      slug: "seo",
      navLabel: "SEO",
      seo: {
        title: "SEO Services | Rank Higher on Google | ShutterLockSolutions",
        description: "Improve your search visibility on Google with technical and on-page SEO built for long-term organic growth.",
      },
      hero: {
        eyebrow: "SEO",
        headline: "Make your business easy for customers to find.",
        headlineAccentWords: 3,
        description: "Technical and on-page SEO built for long-term, organic search visibility.",
        ctaPrimary: { label: "Start Your Project" },
        ctaSecondary: { label: "Talk on WhatsApp" },
      },
      problem: {
        tag: "The Problem",
        heading: "If customers can't find you in search, you're invisible.",
        points: [
          "Low search visibility",
          "Weak technical SEO foundation",
          "Unclear on-page structure",
          "Content that misses search intent",
          "Falling behind competitors in search",
          "No long-term organic strategy",
        ],
      },
      solution: {
        tag: "Our Approach",
        heading: "SEO built on structure, intent and consistency.",
        body: "We focus on the technical and on-page fundamentals — site structure, content clarity and search intent — that support sustainable, long-term organic visibility rather than short-lived tricks.",
      },
      features: {
        tag: "What's Included",
        heading: "Capabilities built into every SEO engagement.",
        items: [
          { num: "01", title: "Technical SEO", description: "A clean, crawlable foundation search engines can understand." },
          { num: "02", title: "On-Page SEO", description: "Content and structure aligned with what customers search for." },
          { num: "03", title: "Search Intent", description: "Content shaped around what your customers are actually looking for." },
          { num: "04", title: "Long-Term Growth", description: "An organic approach built to compound over time." },
        ],
      },
      benefits: {
        tag: "Business Outcome",
        heading: "What better SEO means for your business.",
        points: [
          "Make it easier for customers to discover you",
          "Build long-term organic visibility",
          "Improve how search engines understand your site",
          "Support content that matches customer intent",
          "Reduce reliance on paid visibility alone",
        ],
      },
      faqs: [
        { q: "Can you guarantee a #1 Google ranking?", a: "No — no ethical SEO provider can guarantee specific rankings. We focus on strong technical and on-page fundamentals for sustainable visibility." },
        { q: "How long does SEO take to show results?", a: "Organic SEO is a long-term approach; timelines depend on your starting point, competition and consistency." },
        { q: "Does SEO work without a new website?", a: "SEO can often be applied to an existing website, depending on its current structure and condition." },
      ],
      cta: {
        heading: "Ready to become easier to find?",
        lead: "Let's talk about your current visibility.",
      },
    },

    "ai-promotional-videos": {
      slug: "ai-promotional-videos",
      navLabel: "AI Promotional Videos",
      seo: {
        title: "AI Promotional Video Creation | ShutterLockSolutions",
        description: "Get scroll-stopping promotional videos created and edited with AI for your business — fast turnaround, no studio required.",
      },
      hero: {
        eyebrow: "AI Promotional Videos",
        headline: "Promotional videos, without the studio and the wait.",
        headlineAccentWords: 4,
        description: "Scroll-stopping promotional videos created and edited with AI, built around your business and your products.",
        ctaPrimary: { label: "Start Your Project" },
        ctaSecondary: { label: "Talk on WhatsApp" },
      },
      problem: {
        tag: "The Problem",
        heading: "Good video content is powerful — and usually out of reach.",
        points: [
          "Studio shoots are expensive and slow",
          "No in-house editing skill or time",
          "Social platforms reward video, not photos",
          "Generic templates don't reflect the business",
          "Hard to produce content consistently",
          "Competitors are already posting video",
        ],
      },
      solution: {
        tag: "Our Approach",
        heading: "AI-assisted video, shaped around your business.",
        body: "We use AI video generation and editing tools to produce promotional videos for your products, services or brand — built around your actual business rather than a generic template, with a fast turnaround that doesn't need a studio or film crew.",
      },
      features: {
        tag: "What's Included",
        heading: "Capabilities built into every video engagement.",
        items: [
          { num: "01", title: "AI-Generated Footage", description: "Promotional visuals created with AI tools, shaped around your products or services." },
          { num: "02", title: "Editing & Pacing", description: "Footage cut, paced and structured for attention on social and ads." },
          { num: "03", title: "Platform-Ready Formats", description: "Exported for the placements you need — reels, stories, ads, or web." },
          { num: "04", title: "Fast Turnaround", description: "No studio booking or film crew — video production moves much faster." },
        ],
      },
      benefits: {
        tag: "Business Outcome",
        heading: "What promotional video means for your business.",
        points: [
          "Show up where your customers already scroll",
          "Promote products without a studio shoot",
          "Post more consistently on social platforms",
          "Give ads and landing pages a stronger visual hook",
          "Stand out from competitors still using only photos",
        ],
      },
      faqs: [
        { q: "Is the video fully AI-generated, or edited from my own footage?", a: "Both are possible — we can generate promotional footage with AI, edit footage you already have, or combine the two depending on what fits your business." },
        { q: "What is the video used for?", a: "Typically social media (reels/stories), paid ads, or a website — we shape the format and length around where it will be used." },
        { q: "How long does a video take to produce?", a: "Turnaround is significantly faster than a traditional studio shoot; exact timing depends on length and complexity, which we can confirm after understanding your requirements." },
        { q: "Do I need to provide footage or a script?", a: "Not necessarily — we can work from a script or brief you provide, or help shape the concept together." },
      ],
      cta: {
        heading: "Ready to put your business in motion?",
        lead: "Let's talk about what you want to promote.",
      },
    },
  },
};
