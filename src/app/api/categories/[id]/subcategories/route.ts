import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { SUBCATEGORY_MAX, cleanName, isDuplicate } from '@/lib/menuCategories';

// POST add a subcategory to a category
export async function POST(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const { name, error } = cleanName((await request.json()).name, SUBCATEGORY_MAX);
    if (!name) return NextResponse.json({ success: false, error }, { status: 400 });

    const category = await prisma.menuCategory.findUnique({ where: { id } });
    if (!category) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });

    const last = await prisma.menuSubcategory.aggregate({ where: { categoryId: id }, _max: { order: true } });
    const created = await prisma.menuSubcategory.create({
      data: { categoryId: id, name, order: (last._max.order ?? -1) + 1 },
    });
    return NextResponse.json({ success: true, data: { _id: created.id, name: created.name } }, { status: 201 });
  } catch (error: any) {
    if (isDuplicate(error)) {
      return NextResponse.json(
        { success: false, error: 'This category already has a subcategory with that name' },
        { status: 409 }
      );
    }
    return NextResponse.json({ success: false, error: error.message || 'Failed to create subcategory' }, { status: 500 });
  }
}
