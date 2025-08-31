import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { getApiKeyById, updateApiKeyById, deleteApiKeyById, isKeyNameExists } from '@/lib/keyManager';
import { UpdateApiKeySchema } from '@/lib/validators';

// Helper function to check authentication
function checkAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  return sessionToken ? validateSession(sessionToken) : false;
}

// GET /api/keys/[id] - Get single API key
export async function GET(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const key = await getApiKeyById(params.id);
    
    if (!key) {
      return NextResponse.json(
        { success: false, error: 'Key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: key
    });

  } catch (error) {
    console.error('Get key error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch key' },
      { status: 500 }
    );
  }
}

// PUT /api/keys/[id] - Update API key
export async function PUT(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = UpdateApiKeySchema.parse(body);

    // Check if key exists
    const existingKey = await getApiKeyById(params.id);
    if (!existingKey) {
      return NextResponse.json(
        { success: false, error: 'Key not found' },
        { status: 404 }
      );
    }

    // Check if name already exists (if updating name)
    if (validatedData.name && validatedData.name !== existingKey.name) {
      const nameExists = await isKeyNameExists(validatedData.name, params.id);
      if (nameExists) {
        return NextResponse.json(
          { success: false, error: 'Key name already exists' },
          { status: 400 }
        );
      }
    }

    const success = await updateApiKeyById(params.id, validatedData);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to update key' },
        { status: 500 }
      );
    }

    const updatedKey = await getApiKeyById(params.id);

    return NextResponse.json({
      success: true,
      data: updatedKey,
      message: 'Key updated successfully'
    });

  } catch (error) {
    console.error('Update key error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update key' },
      { status: 500 }
    );
  }
}

// DELETE /api/keys/[id] - Delete API key
export async function DELETE(
  request: NextRequest,
  props: { params: Promise<{ id: string }> }
) {
  const params = await props.params;
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const success = await deleteApiKeyById(params.id);
    
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Key not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Key deleted successfully'
    });

  } catch (error) {
    console.error('Delete key error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete key' },
      { status: 500 }
    );
  }
}