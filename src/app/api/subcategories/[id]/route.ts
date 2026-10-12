import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { isNotFound } from '@/lib/apiErrors';
import { SUBCATEGORY_MAX, cleanName, isDuplicate } from '@/lib/menuCategories';

type Context = { params: Promise<{ id: string }> };

const findWithCategory = (id: string) =>
  prisma.menuSubcategory.findUnique({ where: { id }, include: { category: true } });

// PUT rename a subcategory; the dishes in it move with the new name
export async function PUT(request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const { name, error } = cleanName((await request.json()).name, SUBCATEGORY_MAX);
    if (!name) return NextResponse.json({ success: false, error }, { status: 400 });

    const existing = await findWithCategory(id);
    if (!existing) return NextResponse.json({ success: false, error: 'Subcategory not found' }, { status: 404 });

    await prisma.$transaction([
      prisma.menuSubcategory.update({ where: { id }, data: { name } }),
      prisma.item.updateMany({
        where: { category: existing.category.name, subcategory: existing.name },
        data: { subcategory: name },
      }),
    ]);
    return NextResponse.json({ success: true, data: { _id: id, name } });
  } catch (error: any) {
    if (isDuplicate(error)) {
      return NextResponse.json(
        { success: false, error: 'This category already has a subcategory with that name' },
        { status: 409 }
      );
    }
    if (isNotFound(error)) return NextResponse.json({ success: false, error: 'Subcategory not found' }, { status: 404 });
    return NextResponse.json({ success: false, error: error.message || 'Failed to update subcategory' }, { status: 500 });
  }
}

// DELETE a subcategory; refused while dishes still use it
export async function DELETE(_request: NextRequest, context: Context) {
  try {
    const { id } = await context.params;
    const existing = await findWithCategory(id);
    if (!existing) return NextResponse.json({ success: false, error: 'Subcategory not found' }, { status: 404 });

    const inUse = await prisma.item.count({
      where: { category: existing.category.name, subcategory: existing.name },
    });
    if (inUse > 0) {
      return NextResponse.json(
        {
          success: false,
          error: `"${existing.name}" still has ${inUse} dish${inUse === 1 ? '' : 'es'}. Move or delete them first`,
        },
        { status: 409 }
      );
    }

    await prisma.menuSubcategory.delete({ where: { id } });
    return NextResponse.json({ success: true });
  } catch (error: any) {
    if (isNotFound(error)) return NextResponse.json({ success: false, error: 'Subcategory not found' }, { status: 404 });
    return NextResponse.json({ success: false, error: error.message || 'Failed to delete subcategory' }, { status: 500 });
  }
}
