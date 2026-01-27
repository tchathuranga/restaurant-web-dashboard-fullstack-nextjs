import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import gallery from '@/models/gallery';

// GET all in gallery
export async function GET(request: NextRequest) {
  try {
    await dbConnect();
    const galleryItems = await gallery.find().sort({ createdAt: -1 });
    return NextResponse.json(
      {
        success: true,
        data: galleryItems,
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
    const galleryItem = await gallery.create({
      image
    });
    return NextResponse.json(
      {
        success: true,  
        data: galleryItem,
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

