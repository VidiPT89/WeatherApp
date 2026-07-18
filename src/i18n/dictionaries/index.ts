import en from "./en";
import pt from "./pt";
import type { Dictionary } from "./types";
import type { Locale } from "@/i18n/locale";

export const dictionaries: Record<Locale, Dictionary> = { pt, en };

export type { Dictionary, ErrorCode } from "./types";
