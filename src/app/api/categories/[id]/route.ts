import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/server/prisma';
import { errorMessage, isNotFound } from '@/server/http';
import { CATEGORY_MAX, cleanName, isDuplicate } from '@/server/menuCategories';

type Context = { params: Promise<{ id: string }> };

// PUT rename a category; the dishes in it move with the new name
export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const { name, error } = cleanName((await request.json()).name, CATEGORY_MAX);
    if (!name) return NextResponse.json({ success: false, error }, { status: 400 });

    const existing = await prisma.menuCategory.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });

    await prisma.$transaction([
      prisma.menuCategory.update({ where: { id }, data: { name } }),
      prisma.item.updateMany({ where: { category: existing.name }, data: { category: name } }),
    ]);
    return NextResponse.json({ success: true, data: { _id: id, name } });
  } catch (error) {
    if (isDuplicate(error)) {
      return NextResponse.json({ success: false, error: 'A category with this name already exists' }, { status: 409 });
    }
    if (isNotFound(error)) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: false, error: errorMessage(error, 'Failed to update category') }, { status: 500 });
  }
}

// DELETE a category (and its subcategories); refused while dishes still use it
export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const existing = await prisma.menuCategory.findUnique({ where: { id } });
    if (!existing) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });

    const inUse = await prisma.item.count({ where: { category: existing.name } });
    if (inUse > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `"${existing.name}" still has ${inUse} dish${inUse === 1 ? '' : 'es'}. Move or delete them first`,
        },
        { status: 409 }
      );
    }

    await prisma.menuCategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error) {
    if (isNotFound(error)) return NextResponse.json({ success: false, error: 'Category not found' }, { status: 404 });
    return NextResponse.json({ success: false, error: errorMessage(error, 'Failed to delete category') }, { status: 500 });
  }
}
