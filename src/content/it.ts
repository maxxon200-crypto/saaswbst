import type { Content } from "./types";

export const it: Content = {
  meta: {
    title: "Metrica — La specifica, senza il copia-incolla",
    description:
      "Metrica legge la scheda tecnica PDF del produttore e compila l'intera specifica FF&E — dimensioni, materiali, finitura, prezzo, consegna. Esporta un book che il cliente conserva. Fatto a Milano.",
    ogAlt: "Metrica — la specifica, senza il copia-incolla.",
  },

  nav: {
    wordmark: "METRICA",
    links: [
      { label: "Come funziona", href: "#work" },
      { label: "Prezzi", href: "#pricing" },
    ],
    signIn: "Accedi",
    start: "Inizia",
    localeSwitch: "Cambia lingua",
  },

  hero: {
    eyebrow: "Specifiche FF&E — Milano",
    line1: "Specifiche,",
    line2: "senza il",
    accent: "copia-incolla.",
    subline:
      "Carica un PDF del produttore. Ottieni una specifica completa. Esporta un book che il cliente conserva.",
    primaryCta: "Inizia gratis",
    secondaryCta: "Guarda come funziona",
    corner: "EST. 2026 / MILANO",
  },

  demo: {
    label: "Il Meccanismo",
    headline: "Un PDF dentro. Una specifica completa fuori.",
    columns: ["Marca", "Prodotto", "Dimensioni", "Finitura", "Consegna", "Prezzo"],
    values: [
      "FLOS",
      "IC LIGHTS T1",
      "Ø 300 × H 535 MM",
      "OTTONE SPAZZOLATO",
      "6–8 SETTIMANE",
      "€ 890,00",
    ],
    caption: "Scheda tecnica PDF → specifica completa. 4 secondi.",
    replay: "Rivedi",
    sheet: {
      docType: "Scheda tecnica",
      designer: "Design — Michael Anastassiades",
      specs: [
        { k: "MODELLO", v: "IC LIGHTS T1" },
        { k: "TIPO", v: "LAMPADA DA TAVOLO" },
        { k: "Ø", v: "300 MM" },
        { k: "ALTEZZA", v: "535 MM" },
        { k: "MATERIALE", v: "OTTONE, VETRO SOFFIATO" },
        { k: "FINITURA", v: "OTTONE SPAZZOLATO" },
        { k: "SORGENTE", v: "1 × G9 LED" },
        { k: "IP", v: "IP20" },
      ],
    },
  },

  problem: {
    label: "Il Problema",
    columns: [
      {
        figure: "3 Giorni",
        body: "In media un capitolato FF&E richiede tre giorni di copia-incolla. Fatturi ore di progetto. Le spendi a digitare.",
      },
      {
        figure: "40 Voci",
        body: "Quaranta prodotti. Quaranta PDF. Quaranta trascrizioni, ognuna un'occasione per sbagliare una quota.",
      },
      {
        figure: "1 Foglio",
        body: "E alla fine, un documento che svaluta il lavoro che contiene.",
      },
    ],
  },

  capabilities: {
    label: "Cosa fa",
    reads: {
      index: "01",
      title: "Legge ciò che gli altri non leggono.",
      body: "I marchi europei pubblicano le specifiche come schede PDF. Ogni strumento concorrente analizza pagine web e si blocca. Metrica legge il PDF — la quota, il codice finitura, il prezzo — ed estrae il valore pulito.",
    },
    library: {
      index: "02",
      title: "Una libreria che parla italiano.",
      body: "B&B Italia. Cassina. Flos. Artemide. Molteni. Boffi. Millimetri corretti, prezzi trade in euro, descrizioni IT/EN, già caricati — così il capitolato parte già a metà.",
      brands: ["B&B ITALIA", "CASSINA", "FLOS", "ARTEMIDE", "MOLTENI", "BOFFI"],
      brandAccentIndex: 2,
    },
    documents: {
      index: "03",
      title: "Documenti che conservano.",
      body: "Book di specifiche impaginati come pubblicazioni, esportati con il nome del tuo studio. Un link, e il cliente approva voce per voce — niente PDF avanti e indietro, nessuna versione persa.",
    },
    specBook: {
      studio: "STUDIO MERIDIANA",
      project: "PROGETTO — VILLA COMO / LIVING",
      item: "IC LIGHTS T1",
      footer: "SPEC BOOK — 01 / 24",
      rows: [
        { k: "MARCA", v: "FLOS" },
        { k: "DIMENSIONI", v: "Ø 300 × H 535 MM" },
        { k: "FINITURA", v: "OTTONE SPAZZOLATO" },
        { k: "CONSEGNA", v: "6–8 SETTIMANE" },
      ],
    },
  },

  pricing: {
    label: "Prezzi",
    plans: [
      {
        name: "Solo",
        price: "€39",
        cadence: "/ MESE",
        rows: ["1 postazione", "150 estrazioni", "Libreria completa"],
        cta: "Inizia gratis",
      },
      {
        name: "Studio",
        price: "€79",
        cadence: "/ MESE",
        rows: ["Fino a 5 postazioni", "600 estrazioni", "Branding dello studio"],
        cta: "Inizia gratis",
        featuredLabel: "La scelta degli studi",
      },
      {
        name: "Studio+",
        price: "€149",
        cadence: "/ MESE",
        rows: ["Postazioni illimitate", "2.000 estrazioni", "Supporto prioritario"],
        cta: "Inizia",
      },
    ],
    note: "Prova di 14 giorni. Senza carta. Nessun gioco sul numero di postazioni.",
  },

  manifesto: {
    label: "Manifesto",
    lines: [
      "Specificare è progettare.",
      "Non dovrebbe sembrare immissione dati.",
      "Abbiamo creato lo strumento che ci mancava",
      "nella città che disegna gli arredi.",
      "Metrica. Milano.",
    ],
    accent: "Milano",
  },

  footer: {
    wordmark: "METRICA",
    email: "hello@metrica.studio",
    madeIn: "Fatto a Milano",
    privacy: "Privacy",
    terms: "Termini",
    rights: "© 2026 Metrica",
    socialNote: "",
  },

  privacy: {
    label: "Note legali",
    title: "Privacy",
    updated: "Aggiornato — Gennaio 2026",
    sections: [
      {
        heading: "Cosa raccogliamo",
        body: [
          "I dati del tuo account — nome, studio, email — e i documenti di prodotto che carichi per l'estrazione. Nient'altro.",
          "Non vendiamo dati e non addestriamo modelli di terzi sui tuoi caricamenti.",
        ],
      },
      {
        heading: "Come gestiamo le estrazioni",
        body: [
          "I PDF caricati vengono elaborati per leggerne i dati di specifica e sono conservati solo finché il progetto ne ha bisogno. Puoi eliminare un progetto, e i suoi documenti, in qualsiasi momento.",
        ],
      },
      {
        heading: "Contatti",
        body: ["Domande sui tuoi dati: hello@metrica.studio."],
      },
    ],
    backHome: "Torna alla home",
  },

  terms: {
    label: "Note legali",
    title: "Termini",
    updated: "Aggiornato — Gennaio 2026",
    sections: [
      {
        heading: "Il servizio",
        body: [
          "Metrica è uno strumento di specifica per studi di interior design e architettura. Resti proprietario di tutto ciò che crei — i tuoi capitolati, i tuoi book, i tuoi link per il cliente.",
        ],
      },
      {
        heading: "Prova e fatturazione",
        body: [
          "La prova dura 14 giorni, senza carta. Dopo, i piani si rinnovano mensilmente e si possono annullare in qualsiasi momento dal tuo account.",
        ],
      },
      {
        heading: "Contatti",
        body: ["Domande su questi termini: hello@metrica.studio."],
      },
    ],
    backHome: "Torna alla home",
  },
};
