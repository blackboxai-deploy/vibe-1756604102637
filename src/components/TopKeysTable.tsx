'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Stats } from '@/lib/types';

interface TopKeysTableProps {
  topKeys: Stats['topKeys'];
}

export default function TopKeysTable({ topKeys }: TopKeysTableProps) {
  if (topKeys.length === 0) {
    return (
      <Card className="bg-gray-800/30 border-gray-700">
        <CardHeader>
          <CardTitle className="text-white">Top API Keys</CardTitle>
          <CardDescription className="text-gray-400">
            Most active API keys by request count
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-gray-400">
            No API keys with usage data yet
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="bg-gray-800/30 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Top API Keys</CardTitle>
        <CardDescription className="text-gray-400">
          Most active API keys by request count
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="rounded-md border border-gray-600 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-gray-700/30 border-gray-600 hover:bg-gray-700/30">
                <TableHead className="text-gray-300 font-medium">Rank</TableHead>
                <TableHead className="text-gray-300 font-medium">Key Name</TableHead>
                <TableHead className="text-gray-300 font-medium text-right">Requests</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {topKeys.map((key, index) => (
                <TableRow key={key.id} className="border-gray-600 hover:bg-gray-700/20">
                  <TableCell className="text-gray-300">
                    <Badge 
                      variant="outline" 
                      className={`
                        ${index === 0 ? 'border-yellow-500 text-yellow-400' : ''}
                        ${index === 1 ? 'border-gray-400 text-gray-400' : ''}
                        ${index === 2 ? 'border-orange-500 text-orange-400' : ''}
                        ${index > 2 ? 'border-gray-600 text-gray-500' : ''}
                      `}
                    >
                      #{index + 1}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-white font-medium">
                    {key.name}
                  </TableCell>
                  <TableCell className="text-right text-blue-400 font-mono">
                    {key.requests.toLocaleString()}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
}