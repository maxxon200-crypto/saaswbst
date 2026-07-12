import { NextRequest, NextResponse } from "next/server";
import { defaultLocale, locales } from "@/lib/i18n";

/**
 * Locale routing without a library, for the MARKETING zone only.
 *   - Default locale (en) is served at the clean root:  /  ,  /privacy
 *   - Non-default locales carry a prefix:                /it ,  /it/privacy
 * Internally every request is rewritten to /<locale>/... so a single
 * app/[locale] tree (with <html lang={locale}>) serves everything.
 *
 * The application zone is a separate deployment. Its paths are excluded here so
 * the i18n rewrite never touches them, exactly as the spec requires.
 */
const APP_PATHS = ["/projects", "/library", "/settings", "/login", "/api", "/share"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Never rewrite application routes into the [locale] tree.
  if (APP_PATHS.some((p) => pathname === p || pathname.startsWith(`${p}/`))) {
    return NextResponse.next();
  }

  // Canonicalise explicit default-locale URLs (/en, /en/foo) back to the root.
  if (pathname === `/${defaultLocale}` || pathname.startsWith(`/${defaultLocale}/`)) {
    const stripped = pathname.slice(`/${defaultLocale}`.length) || "/";
    return NextResponse.redirect(new URL(stripped, request.url));
  }

  // A non-default locale prefix already maps onto the [locale] segment.
  const hasLocalePrefix = locales.some(
    (l) => pathname === `/${l}` || pathname.startsWith(`/${l}/`),
  );
  if (hasLocalePrefix) return NextResponse.next();

  // Everything else is default-locale content: rewrite while keeping the URL.
  return NextResponse.rewrite(new URL(`/${defaultLocale}${pathname}`, request.url));
}

export const config = {
  // Run on everything except Next internals and files with an extension.
  matcher: ["/((?!_next|.*\\..*).*)"],
};
