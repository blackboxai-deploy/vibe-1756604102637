import { ApiKey, UsageLog } from './types';
import { loadApiKeys, addApiKey, updateApiKey, deleteApiKey, findApiKeyByKey, addUsageLog } from './storage';

// Generate unique API key
export function generateApiKey(): string {
  const prefix = 'ak_';
  const randomHex = Array.from({ length: 32 }, () => 
    Math.floor(Math.random() * 16).toString(16)
  ).join('');
  return prefix + randomHex;
}

// Generate unique ID for keys
export function generateId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

// Create new API key
export async function createApiKey(name: string, description: string = ''): Promise<ApiKey> {
  const apiKey: ApiKey = {
    id: generateId(),
    key: generateApiKey(),
    name,
    description,
    status: 'active',
    createdAt: new Date().toISOString(),
    requestCount: 0
  };

  await addApiKey(apiKey);
  return apiKey;
}

// Get all API keys
export async function getAllApiKeys(): Promise<ApiKey[]> {
  return loadApiKeys();
}

// Get API key by ID
export async function getApiKeyById(id: string): Promise<ApiKey | null> {
  const keys = await loadApiKeys();
  return keys.find(k => k.id === id) || null;
}

// Update API key
export async function updateApiKeyById(id: string, updates: Partial<ApiKey>): Promise<boolean> {
  return updateApiKey(id, updates);
}

// Delete API key
export async function deleteApiKeyById(id: string): Promise<boolean> {
  return deleteApiKey(id);
}

// Validate API key
export async function validateApiKey(key: string): Promise<{ valid: boolean; keyData?: ApiKey }> {
  const keyData = await findApiKeyByKey(key);
  
  if (!keyData) {
    return { valid: false };
  }

  if (keyData.status !== 'active') {
    return { valid: false };
  }

  // Update last used and request count
  await updateApiKey(keyData.id, {
    lastUsed: new Date().toISOString(),
    requestCount: keyData.requestCount + 1
  });

  return { valid: true, keyData };
}

// Log API usage
export async function logApiUsage(
  keyId: string,
  ip: string,
  endpoint: string,
  success: boolean,
  responseTime: number,
  userAgent?: string
): Promise<void> {
  const log: UsageLog = {
    id: generateId(),
    keyId,
    timestamp: new Date().toISOString(),
    ip,
    userAgent,
    endpoint,
    success,
    responseTime
  };

  await addUsageLog(log);
}

// Check if key name already exists
export async function isKeyNameExists(name: string, excludeId?: string): Promise<boolean> {
  const keys = await loadApiKeys();
  return keys.some(k => k.name === name && k.id !== excludeId);
}