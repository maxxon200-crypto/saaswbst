import { type NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return await updateSession(request);
}

export const config = {
  // Everything except Next internals, static assets, the public share view, and
  // auth callbacks (which must run without a redirect).
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|share|login|auth|api|.*\\.[a-zA-Z0-9]+$).*)",
  ],
};
