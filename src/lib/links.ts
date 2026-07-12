/**
 * Cross-boundary destinations.
 *
 * The marketing site and the application are separate deployments that share a
 * domain in production. Both CTAs land in the app:
 *   START / START FREE  → the trial-signup flow, which resolves to /projects
 *   SIGN IN             → the app's login
 *
 * These are rendered as plain <a href> (never next/link) because they cross the
 * app boundary — Next must do a full navigation, not a client-side route match.
 */
export const APP_START = "/projects";
export const APP_SIGN_IN = "/login";
