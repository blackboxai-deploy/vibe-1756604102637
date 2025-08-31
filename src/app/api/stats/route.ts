import { NextRequest, NextResponse } from 'next/server';
import { validateSession } from '@/lib/auth';
import { getStats, getUsageChart } from '@/lib/stats';

// Helper function to check authentication
function checkAuth(request: NextRequest) {
  const sessionToken = request.cookies.get('session')?.value;
  return sessionToken ? validateSession(sessionToken) : false;
}

export async function GET(request: NextRequest) {
  try {
    if (!checkAuth(request)) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const stats = await getStats();
    const usageChart = await getUsageChart();

    return NextResponse.json({
      success: true,
      data: {
        stats,
        usageChart
      }
    });

  } catch (error) {
    console.error('Stats error:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch statistics' },
      { status: 500 }
    );
  }
}