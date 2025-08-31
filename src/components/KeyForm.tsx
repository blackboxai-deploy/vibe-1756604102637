'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface KeyFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

export default function KeyForm({ onSuccess, onCancel }: KeyFormProps) {
  const [formData, setFormData] = useState({
    name: '',
    description: ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/keys', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (data.success) {
        onSuccess();
      } else {
        setError(data.error || 'Failed to create API key');
      }
    } catch (error) {
      console.error('Create key error:', error);
      setError('Network error. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  return (
    <Card className="w-full max-w-md bg-gray-800/50 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white">Create New API Key</CardTitle>
        <CardDescription className="text-gray-400">
          Generate a new API key for your application
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert className="bg-red-900/20 border-red-500 text-red-400">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-300">Name *</Label>
            <Input
              id="name"
              name="name"
              type="text"
              value={formData.name}
              onChange={handleChange}
              required
              maxLength={50}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500"
              placeholder="e.g., Production API, Mobile App"
              disabled={isLoading}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description" className="text-gray-300">Description</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              maxLength={200}
              rows={3}
              className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 focus:border-blue-500 resize-none"
              placeholder="Optional description for this API key"
              disabled={isLoading}
            />
          </div>
          
          <div className="flex space-x-2 pt-4">
            <Button
              type="submit"
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? 'Creating...' : 'Create API Key'}
            </Button>
            
            <Button
              type="button"
              onClick={onCancel}
              variant="outline"
              className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-700"
              disabled={isLoading}
            >
              Cancel
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}