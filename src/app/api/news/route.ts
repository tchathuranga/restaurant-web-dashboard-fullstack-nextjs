import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import News from '@/models/news';

// GET all news
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const news = await News.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: news,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch news',
      },
      { status: 500 }
    );
  }
}

// POST create a new news item
export async function POST(request: NextRequest) { {
  try {
    await dbConnect();
    const body = await request.json();
    const { title, description, image } = body;
    // Validation
    if (!title || !description || !image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }
    const newsItem = await News.create({
      title,
      description,
      image
    });
    return NextResponse.json(
      {
        success: true,
        data: newsItem,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create news item',
      },
      { status: 500 }
    );
  }
}
}

