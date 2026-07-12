import type { Locale } from "@/lib/i18n";
import type { Content } from "./types";
import { en } from "./en";
import { it } from "./it";

const dictionaries: Record<Locale, Content> = { en, it };

export function getContent(locale: Locale): Content {
  return dictionaries[locale] ?? en;
}

export type { Content } from "./types";
