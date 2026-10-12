import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';

// GET all gallery items
export async function GET(request: NextRequest) {
  try {
    const rows = await prisma.gallery.findMany({ orderBy: { createdAt: 'desc' } });
    return NextResponse.json(
      {
        success: true,
        data: rows.map(withLegacyId),
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch gallery items',
      },
      { status: 500 }
    );
  }
}

// POST create a new gallery item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image } = body;
    // Validation
    if (!image) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }
    const created = await prisma.gallery.create({ data: { image } });
    return NextResponse.json(
      {
        success: true,
        data: withLegacyId(created),
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create gallery item',
      },
      { status: 500 }
    );
  }
}
