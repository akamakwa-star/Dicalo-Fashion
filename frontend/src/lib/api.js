const trimTrailingSlash = (value) => value.replace(/\/+$/, '');

const toBoolean = (value) => String(value || '').toLowerCase() === 'true';

export const API_BASE_URL = trimTrailingSlash(import.meta.env.VITE_API_BASE_URL || '/api');
export const FORCE_MOCK_DATA = toBoolean(import.meta.env.VITE_USE_MOCK_DATA);

export class ApiError extends Error {
  constructor(message, status = 0) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

export const buildApiUrl = (path) => `${API_BASE_URL}${path.startsWith('/') ? path : `/${path}`}`;

export const withAuth = (token, headers = {}) => ({
  ...headers,
  ...(token ? { Authorization: `Bearer ${token}` } : {})
});

export const requestJson = async (path, options = {}) => {
  const response = await fetch(buildApiUrl(path), options);
  const raw = await response.text();

  let data = {};
  if (raw) {
    try {
      data = JSON.parse(raw);
    } catch {
      throw new ApiError('API returned non-JSON response. Confirm backend is running and URL is correct.', response.status || 0);
    }
  }

  if (!response.ok) {
    const message = data.detail || data.error || data.message || 'API request failed';
    throw new ApiError(message, response.status || 0);
  }

  return data;
};
