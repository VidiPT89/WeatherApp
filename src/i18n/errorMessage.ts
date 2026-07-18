import type { Dictionary, ErrorCode } from "@/i18n/dictionaries";
import type { ApiError } from "@/lib/api";

function isKnownErrorCode(dict: Dictionary, code: string | undefined): code is ErrorCode {
  return code !== undefined && code in dict.errors;
}

export function translateApiError(dict: Dictionary, error: unknown, fallback: string = dict.errors.GENERIC): string {
  const errorCode = error instanceof Error ? (error as ApiError).errorCode : undefined;
  if (isKnownErrorCode(dict, errorCode)) return dict.errors[errorCode];
  return fallback;
}
