import Constants from 'expo-constants';
import { Platform } from 'react-native';

export async function simulateRequest(payload, delay = 180) {
  await new Promise((resolve) => setTimeout(resolve, delay));
  return payload;
}

export class ApiError extends Error {
  constructor(status, message, data) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

function stripTrailingSlash(value) {
  return value.replace(/\/+$/, '');
}

function getExpoHost() {
  const expoConfig = Constants.expoConfig;
  const hostUri = expoConfig?.hostUri;

  if (!hostUri) {
    return null;
  }

  return hostUri.split(':')[0] ?? null;
}

export function getApiBaseUrl() {
  // Temporary bypass: ignore EXPO_PUBLIC_API_URL to ensure 
  // the app hits our Express backend instead of hitting Supabase directly.
  // const envUrl = process.env.EXPO_PUBLIC_API_URL?.trim();

  const expoHost = getExpoHost();

  if (expoHost) {
    return `http://${expoHost}:4000/api`;
  }

  return Platform.OS === 'android' ? 'http://10.0.2.2:4000/api' : 'http://localhost:4000/api';
}

function buildHeaders(headers, hasBody, userId) {
  const requestHeaders = new Headers(headers);

  if (!requestHeaders.has('Accept')) {
    requestHeaders.set('Accept', 'application/json');
  }

  if (hasBody && !requestHeaders.has('Content-Type')) {
    requestHeaders.set('Content-Type', 'application/json');
  }

  if (userId) {
    requestHeaders.set('x-user-id', userId);
  }

  return requestHeaders;
}

function parseResponseBody(raw) {
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw);
  } catch {
    return raw;
  }
}

export async function apiRequest(path, options = {}) {
  const { body, headers, userId, ...requestInit } = options;
  const normalizedPath = path.startsWith('/') ? path : `/${path}`;
  const url = `${getApiBaseUrl()}${normalizedPath}`;

  let response;

  try {
    response = await fetch(url, {
      ...requestInit,
      headers: buildHeaders(headers, body !== undefined, userId),
      body: body === undefined ? undefined : JSON.stringify(body),
    });
  } catch {
    throw new Error(`Unable to reach backend at ${getApiBaseUrl()}. Set EXPO_PUBLIC_API_URL if needed.`);
  }

  const rawBody = await response.text();
  const parsedBody = parseResponseBody(rawBody);

  if (!response.ok) {
    const message =
      typeof parsedBody === 'object' &&
      parsedBody &&
      'message' in parsedBody &&
      typeof parsedBody.message === 'string'
        ? parsedBody.message
        : `Request failed with status ${response.status}.`;

    throw new ApiError(response.status, message, parsedBody);
  }

  return parsedBody;
}
