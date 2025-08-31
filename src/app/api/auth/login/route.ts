import { NextRequest, NextResponse } from 'next/server';
import { validateAdminCredentials, createSession } from '@/lib/auth';
import { LoginSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = LoginSchema.parse(body);

    const isValid = await validateAdminCredentials(
      validatedData.username,
      validatedData.password
    );

    if (!isValid) {
      return NextResponse.json(
        { success: false, error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const sessionToken = createSession('admin');

    const response = NextResponse.json({
      success: true,
      message: 'Login successful'
    });

    // Set session cookie
    response.cookies.set('session', sessionToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'lax',
      maxAge: 24 * 60 * 60 // 24 hours
    });

    return response;

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, error: 'Invalid request data' },
      { status: 400 }
    );
  }
}