/**
 * The bilingual content contract. Both en.ts and it.ts implement this exactly,
 * so every section is guaranteed to have complete copy in both locales.
 */

export interface NavContent {
  wordmark: string;
  links: { label: string; href: string }[];
  /** aria-label for the locale toggle */
  localeSwitch: string;
}

export interface HeroContent {
  /** headline is split so exactly one word carries the accent */
  headlinePre: string;
  headlineAccent: string;
  headlinePost: string;
  subline: string;
  primaryCta: string;
  secondaryCta: string;
}

export interface ProblemContent {
  label: string;
  title: string;
  columns: { title: string; body: string }[];
}

export interface HowStep {
  title: string;
  body: string;
  /** present only on the single step that mentions extraction */
  aiNote?: string;
  /** which in-page mockup renders alongside this step */
  visual: "schedule" | "product" | "specsheet";
}

export interface HowContent {
  label: string;
  steps: HowStep[];
}

export interface PricingPlan {
  name: string;
  price: string;
  cadence: string;
  rows: string[];
  /** the one plan flagged "For most studios" */
  featuredLabel?: string;
}

export interface PricingContent {
  label: string;
  title: string;
  plans: PricingPlan[];
  note: string;
  cta: string;
}

export interface ManifestoContent {
  label: string;
  lines: string[];
}

export interface WaitlistContent {
  label: string;
  title: string;
  lede: string;
  fields: {
    email: string;
    studioName: string;
    country: string;
    role: string;
  };
  optional: string;
  countryPlaceholder: string;
  rolePlaceholder: string;
  countryGroups: { label: string; options: string[] }[];
  roles: string[];
  submit: string;
  submitting: string;
  success: string;
  errors: {
    email: string;
    generic: string;
  };
}

export interface FooterContent {
  madeIn: string;
  email: string;
  privacy: string;
  /** flagged: no social links until real profiles exist */
  rights: string;
}

export interface PrivacySection {
  heading: string;
  body: string[];
}

export interface PrivacyContent {
  label: string;
  title: string;
  updated: string;
  reviewNote: string;
  sections: PrivacySection[];
  backHome: string;
}

export interface Meta {
  title: string;
  description: string;
}

export interface Content {
  meta: Meta;
  nav: NavContent;
  hero: HeroContent;
  problem: ProblemContent;
  how: HowContent;
  pricing: PricingContent;
  manifesto: ManifestoContent;
  waitlist: WaitlistContent;
  footer: FooterContent;
  privacy: PrivacyContent;
}
