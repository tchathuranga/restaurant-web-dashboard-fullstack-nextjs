import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';
import { isNotFound } from '@/lib/apiErrors';
import { ensureCategoriesSeeded } from '@/lib/menuCategories';
import { getSubcategory } from '@/component/const/itemSubcategories';

// GET single item by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const item = await prisma.item.findUnique({ where: { id } });

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
        data: withLegacyId(item),
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
    const { id } = await context.params;
    const body = await request.json();

    // Keep subcategory in step with title/category when the form doesn't supply one
    if (!body.subcategory && body.title && body.category) {
      body.subcategory = getSubcategory(body.title, body.category);
    }

    await ensureCategoriesSeeded();
    if (
      body.category !== undefined &&
      !(await prisma.menuCategory.findUnique({ where: { name: String(body.category) } }))
    ) {
      return NextResponse.json({ success: false, error: 'Please select a valid category' }, { status: 400 });
    }
    if (body.title !== undefined && (!body.title || String(body.title).length > 100)) {
      return NextResponse.json(
        { success: false, error: 'Title is required and cannot be more than 100 characters' },
        { status: 400 }
      );
    }

    const { image, title, description, price, imageAlt, category, subcategory } = body;
    const item = await prisma.item.update({
      where: { id },
      data: { image, title, description, price, imageAlt, category, subcategory },
    });

    return NextResponse.json(
      {
        success: true,
        data: withLegacyId(item),
        message: 'Item updated successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
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
    const { id } = await context.params;

    const item = await prisma.item.delete({ where: { id } });

    return NextResponse.json(
      {
        success: true,
        data: withLegacyId(item),
        message: 'Item deleted successfully',
      },
      { status: 200 }
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json({ success: false, error: 'Item not found' }, { status: 404 });
    }
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to delete item',
      },
      { status: 500 }
    );
  }
}
