import { loadApiKeys, loadUsageLogs } from './storage';
import { Stats } from './types';

export async function getStats(): Promise<Stats> {
  const keys = await loadApiKeys();
  const logs = await loadUsageLogs();

  const totalKeys = keys.length;
  const activeKeys = keys.filter(k => k.status === 'active').length;
  const totalRequests = keys.reduce((sum, key) => sum + key.requestCount, 0);

  // Calculate requests today
  const today = new Date().toISOString().split('T')[0];
  const requestsToday = logs.filter(log => 
    log.timestamp.split('T')[0] === today
  ).length;

  // Calculate average response time
  const successfulLogs = logs.filter(log => log.success);
  const avgResponseTime = successfulLogs.length > 0
    ? successfulLogs.reduce((sum, log) => sum + log.responseTime, 0) / successfulLogs.length
    : 0;

  // Get top keys by request count
  const topKeys = keys
    .sort((a, b) => b.requestCount - a.requestCount)
    .slice(0, 5)
    .map(key => ({
      id: key.id,
      name: key.name,
      requests: key.requestCount
    }));

  return {
    totalKeys,
    activeKeys,
    totalRequests,
    requestsToday,
    avgResponseTime: Math.round(avgResponseTime),
    topKeys
  };
}

export async function getUsageChart(): Promise<Array<{ date: string; requests: number }>> {
  const logs = await loadUsageLogs();
  const dailyStats = new Map<string, number>();

  // Get last 7 days
  const today = new Date();
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toISOString().split('T')[0];
    dailyStats.set(dateStr, 0);
  }

  // Count requests per day
  logs.forEach(log => {
    const date = log.timestamp.split('T')[0];
    if (dailyStats.has(date)) {
      dailyStats.set(date, (dailyStats.get(date) || 0) + 1);
    }
  });

  // Convert to array
  return Array.from(dailyStats.entries()).map(([date, requests]) => ({
    date,
    requests
  }));
}