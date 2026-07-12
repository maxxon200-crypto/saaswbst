/**
 * The bilingual content contract. Both en.ts and it.ts implement this exactly,
 * so every section is guaranteed to have complete copy in both locales. The IT
 * manifesto and headlines are native rewrites, not literal translations.
 */

export interface Meta {
  title: string;
  description: string;
  ogAlt: string;
}

export interface NavContent {
  wordmark: string;
  /** in-page anchor links */
  links: { label: string; href: string }[];
  signIn: string;
  start: string;
  localeSwitch: string;
}

export interface HeroContent {
  eyebrow: string;
  /** headline split so exactly one word carries the accent */
  line1: string;
  line2: string;
  accent: string;
  subline: string;
  primaryCta: string;
  secondaryCta: string;
  corner: string;
}

export interface DemoContent {
  label: string;
  headline: string;
  /** schedule column labels, in display order */
  columns: string[];
  /** filled values, same order as columns — the type-in sequence */
  values: string[];
  caption: string;
  replay: string;
  /** mono strings rendered on the CSS cut-sheet (product-side, universal) */
  sheet: {
    docType: string;
    designer: string;
    specs: { k: string; v: string }[];
  };
}

export interface ProblemColumn {
  figure: string;
  body: string;
}

export interface ProblemContent {
  label: string;
  columns: ProblemColumn[];
}

export interface Capability {
  index: string;
  title: string;
  body: string;
}

export interface CapabilitiesContent {
  label: string;
  reads: Capability;
  library: Capability & { brands: string[]; brandAccentIndex: number };
  documents: Capability;
  /** labels used inside the spec-book mockup visual */
  specBook: {
    studio: string;
    project: string;
    item: string;
    footer: string;
    rows: { k: string; v: string }[];
  };
}

export interface PricingPlan {
  name: string;
  price: string;
  cadence: string;
  rows: string[];
  cta: string;
  /** the one plan flagged "MOST STUDIOS" */
  featuredLabel?: string;
}

export interface PricingContent {
  label: string;
  plans: PricingPlan[];
  note: string;
}

export interface ManifestoContent {
  label: string;
  lines: string[];
  /** the single word wrapped in --blood (first match across lines) */
  accent: string;
}

export interface FooterContent {
  wordmark: string;
  email: string;
  madeIn: string;
  privacy: string;
  terms: string;
  rights: string;
  /** flagged: no social links until real profiles exist */
  socialNote: string;
}

export interface LegalSection {
  heading: string;
  body: string[];
}

export interface LegalDoc {
  label: string;
  title: string;
  updated: string;
  sections: LegalSection[];
  backHome: string;
}

export interface Content {
  meta: Meta;
  nav: NavContent;
  hero: HeroContent;
  demo: DemoContent;
  problem: ProblemContent;
  capabilities: CapabilitiesContent;
  pricing: PricingContent;
  manifesto: ManifestoContent;
  footer: FooterContent;
  privacy: LegalDoc;
  terms: LegalDoc;
}
