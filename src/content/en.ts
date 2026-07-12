import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Metrica — Excel for FF&E schedules",
    description:
      "Drop a manufacturer PDF. Metrica reads the spec — dimensions, materials, finish, price, lead time — and fills your FF&E schedule. Export a spec book your client keeps. Built in Milan.",
    ogAlt: "Metrica — Excel for FF&E schedules.",
  },

  videoPlaceholder: "Preview coming",

  nav: {
    wordmark: "Metrica",
    links: [
      { label: "Features", href: "#features" },
      { label: "Pricing", href: "#pricing" },
    ],
    signIn: "Sign in",
    start: "Start free",
    localeSwitch: "Change language",
  },

  hero: {
    headline: "Excel for FF&E schedules",
    subline:
      "Drop a manufacturer PDF. Metrica reads the spec and fills your schedule. Export a book your client keeps.",
    cta: "Start free",
    ctaNote: "14-day trial. No card.",
  },

  socialProof: {
    lead: "Built in Milan for European studios",
    brands: ["B&B ITALIA", "CASSINA", "FLOS", "ARTEMIDE", "MOLTENI", "BOFFI"],
    caption: "Pre-loaded in the library",
  },

  features: {
    heading: "Everything from the PDF to the client.",
    subheading: "Three steps. No spreadsheet.",
    items: [
      {
        title: "Reads what other tools can't.",
        body: "European manufacturers publish their specs as PDF cut-sheets. Every competing tool scrapes web pages and chokes on them. Metrica reads the PDF — the dimension line, the finish code, the price — and pulls the values clean.",
      },
      {
        title: "A library that already speaks Italian.",
        body: "B&B Italia, Cassina, Flos, Artemide, Molteni, Boffi. Correct millimetres, EUR trade pricing, IT/EN descriptions — pre-loaded, so your schedule starts half-built.",
      },
      {
        title: "Documents they keep.",
        body: "Spec books typeset like publications, exported under your studio's name. One link, and your client approves item by item. No PDF ping-pong.",
      },
    ],
  },

  pricing: {
    heading: "Simple pricing.",
    subheading: "Start free. Upgrade when the schedules get long.",
    plans: [
      {
        name: "Solo",
        price: "€39",
        cadence: "/month",
        rows: ["1 seat", "150 extractions/month", "Unlimited projects"],
        cta: "Start free",
      },
      {
        name: "Studio",
        price: "€79",
        cadence: "/month",
        rows: [
          "Up to 5 seats",
          "600 extractions/month",
          "Unlimited projects",
          "Studio branding",
        ],
        cta: "Start free",
        featuredLabel: "POPULAR",
      },
      {
        name: "Studio+",
        price: "€149",
        cadence: "/month",
        rows: [
          "Unlimited seats",
          "2,000 extractions/month",
          "Unlimited projects",
          "Studio branding",
          "Priority support",
        ],
        cta: "Start free",
      },
    ],
    note: "14-day trial. No card required. Cancel anytime.",
  },

  faq: {
    heading: "FAQs",
    subheading: "Everything you need to know about Metrica.",
    items: [
      {
        q: "What is Metrica?",
        a: "A specification tool for interior design and architecture studios. It reads manufacturer PDFs and product pages, fills your FF&E schedule, and exports a spec book.",
      },
      {
        q: "What can it read?",
        a: "PDF cut-sheets, technical drawings, product photos, and product URLs. PDFs are the point — most European brands publish specs that way and other tools can't read them.",
      },
      {
        q: "Which brands are in the library?",
        a: "B&B Italia, Cassina, Flos, Artemide, Molteni, Boffi and others, with correct metric dimensions and EUR trade pricing. You can add any product on top.",
      },
      {
        q: "Do my clients need an account?",
        a: "No. You send a link. They approve or reject each item and leave comments. Nothing to install, nothing to sign up for.",
      },
      {
        q: "Where is my data stored?",
        a: "On EU servers. Metrica is GDPR-compliant. You can export or delete everything at any time.",
      },
      {
        q: "Can I cancel anytime?",
        a: "Yes. Cancel from settings, no call, no email. Your projects stay exportable.",
      },
    ],
  },

  closing: {
    heading: "Spec the next project in an afternoon.",
    cta: "Start free",
  },

  footer: {
    wordmark: "Metrica",
    tagline: "FF&E specification. Made in Milan.",
    productTitle: "Product",
    companyTitle: "Company",
    languageTitle: "Language",
    contact: "Contact",
    privacy: "Privacy",
    terms: "Terms",
    email: "hello@metrica.studio",
    rights: "© 2026 Metrica",
    // No social icons — Metrica has no public profiles yet. Add them here only
    // once real accounts exist.
    socialNote: "",
  },

  privacy: {
    label: "Legal",
    title: "Privacy",
    updated: "Updated — January 2026",
    sections: [
      {
        heading: "What we collect",
        body: [
          "Your account details — name, studio, email — and the product documents you upload for extraction. Nothing else.",
          "We do not sell data, and we do not train third-party models on your uploads.",
        ],
      },
      {
        heading: "Where your data lives",
        body: [
          "Your projects are stored on EU servers and Metrica is GDPR-compliant. Uploaded PDFs are retained only as long as your project needs them; you can export or delete everything at any time.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about your data: hello@metrica.studio."],
      },
    ],
    backHome: "Back home",
  },

  terms: {
    label: "Legal",
    title: "Terms",
    updated: "Updated — January 2026",
    sections: [
      {
        heading: "The service",
        body: [
          "Metrica is a specification tool for interior design and architecture studios. You keep ownership of everything you create — your schedules, your spec books, your client links.",
        ],
      },
      {
        heading: "Trials and billing",
        body: [
          "The trial runs 14 days, no card required. After that, plans bill monthly and can be cancelled at any time from your account.",
        ],
      },
      {
        heading: "Contact",
        body: ["Questions about these terms: hello@metrica.studio."],
      },
    ],
    backHome: "Back home",
  },
};
