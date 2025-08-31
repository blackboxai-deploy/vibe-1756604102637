'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StatsCards from '@/components/StatsCards';
import UsageChart from '@/components/UsageChart';
import TopKeysTable from '@/components/TopKeysTable';
import { Stats } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [usageChart, setUsageChart] = useState<Array<{ date: string; requests: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setUsageChart(data.data.usageChart);
      } else {
        setError(data.error || 'Failed to fetch statistics');
      }
    } catch (error) {
      console.error('Stats error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div>
        <Navigation currentPage="dashboard" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-lg">Loading dashboard...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <Navigation currentPage="dashboard" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-red-900/20 border-red-500">
            <CardContent className="pt-6">
              <div className="text-red-400 text-center">
                {error || 'Failed to load dashboard data'}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation currentPage="dashboard" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Dashboard</h1>
          <p className="text-gray-400">Monitor your API key usage and performance</p>
        </div>

        {/* Stats Cards */}
        <StatsCards stats={stats} />

        {/* Charts and Tables */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <UsageChart data={usageChart} />
          <TopKeysTable topKeys={stats.topKeys} />
        </div>

        {/* Welcome Message for First Time Users */}
        {stats.totalKeys === 0 && (
          <Card className="bg-blue-900/20 border-blue-500 mt-8">
            <CardHeader>
              <CardTitle className="text-blue-400">Welcome to API Key Manager!</CardTitle>
              <CardDescription className="text-blue-300">
                Get started by creating your first API key
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-blue-200 space-y-2">
                <p>• Navigate to <strong>API Keys</strong> to create and manage your keys</p>
                <p>• Use the <strong>API Docs</strong> section to learn how to validate keys</p>
                <p>• Monitor usage statistics right here on the dashboard</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}