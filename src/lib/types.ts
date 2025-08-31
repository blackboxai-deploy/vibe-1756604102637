export interface ApiKey {
  id: string;
  key: string;
  name: string;
  description: string;
  status: 'active' | 'inactive';
  createdAt: string;
  lastUsed?: string;
  requestCount: number;
  rateLimit?: number;
}

export interface UsageLog {
  id: string;
  keyId: string;
  timestamp: string;
  ip: string;
  userAgent?: string;
  endpoint: string;
  success: boolean;
  responseTime: number;
}

export interface Config {
  adminCredentials: {
    username: string;
    password: string;
  };
  rateLimit: {
    requestsPerMinute: number;
    windowMs: number;
  };
  security: {
    sessionSecret: string;
    allowedOrigins: string[];
  };
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface ValidationResponse {
  valid: boolean;
  keyId?: string;
  remaining?: number;
  resetTime?: number;
}

export interface Stats {
  totalKeys: number;
  activeKeys: number;
  totalRequests: number;
  requestsToday: number;
  avgResponseTime: number;
  topKeys: Array<{
    id: string;
    name: string;
    requests: number;
  }>;
}