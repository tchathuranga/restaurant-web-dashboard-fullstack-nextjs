import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';

// GET all news
export async function GET(request: NextRequest) {
  try {
    const news = await prisma.news.findMany({ orderBy: { createdAt: 'desc' } });

    return NextResponse.json(
      { success: true, data: news.map(withLegacyId) },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch news' },
      { status: 500 }
    );
  }
}

// POST create a new news item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, description, image } = body;
    // Validation
    if (!title || !description || !image) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    const newsItem = await prisma.news.create({ data: { title, description, image } });
    return NextResponse.json(
      { success: true, data: withLegacyId(newsItem) },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create news item' },
      { status: 500 }
    );
  }
}
