import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';
import { Types } from 'mongoose';


// GET single item by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid item ID',
        },
        { status: 400 }
      );
    }

    const item = await Item.findById(id);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: item,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch item',
      },
      { status: 500 }
    );
  }
}

// PUT update item
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;
    const body = await request.json();

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid item ID',
        },
        { status: 400 }
      );
    }

    const item = await Item.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: item,
        message: 'Item updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to update item',
      },
      { status: 500 }
    );
  }
}

// DELETE item
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    await dbConnect();

    const { id } = await context.params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: 'Invalid item ID',
        },
        { status: 400 }
      );
    }

    const item = await Item.findByIdAndDelete(id);

    if (!item) {
      return NextResponse.json(
        {
          success: false,
          error: 'Item not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: item,
        message: 'Item deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete item',
      },
      { status: 500 }
    );
  }
}
