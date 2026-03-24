export const API_BASE_URL = 'http://localhost:3000/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  let token = null;
  if (typeof window !== 'undefined') {
    token = localStorage.getItem('dependar_token');
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    let errorMessage = 'API Request Failed';
    try {
      const errPayload = await response.json();
      errorMessage = errPayload.message || errorMessage;
    } catch (_) {}
    throw new Error(errorMessage);
  }

  return response.json();
}
