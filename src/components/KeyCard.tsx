'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { ApiKey } from '@/lib/types';

interface KeyCardProps {
  apiKey: ApiKey;
  onUpdate: () => void;
}

export default function KeyCard({ apiKey, onUpdate }: KeyCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [showKey, setShowKey] = useState(false);
  const [error, setError] = useState('');

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('tr-TR', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      // You could add a toast notification here
    } catch (error) {
      console.error('Copy failed:', error);
    }
  };

  const toggleStatus = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/keys/${apiKey.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          status: apiKey.status === 'active' ? 'inactive' : 'active'
        }),
      });

      const data = await response.json();

      if (data.success) {
        onUpdate();
      } else {
        setError(data.error || 'Failed to update status');
      }
    } catch (error) {
      console.error('Toggle status error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteKey = async () => {
    if (!confirm('Are you sure you want to delete this API key? This action cannot be undone.')) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/keys/${apiKey.id}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (data.success) {
        onUpdate();
      } else {
        setError(data.error || 'Failed to delete key');
      }
    } catch (error) {
      console.error('Delete key error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const maskedKey = apiKey.key.substring(0, 12) + '•'.repeat(20);

  return (
    <Card className="bg-gray-800/30 border-gray-700 hover:bg-gray-800/50 transition-all duration-200">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-white text-lg">{apiKey.name}</CardTitle>
            <CardDescription className="text-gray-400 mt-1">
              {apiKey.description || 'No description provided'}
            </CardDescription>
          </div>
          <Badge 
            variant={apiKey.status === 'active' ? 'default' : 'secondary'}
            className={apiKey.status === 'active' ? 'bg-green-600 text-white' : 'bg-gray-600 text-gray-300'}
          >
            {apiKey.status}
          </Badge>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {error && (
          <Alert className="bg-red-900/20 border-red-500 text-red-400">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}
        
        {/* API Key Display */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-400">API Key</span>
            <Button
              onClick={() => setShowKey(!showKey)}
              variant="ghost"
              size="sm"
              className="text-blue-400 hover:text-blue-300 h-auto p-1"
            >
              {showKey ? 'Hide' : 'Show'}
            </Button>
          </div>
          
          <div className="flex items-center space-x-2">
            <code className="flex-1 bg-gray-900/50 border border-gray-600 rounded px-3 py-2 text-sm text-gray-300 font-mono">
              {showKey ? apiKey.key : maskedKey}
            </code>
            <Button
              onClick={() => copyToClipboard(apiKey.key)}
              variant="outline"
              size="sm"
              className="border-gray-600 text-gray-400 hover:bg-gray-700 flex-shrink-0"
            >
              Copy
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <span className="text-gray-400">Created</span>
            <div className="text-white font-medium">{formatDate(apiKey.createdAt)}</div>
          </div>
          <div>
            <span className="text-gray-400">Requests</span>
            <div className="text-white font-medium">{apiKey.requestCount.toLocaleString()}</div>
          </div>
          {apiKey.lastUsed && (
            <div className="col-span-2">
              <span className="text-gray-400">Last Used</span>
              <div className="text-white font-medium">{formatDate(apiKey.lastUsed)}</div>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex space-x-2 pt-4 border-t border-gray-700">
          <Button
            onClick={toggleStatus}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
          >
            {isLoading ? 'Loading...' : (apiKey.status === 'active' ? 'Deactivate' : 'Activate')}
          </Button>
          
          <Button
            onClick={deleteKey}
            variant="outline"
            size="sm"
            disabled={isLoading}
            className="flex-1 border-red-600 text-red-400 hover:bg-red-600 hover:text-white"
          >
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}