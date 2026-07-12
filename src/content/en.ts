import type { Content } from "./types";

export const en: Content = {
  meta: {
    title: "Metrica — Specification, without the copy-paste",
    description:
      "Metrica reads a manufacturer's PDF cut-sheet and fills the whole FF&E spec — dimensions, materials, finish, price, lead time. Export a spec book your client keeps. Built in Milan.",
    ogAlt: "Metrica — specification, without the copy-paste.",
  },

  nav: {
    wordmark: "METRICA",
    links: [
      { label: "Work", href: "#work" },
      { label: "Pricing", href: "#pricing" },
    ],
    signIn: "Sign in",
    start: "Start",
    localeSwitch: "Change language",
  },

  hero: {
    eyebrow: "FF&E Specification — Milan",
    line1: "Specification,",
    line2: "without the",
    accent: "copy-paste.",
    subline:
      "Drop a manufacturer PDF. Get a complete spec. Export a book your client keeps.",
    primaryCta: "Start free",
    secondaryCta: "See it work",
    corner: "EST. 2026 / MILANO",
  },

  demo: {
    label: "The Mechanism",
    headline: "One PDF in. A full spec out.",
    columns: ["Brand", "Product", "Dimensions", "Finish", "Lead time", "Price"],
    values: [
      "FLOS",
      "IC LIGHTS T1",
      "Ø 300 × H 535 MM",
      "BRUSHED BRASS",
      "6–8 WEEKS",
      "€ 890,00",
    ],
    caption: "PDF cut-sheet → complete specification. 4 seconds.",
    replay: "Replay",
    sheet: {
      docType: "Technical data sheet",
      designer: "Design — Michael Anastassiades",
      specs: [
        { k: "MODEL", v: "IC LIGHTS T1" },
        { k: "TYPE", v: "TABLE LAMP" },
        { k: "Ø", v: "300 MM" },
        { k: "HEIGHT", v: "535 MM" },
        { k: "MATERIAL", v: "BRASS, BLOWN GLASS" },
        { k: "FINISH", v: "BRUSHED BRASS" },
        { k: "SOURCE", v: "1 × G9 LED" },
        { k: "IP", v: "IP20" },
      ],
    },
  },

  problem: {
    label: "The Problem",
    columns: [
      {
        figure: "3 Days",
        body: "The average FF&E schedule takes three days of copy-paste. You bill design hours. You spend them typing.",
      },
      {
        figure: "40 Items",
        body: "Forty products. Forty PDFs. Forty rounds of transcription, each one a chance to get a dimension wrong.",
      },
      {
        figure: "1 Spreadsheet",
        body: "And at the end, a document that undersells the work inside it.",
      },
    ],
  },

  capabilities: {
    label: "What it does",
    reads: {
      index: "01",
      title: "Reads what others can't.",
      body: "European brands publish specs as PDF cut-sheets. Every competing tool scrapes web pages and chokes on them. Metrica reads the PDF — the dimension line, the finish code, the price — and pulls the value out clean.",
    },
    library: {
      index: "02",
      title: "A library that speaks Italian.",
      body: "B&B Italia. Cassina. Flos. Artemide. Molteni. Boffi. Correct millimetres, EUR trade pricing, IT/EN descriptions, pre-loaded — so the schedule starts half-built.",
      brands: ["B&B ITALIA", "CASSINA", "FLOS", "ARTEMIDE", "MOLTENI", "BOFFI"],
      brandAccentIndex: 2,
    },
    documents: {
      index: "03",
      title: "Documents they keep.",
      body: "Spec books typeset like publications, exported under your studio's name. One link, and your client approves item by item — no PDF ping-pong, no lost versions.",
    },
    specBook: {
      studio: "STUDIO MERIDIANA",
      project: "PROJECT — VILLA COMO / LIVING",
      item: "IC LIGHTS T1",
      footer: "SPEC BOOK — 01 / 24",
      rows: [
        { k: "BRAND", v: "FLOS" },
        { k: "DIMENSIONS", v: "Ø 300 × H 535 MM" },
        { k: "FINISH", v: "BRUSHED BRASS" },
        { k: "LEAD TIME", v: "6–8 WEEKS" },
      ],
    },
  },

  pricing: {
    label: "Pricing",
    plans: [
      {
        name: "Solo",
        price: "€39",
        cadence: "/ MO",
        rows: ["1 seat", "150 extractions", "Full library"],
        cta: "Start free",
      },
      {
        name: "Studio",
        price: "€79",
        cadence: "/ MO",
        rows: ["Up to 5 seats", "600 extractions", "Studio branding"],
        cta: "Start free",
        featuredLabel: "Most studios",
      },
      {
        name: "Studio+",
        price: "€149",
        cadence: "/ MO",
        rows: ["Unlimited seats", "2,000 extractions", "Priority support"],
        cta: "Start",
      },
    ],
    note: "14-day trial. No card. No per-seat games.",
  },

  manifesto: {
    label: "Manifesto",
    lines: [
      "Specification is design work.",
      "It should not feel like data entry.",
      "We built the tool we wanted",
      "in the city that makes the furniture.",
      "Metrica. Milano.",
    ],
    accent: "Milano",
  },

  footer: {
    wordmark: "METRICA",
    email: "hello@metrica.studio",
    madeIn: "Made in Milan",
    privacy: "Privacy",
    terms: "Terms",
    rights: "© 2026 Metrica",
    // No social icons — Metrica has no public profiles yet. Add links here only
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
        heading: "How extractions are handled",
        body: [
          "Uploaded PDFs are processed to read their specification data and are retained only as long as your project needs them. You can delete a project, and its documents, at any time.",
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
