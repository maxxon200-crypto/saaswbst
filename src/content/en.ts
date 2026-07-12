import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Capitolo — FF&E specification for European studios",
    description:
      "The FF&E specification and procurement tool built in Milan for European studios. Structured product data, editorial spec books, and one approval link your clients will keep.",
  },

  nav: {
    wordmark: "CAPITOLO",
    links: [
      { label: "How it works", href: "#how-it-works" },
      { label: "Pricing", href: "#pricing" },
      { label: "Manifesto", href: "#manifesto" },
    ],
    localeSwitch: "Change language",
  },

  hero: {
    headlinePre: "Specification, made ",
    headlineAccent: "beautifully",
    headlinePost: ".",
    subline:
      "The FF&E spec and procurement tool built in Milan for European studios.",
    primaryCta: "Join the waitlist",
    secondaryCta: "See how it works",
  },

  problem: {
    label: "The problem",
    title: "Your specs deserve better than a spreadsheet.",
    columns: [
      {
        title: "Hours lost re-typing product data.",
        body: "Every schedule begins as a blank grid you fill by hand, copying dimensions and finishes from a dozen supplier tabs. Those hours add up to days you never billed for.",
      },
      {
        title: "Documents that undersell your work.",
        body: "Your interiors are considered and exact; the spreadsheets that describe them are neither. Clients notice the gap before they notice the design.",
      },
      {
        title: "Tools built for another continent.",
        body: "The category leaders assume American brands, imperial units and dollar pricing. European studios are left translating everything twice.",
      },
    ],
  },

  how: {
    label: "How it works",
    steps: [
      {
        title: "Paste a link. Or drop the PDF.",
        body: "Paste any supplier URL or drag in a manufacturer cut-sheet. Every spec — dimensions, finishes, lead times, trade price — lands in your schedule, structured and ready to edit.",
        aiNote:
          "Reads product pages and PDF cut-sheets — including the ones only European brands still publish.",
        visual: "schedule",
      },
      {
        title: "A library that speaks Italian.",
        body: "Pre-enriched data for the brands you actually specify — B&B Italia, Cassina, Flos, Artemide, Molteni, Boffi — with correct metric dimensions, EUR trade pricing and descriptions in Italian and English.",
        visual: "product",
      },
      {
        title: "Documents your clients will keep.",
        body: "Editorial spec books and schedules, typeset like publications and exported to PDF under your studio's name. One no-login link lets clients review and approve in a single click.",
        visual: "specsheet",
      },
    ],
  },

  pricing: {
    label: "Pricing",
    title: "Simple pricing. No per-seat games.",
    plans: [
      {
        name: "Solo",
        price: "€39",
        cadence: "/mo",
        rows: [
          "One designer",
          "Unlimited projects and schedules",
          "Link and PDF extraction",
          "PDF spec books under your name",
          "Client approval links",
        ],
      },
      {
        name: "Studio",
        price: "€79",
        cadence: "/mo",
        featuredLabel: "For most studios",
        rows: [
          "Up to five designers",
          "Everything in Solo",
          "European brand library",
          "Shared studio templates",
          "Priority support",
        ],
      },
      {
        name: "Studio+",
        price: "€149",
        cadence: "/mo",
        rows: [
          "Up to twelve designers",
          "Everything in Studio",
          "Custom document branding",
          "Procurement and PO tracking",
          "Onboarding session",
        ],
      },
    ],
    note: "Launching 2026. Waitlist members get three months at half price.",
    cta: "Join the waitlist",
  },

  manifesto: {
    label: "Manifesto",
    lines: [
      "We build in Milan, for the way European studios actually work.",
      "Specification is design work.",
      "It deserves the same care as the rooms it describes.",
      "A tool should meet the standard of the studios that use it.",
      "So we made one thing, and made it properly.",
      "Specs, made beautifully.",
    ],
  },

  waitlist: {
    label: "Waitlist",
    title: "Be first. Spec better.",
    lede: "Join the studios shaping Capitolo before launch. We build slowly, with a small group of designers we listen to.",
    fields: {
      email: "Email",
      studioName: "Studio name",
      country: "Country",
      role: "Role",
    },
    optional: "Optional",
    countryPlaceholder: "Select a country",
    rolePlaceholder: "Select a role",
    countryGroups: [
      {
        label: "European Union",
        options: [
          "Italy",
          "France",
          "Spain",
          "Germany",
          "Netherlands",
          "Belgium",
          "Austria",
          "Portugal",
          "Ireland",
          "Sweden",
          "Denmark",
          "Finland",
          "Greece",
          "Poland",
          "Czechia",
          "Croatia",
          "Slovenia",
          "Luxembourg",
        ],
      },
      {
        label: "Elsewhere in Europe",
        options: ["United Kingdom", "Switzerland", "Norway"],
      },
      {
        label: "Other",
        options: ["Other"],
      },
    ],
    roles: ["Interior designer", "Architect", "Studio owner", "Other"],
    submit: "Join the waitlist",
    submitting: "Joining…",
    success: "You're on the list. We'll be in touch from Milan.",
    errors: {
      email: "Enter a valid email address.",
      generic: "Something went wrong. Please try again.",
    },
  },

  footer: {
    madeIn: "Made in Milan",
    email: "hello@capitolo.studio",
    privacy: "Privacy",
    rights: "Capitolo",
  },

  privacy: {
    label: "Privacy",
    title: "Privacy notice",
    updated: "Last updated: 2026",
    reviewNote:
      "Placeholder text for legal review. Replace with counsel-approved copy before launch.",
    sections: [
      {
        heading: "What the waitlist collects",
        body: [
          "When you join the waitlist we collect the email address you enter, and optionally your studio name, country and role. We use this only to contact you about Capitolo's launch and early access.",
          "We do not use these details for advertising, and we do not sell or share them with third parties for their own marketing.",
        ],
      },
      {
        heading: "Where your data is stored",
        body: [
          "Waitlist entries are stored in Supabase on infrastructure hosted within the European Union. Access is limited to the people building Capitolo.",
        ],
      },
      {
        heading: "How long we keep it",
        body: [
          "We keep waitlist details until launch and for a reasonable period afterwards to manage early access, then delete them. You can ask us to delete your details sooner at any time.",
        ],
      },
      {
        heading: "Your rights",
        body: [
          "Under the GDPR you can access, correct or delete the personal data we hold about you, and object to our use of it. To exercise any of these rights, email us and we will respond promptly.",
        ],
      },
      {
        heading: "Contact",
        body: [
          "For any privacy question, or to have your details removed, write to hello@capitolo.studio.",
        ],
      },
    ],
    backHome: "Back to home",
  },
};
