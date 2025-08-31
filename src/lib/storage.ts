import { promises as fs } from 'node:fs';
import path from 'node:path';
import { ApiKey, UsageLog, Config } from './types';

const DATA_DIR = path.join(process.cwd(), 'data');

// Ensure data directory exists
async function ensureDataDir() {
  try {
    await fs.access(DATA_DIR);
  } catch {
    await fs.mkdir(DATA_DIR, { recursive: true });
  }
}

// Generic file operations
async function readJsonFile<T>(filename: string): Promise<T[]> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.warn(`Could not read ${filename}, returning empty array:`, error);
    return [];
  }
}

async function writeJsonFile<T>(filename: string, data: T[]): Promise<void> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, filename);
  await fs.writeFile(filePath, JSON.stringify(data, null, 2));
}

// API Keys operations
export async function loadApiKeys(): Promise<ApiKey[]> {
  return readJsonFile<ApiKey>('keys.json');
}

export async function saveApiKeys(keys: ApiKey[]): Promise<void> {
  await writeJsonFile('keys.json', keys);
}

export async function addApiKey(key: ApiKey): Promise<void> {
  const keys = await loadApiKeys();
  keys.push(key);
  await saveApiKeys(keys);
}

export async function updateApiKey(keyId: string, updates: Partial<ApiKey>): Promise<boolean> {
  const keys = await loadApiKeys();
  const index = keys.findIndex(k => k.id === keyId);
  
  if (index === -1) return false;
  
  keys[index] = { ...keys[index], ...updates };
  await saveApiKeys(keys);
  return true;
}

export async function deleteApiKey(keyId: string): Promise<boolean> {
  const keys = await loadApiKeys();
  const filtered = keys.filter(k => k.id !== keyId);
  
  if (filtered.length === keys.length) return false;
  
  await saveApiKeys(filtered);
  return true;
}

export async function findApiKeyByKey(key: string): Promise<ApiKey | null> {
  const keys = await loadApiKeys();
  return keys.find(k => k.key === key) || null;
}

// Usage logs operations
export async function loadUsageLogs(): Promise<UsageLog[]> {
  return readJsonFile<UsageLog>('usage.json');
}

export async function saveUsageLogs(logs: UsageLog[]): Promise<void> {
  await writeJsonFile('usage.json', logs);
}

export async function addUsageLog(log: UsageLog): Promise<void> {
  const logs = await loadUsageLogs();
  logs.push(log);
  
  // Keep only last 10000 logs to prevent file from growing too large
  if (logs.length > 10000) {
    logs.splice(0, logs.length - 10000);
  }
  
  await saveUsageLogs(logs);
}

// Config operations
export async function loadConfig(): Promise<Config> {
  await ensureDataDir();
  const filePath = path.join(DATA_DIR, 'config.json');
  
  try {
    const data = await fs.readFile(filePath, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    // Return default config if file doesn't exist
    const defaultConfig: Config = {
      adminCredentials: {
        username: 'admin',
        password: 'admin123'
      },
      rateLimit: {
        requestsPerMinute: 100,
        windowMs: 60000
      },
      security: {
        sessionSecret: 'your-super-secret-session-key-here',
        allowedOrigins: ['*']
      }
    };
    
    await fs.writeFile(filePath, JSON.stringify(defaultConfig, null, 2));
    return defaultConfig;
  }
}