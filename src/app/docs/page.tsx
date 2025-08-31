'use client';

import { useState } from 'react';
import Navigation from '@/components/Navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';

export default function DocsPage() {
  const [testKey, setTestKey] = useState('');
  const [testResult, setTestResult] = useState<any>(null);
  const [isTestingKey, setIsTestingKey] = useState(false);

  const testApiKey = async () => {
    if (!testKey.trim()) {
      setTestResult({ error: 'Please enter an API key to test' });
      return;
    }

    setIsTestingKey(true);
    try {
      const response = await fetch('/api/validate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          key: testKey.trim(),
          endpoint: '/api/test'
        }),
      });

      const data = await response.json();
      setTestResult({
        status: response.status,
        data
      });
    } catch (error) {
      setTestResult({
        error: 'Network error. Please try again.'
      });
    } finally {
      setIsTestingKey(false);
    }
  };

  const codeExamples = {
    curl: `curl -X POST http://localhost:3000/api/validate \\
  -H "Content-Type: application/json" \\
  -d '{
    "key": "ak_your_api_key_here",
    "endpoint": "/api/your-endpoint"
  }'`,

    javascript: `const response = await fetch('/api/validate', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    key: 'ak_your_api_key_here',
    endpoint: '/api/your-endpoint'
  }),
});

const result = await response.json();

if (result.valid) {
  console.log('API key is valid');
  console.log('Remaining requests:', result.remaining);
} else {
  console.error('Invalid API key:', result.error);
}`,

    python: `import requests

url = 'http://localhost:3000/api/validate'
headers = {'Content-Type': 'application/json'}
data = {
    'key': 'ak_your_api_key_here',
    'endpoint': '/api/your-endpoint'
}

response = requests.post(url, headers=headers, json=data)
result = response.json()

if result['valid']:
    print('API key is valid')
    print(f'Remaining requests: {result["remaining"]}')
else:
    print(f'Invalid API key: {result["error"]}')`
  };

  return (
    <div>
      <Navigation currentPage="docs" />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">API Documentation</h1>
          <p className="text-gray-400">Complete guide to using the API Key validation system</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Overview */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Overview</CardTitle>
                <CardDescription className="text-gray-400">
                  How to integrate and use our API key validation system
                </CardDescription>
              </CardHeader>
              <CardContent className="text-gray-300 space-y-4">
                <p>
                  The API Key validation system allows you to secure your applications by validating API keys 
                  before processing requests. Each key includes rate limiting and usage tracking.
                </p>
                <div className="bg-gray-900/50 border border-gray-600 rounded-lg p-4">
                  <h4 className="font-semibold text-white mb-2">Key Features:</h4>
                  <ul className="space-y-1 text-sm">
                    <li>• Real-time key validation</li>
                    <li>• Built-in rate limiting (100 requests/minute default)</li>
                    <li>• Usage tracking and analytics</li>
                    <li>• Easy integration with any application</li>
                  </ul>
                </div>
              </CardContent>
            </Card>

            {/* Endpoints */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Endpoints</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Validate Endpoint */}
                <div className="border border-gray-600 rounded-lg p-4 bg-gray-900/30">
                  <div className="flex items-center gap-3 mb-3">
                    <Badge className="bg-green-600 text-white">POST</Badge>
                    <code className="text-blue-400 font-mono">/api/validate</code>
                  </div>
                  
                  <p className="text-gray-300 mb-4">Validate an API key and check rate limits</p>
                  
                  <div className="space-y-3">
                    <div>
                      <h5 className="font-semibold text-white mb-2">Request Body:</h5>
                      <pre className="bg-gray-900 border border-gray-600 rounded p-3 text-sm overflow-x-auto">
{`{
  "key": "ak_1234567890abcdef1234567890abcdef",
  "endpoint": "/api/your-endpoint" // optional
}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-white mb-2">Success Response (200):</h5>
                      <pre className="bg-gray-900 border border-gray-600 rounded p-3 text-sm overflow-x-auto">
{`{
  "valid": true,
  "keyId": "key_id_here",
  "remaining": 99,
  "resetTime": 1640995200000,
  "message": "API key is valid"
}`}
                      </pre>
                    </div>
                    
                    <div>
                      <h5 className="font-semibold text-white mb-2">Error Responses:</h5>
                      <div className="space-y-2 text-sm">
                        <div>
                          <Badge variant="outline" className="border-red-500 text-red-400 mb-2">401</Badge>
                          <pre className="bg-gray-900 border border-gray-600 rounded p-2 text-xs">
{`{
  "valid": false,
  "error": "Invalid or inactive API key"
}`}
                          </pre>
                        </div>
                        
                        <div>
                          <Badge variant="outline" className="border-yellow-500 text-yellow-400 mb-2">429</Badge>
                          <pre className="bg-gray-900 border border-gray-600 rounded p-2 text-xs">
{`{
  "valid": false,
  "error": "Rate limit exceeded",
  "resetTime": 1640995200000
}`}
                          </pre>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Code Examples */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Code Examples</CardTitle>
                <CardDescription className="text-gray-400">
                  Integration examples in different programming languages
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="curl" className="w-full">
                  <TabsList className="grid w-full grid-cols-3 bg-gray-700/50">
                    <TabsTrigger value="curl" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">cURL</TabsTrigger>
                    <TabsTrigger value="javascript" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">JavaScript</TabsTrigger>
                    <TabsTrigger value="python" className="text-gray-300 data-[state=active]:bg-blue-600 data-[state=active]:text-white">Python</TabsTrigger>
                  </TabsList>
                  
                  {Object.entries(codeExamples).map(([lang, code]) => (
                    <TabsContent key={lang} value={lang} className="mt-4">
                      <pre className="bg-gray-900 border border-gray-600 rounded-lg p-4 overflow-x-auto text-sm">
                        <code className="text-gray-300">{code}</code>
                      </pre>
                    </TabsContent>
                  ))}
                </Tabs>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* API Key Tester */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Test API Key</CardTitle>
                <CardDescription className="text-gray-400">
                  Test your API key validation
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="testKey" className="text-gray-300">API Key</Label>
                  <Input
                    id="testKey"
                    value={testKey}
                    onChange={(e) => setTestKey(e.target.value)}
                    placeholder="ak_your_api_key_here"
                    className="bg-gray-700/50 border-gray-600 text-white placeholder:text-gray-400 font-mono text-sm"
                  />
                </div>
                
                <Button
                  onClick={testApiKey}
                  disabled={isTestingKey}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                >
                  {isTestingKey ? 'Testing...' : 'Test Key'}
                </Button>

                {testResult && (
                  <div className="mt-4">
                    {testResult.error ? (
                      <Alert className="bg-red-900/20 border-red-500 text-red-400">
                        <AlertDescription>{testResult.error}</AlertDescription>
                      </Alert>
                    ) : (
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Badge 
                            className={testResult.status === 200 ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
                          >
                            {testResult.status}
                          </Badge>
                          <span className="text-white font-medium">
                            {testResult.data.valid ? 'Valid' : 'Invalid'}
                          </span>
                        </div>
                        
                        <pre className="bg-gray-900 border border-gray-600 rounded p-3 text-xs overflow-x-auto">
                          <code className="text-gray-300">
                            {JSON.stringify(testResult.data, null, 2)}
                          </code>
                        </pre>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Quick Reference */}
            <Card className="bg-gray-800/30 border-gray-700">
              <CardHeader>
                <CardTitle className="text-white">Quick Reference</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <h5 className="font-semibold text-white mb-2">Base URL</h5>
                  <code className="bg-gray-900/50 border border-gray-600 rounded px-2 py-1 text-blue-400">
                    http://localhost:3000
                  </code>
                </div>
                
                <div>
                  <h5 className="font-semibold text-white mb-2">Content-Type</h5>
                  <code className="bg-gray-900/50 border border-gray-600 rounded px-2 py-1 text-gray-300">
                    application/json
                  </code>
                </div>
                
                <div>
                  <h5 className="font-semibold text-white mb-2">Rate Limit</h5>
                  <span className="text-gray-300">100 requests per minute</span>
                </div>

                <div>
                  <h5 className="font-semibold text-white mb-2">Key Format</h5>
                  <code className="bg-gray-900/50 border border-gray-600 rounded px-2 py-1 text-gray-300">
                    ak_[32-character-hex]
                  </code>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}