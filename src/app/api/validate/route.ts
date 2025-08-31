import { NextRequest, NextResponse } from 'next/server';
import { validateApiKey, logApiUsage } from '@/lib/keyManager';
import { checkRateLimit } from '@/lib/rateLimit';
import { ValidateKeySchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  try {
    const body = await request.json();
    const validatedData = ValidateKeySchema.parse(body);
    
    const { key, endpoint = '/api/validate' } = validatedData;
    
    // Get client info
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown';
    const userAgent = request.headers.get('user-agent');

    // Validate API key
    const validation = await validateApiKey(key);
    
    if (!validation.valid) {
      const responseTime = Date.now() - startTime;
      
      // Log failed validation
      if (validation.keyData) {
        await logApiUsage(
          validation.keyData.id,
          ip,
          endpoint,
          false,
          responseTime,
          userAgent || undefined
        );
      }

      return NextResponse.json({
        valid: false,
        error: 'Invalid or inactive API key'
      }, { status: 401 });
    }

    const keyData = validation.keyData!;

    // Check rate limit
    const rateLimit = checkRateLimit(
      keyData.id,
      keyData.rateLimit || 100,
      60000 // 1 minute window
    );

    const responseTime = Date.now() - startTime;

    // Log API usage
    await logApiUsage(
      keyData.id,
      ip,
      endpoint,
      rateLimit.allowed,
      responseTime,
      userAgent || undefined
    );

    if (!rateLimit.allowed) {
      return NextResponse.json({
        valid: false,
        error: 'Rate limit exceeded',
        resetTime: rateLimit.resetTime
      }, { status: 429 });
    }

    return NextResponse.json({
      valid: true,
      keyId: keyData.id,
      remaining: rateLimit.remaining,
      resetTime: rateLimit.resetTime,
      message: 'API key is valid'
    });

  } catch (error) {
    console.error('Validation error:', error);
    return NextResponse.json({
      valid: false,
      error: 'Invalid request data'
    }, { status: 400 });
  }
}