import { NextRequest, NextResponse } from 'next/server';
import { destroySession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session')?.value;

    if (sessionToken) {
      destroySession(sessionToken);
    }

    const response = NextResponse.json({
      success: true,
      message: 'Logout successful'
    });

    // Clear session cookie
    response.cookies.delete('session');

    return response;

  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { success: false, error: 'Logout failed' },
      { status: 500 }
    );
  }
}