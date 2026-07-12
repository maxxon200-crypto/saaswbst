import type { Content } from "./types";

export const it: Content = {
  meta: {
    title: "Metrica — Excel per i capitolati FF&E",
    description:
      "Carica un PDF del produttore. Metrica legge la scheda — dimensioni, materiali, finitura, prezzo, consegna — e compila il tuo capitolato FF&E. Esporta un book che il cliente conserva. Fatto a Milano.",
    ogAlt: "Metrica — Excel per i capitolati FF&E.",
  },

  videoPlaceholder: "Anteprima in arrivo",

  nav: {
    wordmark: "Metrica",
    links: [
      { label: "Funzionalità", href: "#features" },
      { label: "Prezzi", href: "#pricing" },
    ],
    signIn: "Accedi",
    start: "Inizia gratis",
    localeSwitch: "Cambia lingua",
  },

  hero: {
    headline: "Excel per i capitolati FF&E",
    subline:
      "Carica un PDF del produttore. Metrica legge la scheda e compila il capitolato. Esporta un book che il cliente conserva.",
    cta: "Inizia gratis",
    ctaNote: "Prova di 14 giorni. Senza carta.",
  },

  socialProof: {
    lead: "Fatto a Milano per gli studi europei",
    brands: ["B&B ITALIA", "CASSINA", "FLOS", "ARTEMIDE", "MOLTENI", "BOFFI"],
    caption: "Già caricati nella libreria",
  },

  features: {
    heading: "Dal PDF al cliente, tutto qui.",
    subheading: "Tre passaggi. Niente foglio Excel.",
    items: [
      {
        title: "Legge ciò che gli altri non leggono.",
        body: "I produttori europei pubblicano le specifiche come schede PDF. Ogni strumento concorrente analizza le pagine web e si blocca. Metrica legge il PDF — la quota, il codice finitura, il prezzo — ed estrae i valori puliti.",
      },
      {
        title: "Una libreria che parla già italiano.",
        body: "B&B Italia, Cassina, Flos, Artemide, Molteni, Boffi. Millimetri corretti, prezzi trade in euro, descrizioni IT/EN — già caricati, così il capitolato parte già a metà.",
      },
      {
        title: "Documenti che conservano.",
        body: "Book di specifiche impaginati come pubblicazioni, esportati con il nome del tuo studio. Un link, e il cliente approva voce per voce. Niente PDF avanti e indietro.",
      },
    ],
  },

  pricing: {
    heading: "Prezzi semplici.",
    subheading: "Inizia gratis. Passa a un piano quando i capitolati si allungano.",
    plans: [
      {
        name: "Solo",
        price: "€39",
        cadence: "/mese",
        rows: ["1 postazione", "150 estrazioni/mese", "Progetti illimitati"],
        cta: "Inizia gratis",
      },
      {
        name: "Studio",
        price: "€79",
        cadence: "/mese",
        rows: [
          "Fino a 5 postazioni",
          "600 estrazioni/mese",
          "Progetti illimitati",
          "Branding dello studio",
        ],
        cta: "Inizia gratis",
        featuredLabel: "POPOLARE",
      },
      {
        name: "Studio+",
        price: "€149",
        cadence: "/mese",
        rows: [
          "Postazioni illimitate",
          "2.000 estrazioni/mese",
          "Progetti illimitati",
          "Branding dello studio",
          "Supporto prioritario",
        ],
        cta: "Inizia gratis",
      },
    ],
    note: "Prova di 14 giorni. Senza carta. Disdici quando vuoi.",
  },

  faq: {
    heading: "Domande frequenti",
    subheading: "Tutto quello che c'è da sapere su Metrica.",
    items: [
      {
        q: "Cos'è Metrica?",
        a: "Uno strumento di specifica per studi di interior design e architettura. Legge i PDF dei produttori e le pagine prodotto, compila il tuo capitolato FF&E ed esporta un book.",
      },
      {
        q: "Cosa riesce a leggere?",
        a: "Schede tecniche PDF, disegni tecnici, foto di prodotto e URL. I PDF sono il punto: la maggior parte dei marchi europei pubblica le specifiche così e gli altri strumenti non le leggono.",
      },
      {
        q: "Quali marchi ci sono nella libreria?",
        a: "B&B Italia, Cassina, Flos, Artemide, Molteni, Boffi e altri, con dimensioni metriche corrette e prezzi trade in euro. Puoi aggiungere qualsiasi prodotto.",
      },
      {
        q: "I miei clienti devono registrarsi?",
        a: "No. Invii un link. Approvano o rifiutano ogni voce e lasciano commenti. Niente da installare, niente registrazione.",
      },
      {
        q: "Dove sono conservati i miei dati?",
        a: "Su server europei. Metrica è conforme al GDPR. Puoi esportare o eliminare tutto in qualsiasi momento.",
      },
      {
        q: "Posso disdire quando voglio?",
        a: "Sì. Disdici dalle impostazioni, senza telefonate né email. I tuoi progetti restano esportabili.",
      },
    ],
  },

  closing: {
    heading: "Prepara il prossimo capitolato in un pomeriggio.",
    cta: "Inizia gratis",
  },

  footer: {
    wordmark: "Metrica",
    tagline: "Specifiche FF&E. Fatto a Milano.",
    productTitle: "Prodotto",
    companyTitle: "Azienda",
    languageTitle: "Lingua",
    contact: "Contatti",
    privacy: "Privacy",
    terms: "Termini",
    email: "hello@metrica.studio",
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
        heading: "Dove vivono i tuoi dati",
        body: [
          "I tuoi progetti sono conservati su server europei e Metrica è conforme al GDPR. I PDF caricati sono conservati solo finché il progetto ne ha bisogno; puoi esportare o eliminare tutto in qualsiasi momento.",
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
