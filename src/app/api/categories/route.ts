import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { CATEGORY_MAX, cleanName, ensureCategoriesSeeded, isDuplicate, listCategories } from '@/lib/menuCategories';

// GET all categories with their subcategories
export async function GET() {
  try {
    await ensureCategoriesSeeded();
    return NextResponse.json({ success: true, data: await listCategories() });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message || 'Failed to fetch categories' }, { status: 500 });
  }
}

// POST create a category
export async function POST(request: NextRequest) {
  try {
    const { name, error } = cleanName((await request.json()).name, CATEGORY_MAX);
    if (!name) return NextResponse.json({ success: false, error }, { status: 400 });

    await ensureCategoriesSeeded();
    const last = await prisma.menuCategory.aggregate({ _max: { order: true } });
    const created = await prisma.menuCategory.create({
      data: { name, order: (last._max.order ?? -1) + 1 },
    });
    return NextResponse.json({ success: true, data: { _id: created.id, name: created.name } }, { status: 201 });
  } catch (error: any) {
    if (isDuplicate(error)) {
      return NextResponse.json({ success: false, error: 'A category with this name already exists' }, { status: 409 });
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to create category' }, { status: 500 });
  }
}
