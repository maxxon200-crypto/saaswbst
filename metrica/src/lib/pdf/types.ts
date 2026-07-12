export interface SpecBookOptions {
  cover: boolean;
  prices: "trade" | "client" | "none";
  group: "room" | "category";
  locale: "en" | "it" | "bilingual";
  paper: "A4" | "Letter";
}

export const DEFAULT_OPTIONS: SpecBookOptions = {
  cover: true,
  prices: "trade",
  group: "room",
  locale: "en",
  paper: "A4",
};

export function parseSpecBookOptions(sp: URLSearchParams): SpecBookOptions {
  const one = <T extends string>(key: string, allowed: readonly T[], fallback: T): T => {
    const v = sp.get(key);
    return (allowed as readonly string[]).includes(v ?? "") ? (v as T) : fallback;
  };
  return {
    cover: sp.get("cover") !== "0",
    prices: one("prices", ["trade", "client", "none"] as const, "trade"),
    group: one("group", ["room", "category"] as const, "room"),
    locale: one("locale", ["en", "it", "bilingual"] as const, "en"),
    paper: one("paper", ["A4", "Letter"] as const, "A4"),
  };
}
