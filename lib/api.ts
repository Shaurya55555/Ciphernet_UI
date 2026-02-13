// In a real app, use environment variable
const BASE_URL = 'http://localhost:43001/api/v1';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
  const token = localStorage.getItem('ciphernet_token');
  
  const headers = new Headers(options.headers);
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }
  if (!headers.has('Content-Type')) {
    headers.set('Content-Type', 'application/json');
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json();

  if (!response.ok) {
    throw new ApiError(data.message || 'Something went wrong', response.status);
  }

  return data;
}

export const api = {
  auth: {
    login: (body: any) => request<any>('/auth/login', { method: 'POST', body: JSON.stringify(body) }),
    register: (body: any) => request<any>('/auth/register', { method: 'POST', body: JSON.stringify(body) }),
    me: () => request<any>('/auth/me'),
    verifyMfa: (body: any) => request<any>('/auth/mfa/verify', { method: 'POST', body: JSON.stringify(body) }),
    setupMfa: () => request<any>('/auth/mfa/setup', { method: 'POST' }),
    disableMfa: (body: any) => request<any>('/auth/mfa/disable', { method: 'POST', body: JSON.stringify(body) }),
    logout: () => request<any>('/auth/logout', { method: 'POST' }),
  },
  vpn: {
    servers: () => request<any>('/vpn/servers'),
    connect: (location: string) => request<any>('/vpn/connect', { method: 'POST', body: JSON.stringify({ serverLocation: location }) }),
    disconnect: () => request<any>('/vpn/disconnect', { method: 'POST' }),
    status: () => request<any>('/vpn/status'),
  },
  health: () => request<any>('/health'),
};
