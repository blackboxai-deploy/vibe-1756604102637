'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import StatsCards from '@/components/StatsCards';
import UsageChart from '@/components/UsageChart';
import TopKeysTable from '@/components/TopKeysTable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Stats } from '@/lib/types';

export default function StatsPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [usageChart, setUsageChart] = useState<Array<{ date: string; requests: number }>>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('/api/stats');
      const data = await response.json();

      if (data.success) {
        setStats(data.data.stats);
        setUsageChart(data.data.usageChart);
        setError('');
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
        <Navigation currentPage="stats" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-lg">Loading statistics...</div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !stats) {
    return (
      <div>
        <Navigation currentPage="stats" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Card className="bg-red-900/20 border-red-500">
            <CardContent className="pt-6">
              <div className="text-red-400 text-center mb-4">
                {error || 'Failed to load statistics'}
              </div>
              <div className="text-center">
                <Button 
                  onClick={fetchStats} 
                  variant="outline"
                  className="border-red-500 text-red-400 hover:bg-red-600 hover:text-white"
                >
                  Retry
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation currentPage="stats" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">Statistics</h1>
            <p className="text-gray-400">Detailed analytics and performance metrics</p>
          </div>
          
          <Button
            onClick={fetchStats}
            variant="outline"
            className="border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            Refresh Data
          </Button>
        </div>

        {/* Stats Overview */}
        <StatsCards stats={stats} />

        {/* Detailed Analytics */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <UsageChart data={usageChart} />
          <TopKeysTable topKeys={stats.topKeys} />
        </div>

        {/* Additional Insights */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* API Health */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">API Health</CardTitle>
              <CardDescription className="text-gray-400">
                System performance metrics
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average Response Time</span>
                <span className={`font-mono ${
                  stats.avgResponseTime < 100 ? 'text-green-400' :
                  stats.avgResponseTime < 500 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {stats.avgResponseTime}ms
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Active Keys Rate</span>
                <span className="text-blue-400 font-mono">
                  {stats.totalKeys > 0 ? Math.round((stats.activeKeys / stats.totalKeys) * 100) : 0}%
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Daily Activity</span>
                <span className="text-purple-400 font-mono">
                  {stats.requestsToday} requests
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Usage Insights */}
          <Card className="bg-gray-800/30 border-gray-700">
            <CardHeader>
              <CardTitle className="text-white">Usage Insights</CardTitle>
              <CardDescription className="text-gray-400">
                Key performance analysis
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Average Requests per Key</span>
                <span className="text-cyan-400 font-mono">
                  {stats.totalKeys > 0 ? Math.round(stats.totalRequests / stats.totalKeys) : 0}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Most Active Key</span>
                <span className="text-orange-400 font-mono">
                  {stats.topKeys[0]?.requests.toLocaleString() || 'N/A'} requests
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-300">Total API Calls</span>
                <span className="text-green-400 font-mono">
                  {stats.totalRequests.toLocaleString()}
                </span>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* No Data Message */}
        {stats.totalKeys === 0 && (
          <Card className="bg-blue-900/20 border-blue-500 mt-8">
            <CardHeader>
              <CardTitle className="text-blue-400">No Data Available</CardTitle>
              <CardDescription className="text-blue-300">
                Statistics will appear once you create API keys and start using them
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="text-blue-200">
                <p>Create your first API key to start seeing detailed analytics and usage statistics here.</p>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}