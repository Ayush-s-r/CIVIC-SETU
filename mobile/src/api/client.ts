import { loadSession } from "../services/session";

// IMPORTANT: update this to your PC's LAN IP for real-device testing.
// Example: http://192.168.1.10:8080/api
export const API_BASE_URL = "http://10.0.2.2:8080/api";
export const BACKEND_BASE_URL = API_BASE_URL.replace(/\/api$/, "");

type RequestOptions = Omit<RequestInit, "headers"> & {
  headers?: Record<string, string>;
  auth?: boolean;
};

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = true, headers, ...rest } = options;

  const token = auth ? (await loadSession()).token : null;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(headers ?? {}),
    },
    ...rest,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data &&
        typeof data === "object" &&
        "message" in data &&
        typeof (data as any).message === "string" &&
        (data as any).message) ||
      `HTTP ${res.status}`;
    throw new Error(message);
  }

  return data as T;
}

function safeJson(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
}

