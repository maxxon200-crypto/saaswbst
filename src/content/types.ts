/**
 * The bilingual content contract. Both en.ts and it.ts implement this exactly,
 * so every section has complete copy in both locales. IT is a native rewrite.
 */

export interface Meta {
  title: string;
  description: string;
  ogAlt: string;
}

export interface NavContent {
  wordmark: string;
  links: { label: string; href: string }[];
  signIn: string;
  start: string;
  localeSwitch: string;
}

export interface HeroContent {
  headline: string;
  subline: string;
  cta: string;
  ctaNote: string;
}

export interface SocialProofContent {
  lead: string;
  brands: string[];
  caption: string;
}

export interface FeatureItem {
  title: string;
  body: string;
}

export interface FeaturesContent {
  heading: string;
  subheading: string;
  items: FeatureItem[];
}

export interface PricingPlan {
  name: string;
  price: string;
  cadence: string;
  rows: string[];
  cta: string;
  featuredLabel?: string;
}

export interface PricingContent {
  heading: string;
  subheading: string;
  plans: PricingPlan[];
  note: string;
}

export interface FaqContent {
  heading: string;
  subheading: string;
  items: { q: string; a: string }[];
}

export interface ClosingContent {
  heading: string;
  cta: string;
}

export interface FooterContent {
  wordmark: string;
  tagline: string;
  productTitle: string;
  companyTitle: string;
  languageTitle: string;
  contact: string;
  privacy: string;
  terms: string;
  email: string;
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
  /** placeholder label shown in a video slot until the mp4 is dropped in */
  videoPlaceholder: string;
  nav: NavContent;
  hero: HeroContent;
  socialProof: SocialProofContent;
  features: FeaturesContent;
  pricing: PricingContent;
  faq: FaqContent;
  closing: ClosingContent;
  footer: FooterContent;
  privacy: LegalDoc;
  terms: LegalDoc;
}
