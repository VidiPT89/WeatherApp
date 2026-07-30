import type { Dictionary, ErrorCode } from "@/i18n/dictionaries";
import type { ApiError } from "@/lib/api";

function isKnownErrorCode(dict: Dictionary, code: string | undefined): code is ErrorCode {
  return code !== undefined && code in dict.errors;
}

/**
 * The backend reuses the generic VALIDATION_FAILED error code for every `IllegalArgumentException`
 * (see WeatherAPI's `GlobalExceptionHandler`), including an admin trying to delete their own
 * account — so the error code alone can't distinguish it from any other validation failure.
 * Its message is a fixed literal (unlike Bean Validation's per-field dynamic text), so matching
 * on the pair of (code, message) here is safe and gives a much better message than the generic
 * VALIDATION_FAILED fallback.
 */
const VALIDATION_MESSAGE_OVERRIDES: Record<string, ErrorCode> = {
  "You cannot delete your own admin account.": "ADMIN_SELF_DELETE",
};

export function translateApiError(dict: Dictionary, error: unknown, fallback: string = dict.errors.GENERIC): string {
  const errorCode = error instanceof Error ? (error as ApiError).errorCode : undefined;
  const message = error instanceof Error ? error.message : undefined;

  if (errorCode === "VALIDATION_FAILED" && message !== undefined && message in VALIDATION_MESSAGE_OVERRIDES) {
    return dict.errors[VALIDATION_MESSAGE_OVERRIDES[message]];
  }

  if (isKnownErrorCode(dict, errorCode)) return dict.errors[errorCode];
  return fallback;
}
