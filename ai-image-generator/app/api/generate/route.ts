import { NextRequest, NextResponse } from 'next/server';
import { getUserFromToken } from '@/lib/auth';
import { db, GeneratedImage } from '@/lib/db';
import { generateImage } from '@/lib/nanobanana';

export async function POST(request: NextRequest) {
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

    const { prompt } = await request.json();

    if (!prompt || typeof prompt !== 'string' || prompt.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: 'Valid prompt is required' },
        { status: 400 }
      );
    }

    // Check if user has enough credits
    if (user.credits < 1) {
      return NextResponse.json(
        { success: false, message: 'Insufficient credits' },
        { status: 403 }
      );
    }

    // Generate image using Nanobanana AI
    const imageUrl = await generateImage(prompt);

    // Deduct credit
    db.updateUserCredits(user.id, user.credits - 1);

    // Save generated image
    const generatedImage: GeneratedImage = {
      id: crypto.randomUUID(),
      userId: user.id,
      prompt,
      imageUrl,
      createdAt: new Date(),
    };

    db.createImage(generatedImage);

    // Get updated user credits
    const updatedUser = db.findUserById(user.id);
    const remainingCredits = updatedUser?.credits || 0;

    return NextResponse.json(
      {
        success: true,
        message: 'Image generated successfully',
        image: generatedImage,
        remainingCredits,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Generate error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to generate image' },
      { status: 500 }
    );
  }
}
