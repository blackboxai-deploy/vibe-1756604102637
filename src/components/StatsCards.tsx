'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Stats } from '@/lib/types';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const statCards = [
    {
      title: 'Total Keys',
      value: stats.totalKeys.toLocaleString(),
      description: 'API keys created',
      color: 'text-blue-400'
    },
    {
      title: 'Active Keys',
      value: stats.activeKeys.toLocaleString(),
      description: 'Currently active',
      color: 'text-green-400'
    },
    {
      title: 'Total Requests',
      value: stats.totalRequests.toLocaleString(),
      description: 'All time requests',
      color: 'text-purple-400'
    },
    {
      title: 'Requests Today',
      value: stats.requestsToday.toLocaleString(),
      description: 'Today\'s activity',
      color: 'text-orange-400'
    },
    {
      title: 'Avg Response Time',
      value: `${stats.avgResponseTime}ms`,
      description: 'Response performance',
      color: 'text-cyan-400'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {statCards.map((stat, index) => (
        <Card key={index} className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-200">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-300">
              {stat.title}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${stat.color} mb-1`}>
              {stat.value}
            </div>
            <p className="text-xs text-gray-500">
              {stat.description}
            </p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}