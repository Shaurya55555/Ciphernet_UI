export interface User {
  _id: string;
  username: string;
  email: string;
  role: string;
}

export interface Server {
  id: string;
  location: string;
  countryCode?: string; // e.g., 'US', 'DE'
  load: number;
}

export interface ConnectionData {
  _id: string;
  serverLocation: string;
  connectionTime: string;
  clientIp: string;
}

export interface ApiResponse<T> {
  status: 'success' | 'error' | 'mfa_required';
  message?: string;
  token?: string;
  data?: T;
  userId?: string; // For MFA flow
}

export enum ConnectionState {
  DISCONNECTED = 'DISCONNECTED',
  CONNECTING = 'CONNECTING',
  CONNECTED = 'CONNECTED',
  DISCONNECTING = 'DISCONNECTING'
}
