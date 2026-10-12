import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';

// GET all promotions
export async function GET(request: NextRequest) {
  try {
    const rows = await prisma.promotion.findMany({ orderBy: { createdAt: 'desc' } });
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
        error: error.message || 'Failed to fetch promotions',
      },
      { status: 500 }
    );
  }
}

// POST create a new promotion
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
    const created = await prisma.promotion.create({ data: { image } });
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
        error: error.message || 'Failed to create promotion',
      },
      { status: 500 }
    );
  }
}
