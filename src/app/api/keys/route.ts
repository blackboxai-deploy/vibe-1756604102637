import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { createApiKey, getAllApiKeys, isKeyNameExists } from '@/lib/keyManager';
import { ApiKeySchema } from '@/lib/validators';

// Helper function to check authentication
function checkAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  return sessionToken ? validateSession(sessionToken) : false;
}

// GET /api/keys - Get all API keys
export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const keys = await getAllApiKeys();
    return NextResponse.json({
      success: true,
      data: keys
    });

  } catch (error) {
    console.error('Get keys error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch keys' },
      { status: 500 }
    );
  }
}

// POST /api/keys - Create new API key
export async function POST(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = ApiKeySchema.parse(body);

    // Check if name already exists
    const nameExists = await isKeyNameExists(validatedData.name);
    if (nameExists) {
      return NextResponse.json(
        { success: false, error: 'Key name already exists' },
        { status: 400 }
      );
    }

    const newKey = await createApiKey(
      validatedData.name,
      validatedData.description || ''
    );

    return NextResponse.json({
      success: true,
      data: newKey,
      message: 'API key created successfully'
    }, { status: 201 });

  } catch (error) {
    console.error('Create key error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create key' },
      { status: 500 }
    );
  }
}