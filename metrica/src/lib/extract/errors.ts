export type ExtractErrorCode =
  | "unauthorized"
  | "invalid_input"
  | "not_configured"
  | "quota_exceeded"
  | "fetch_failed"
  | "file_failed"
  | "parse_failed"
  | "anthropic_error"
  | "timeout";

/** Typed extraction error. The client maps `code` to a specific UI state. */
export class ExtractError extends Error {
  constructor(
    public readonly code: ExtractErrorCode,
    message: string,
  ) {
    super(message);
    this.name = "ExtractError";
  }
}

const HTTP_STATUS: Record<ExtractErrorCode, number> = {
  unauthorized: 401,
  invalid_input: 400,
  not_configured: 503,
  quota_exceeded: 402,
  fetch_failed: 422,
  file_failed: 422,
  parse_failed: 502,
  anthropic_error: 502,
  timeout: 504,
};

export function errorStatus(code: ExtractErrorCode): number {
  return HTTP_STATUS[code] ?? 500;
}
