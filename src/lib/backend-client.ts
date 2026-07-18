import "server-only";
import type { ApiErrorBody } from "@/types/weather";

const BASE_URL = process.env.WEATHER_API_URL ?? "http://localhost:8080";

export class BackendApiError extends Error {
  status: number;
  errorCode?: string;

  constructor(status: number, message: string, errorCode?: string) {
    super(message);
    this.name = "BackendApiError";
    this.status = status;
    this.errorCode = errorCode;
  }
}

interface RequestOptions {
  method?: string;
  token?: string;
  body?: unknown;
  searchParams?: Record<string, string | number | undefined>;
}

export async function backendFetch<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const url = new URL(path, BASE_URL);
  for (const [key, value] of Object.entries(options.searchParams ?? {})) {
    if (value !== undefined) url.searchParams.set(key, String(value));
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (options.token) headers.Authorization = `Bearer ${options.token}`;

  const response = await fetch(url, {
    method: options.method ?? "GET",
    headers,
    body: options.body !== undefined ? JSON.stringify(options.body) : undefined,
    cache: "no-store",
  });

  if (!response.ok) {
    const body = await extractErrorBody(response);
    throw new BackendApiError(response.status, body.message, body.errorCode);
  }

  if (response.status === 204) {
    return undefined as T;
  }

  return (await response.json()) as T;
}

async function extractErrorBody(response: Response): Promise<ApiErrorBody> {
  try {
    const body = (await response.json()) as ApiErrorBody;
    return { message: body.message ?? response.statusText, errorCode: body.errorCode };
  } catch {
    return { message: response.statusText };
  }
}
