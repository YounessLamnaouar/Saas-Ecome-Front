/**
 * Thin HTTP client for the store's product/category API.
 *
 * Supports GET requests as well as authenticated POST, PUT, DELETE mutations.
 */

export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:8000/api/v1";

export class ApiError extends Error {
  constructor(message, { status, payload } = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.payload = payload;
  }
}

function buildUrl(path, params) {
  const url = new URL(`${API_BASE_URL}${path}`);
  Object.entries(params || {}).forEach(([key, value]) => {
    if (value === undefined || value === null || value === "") return;
    url.searchParams.set(key, value);
  });
  return url.toString();
}

function unwrapEnvelope(json) {
  if (json && typeof json === "object" && "data" in json) {
    return { data: json.data, meta: json.meta || null };
  }
  return { data: json, meta: null };
}

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request(path, { params, signal } = {}) {
  const url = buildUrl(path, params);
  let response;
  try {
    response = await fetch(url, {
      signal,
      headers: { Accept: "application/json", ...authHeaders() },
    });
  } catch (cause) {
    throw new ApiError(`Network error reaching ${url}`, { status: 0, payload: cause });
  }

  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(json?.message || `Request failed (${response.status})`, {
      status: response.status,
      payload: json,
    });
  }
  return unwrapEnvelope(json);
}

async function mutate(method, path, body) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...authHeaders(),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (response.status === 204) return { data: null, meta: null };
  const json = await response.json().catch(() => null);
  if (!response.ok) {
    throw new ApiError(json?.message || `Request failed (${response.status})`, {
      status: response.status,
      payload: json,
    });
  }
  return unwrapEnvelope(json);
}

export const apiClient = {
  get: (path, opts) => request(path, opts),
  post: (path, body) => mutate("POST", path, body),
  put: (path, body) => mutate("PUT", path, body),
  delete: (path) => mutate("DELETE", path),
};
