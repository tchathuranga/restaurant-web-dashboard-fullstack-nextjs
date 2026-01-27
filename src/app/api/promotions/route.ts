import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import promotions from '@/models/promotions';

// GET all promotions
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const promotionItems = await promotions.find().sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: promotionItems,
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
    await dbConnect();
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
    const promotionItem = await promotions.create({
      image
    });
    return NextResponse.json(
      {
        success: true,
        data: promotionItem,
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