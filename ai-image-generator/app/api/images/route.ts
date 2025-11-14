import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);
    const user = getUserFromToken(token);

    if (!user) {
      return NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 }
      );
    }

    const images = db.getImagesByUserId(user.id);

    return NextResponse.json(
      {
        success: true,
        images,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Get images error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to retrieve images' },
      { status: 500 }
    );
  }
}
