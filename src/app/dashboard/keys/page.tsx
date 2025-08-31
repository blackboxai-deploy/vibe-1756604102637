'use client';

import { useState, useEffect } from 'react';
import Navigation from '@/components/Navigation';
import KeyForm from '@/components/KeyForm';
import KeyCard from '@/components/KeyCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ApiKey } from '@/lib/types';

export default function KeysPage() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchKeys();
  }, []);

  const fetchKeys = async () => {
    try {
      const response = await fetch('/api/keys');
      const data = await response.json();

      if (data.success) {
        setKeys(data.data);
      } else {
        setError(data.error || 'Failed to fetch keys');
      }
    } catch (error) {
      console.error('Fetch keys error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFormSuccess = () => {
    setShowForm(false);
    fetchKeys();
  };

  const handleFormCancel = () => {
    setShowForm(false);
  };

  if (isLoading) {
    return (
      <div>
        <Navigation currentPage="keys" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center justify-center h-64">
            <div className="text-gray-400 text-lg">Loading API keys...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <Navigation currentPage="keys" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-white mb-2">API Keys</h1>
            <p className="text-gray-400">Manage your API keys and access tokens</p>
          </div>
          
          {!showForm && (
            <Button
              onClick={() => setShowForm(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white"
            >
              Create New Key
            </Button>
          )}
        </div>

        {error && (
          <Card className="bg-red-900/20 border-red-500 mb-8">
            <CardContent className="pt-6">
              <div className="text-red-400 text-center">{error}</div>
            </CardContent>
          </Card>
        )}

        {/* Create Key Form */}
        {showForm && (
          <div className="mb-8 flex justify-center">
            <KeyForm 
              onSuccess={handleFormSuccess}
              onCancel={handleFormCancel}
            />
          </div>
        )}

        {/* Keys Grid */}
        {keys.length === 0 && !showForm ? (
          <Card className="bg-gray-800/30 border-gray-700">
            <CardContent className="pt-6">
              <div className="text-center py-12">
                <div className="text-gray-400 text-lg mb-4">No API keys found</div>
                <p className="text-gray-500 mb-6">
                  Create your first API key to get started with the validation system
                </p>
                <Button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Create Your First Key
                </Button>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {keys.map((key) => (
              <KeyCard
                key={key.id}
                apiKey={key}
                onUpdate={fetchKeys}
              />
            ))}
          </div>
        )}

        {/* Stats Summary */}
        {keys.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-400 mb-1">
                    {keys.length}
                  </div>
                  <div className="text-sm text-gray-400">Total Keys</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-400 mb-1">
                    {keys.filter(k => k.status === 'active').length}
                  </div>
                  <div className="text-sm text-gray-400">Active Keys</div>
                </div>
              </CardContent>
            </Card>
            
            <Card className="bg-gray-800/30 border-gray-700">
              <CardContent className="pt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-400 mb-1">
                    {keys.reduce((sum, key) => sum + key.requestCount, 0).toLocaleString()}
                  </div>
                  <div className="text-sm text-gray-400">Total Requests</div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>
    </div>
  );
}