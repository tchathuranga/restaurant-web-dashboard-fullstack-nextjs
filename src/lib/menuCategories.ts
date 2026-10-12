import { prisma } from '@/lib/prisma';
import { ITEM_CATEGORIES } from '@/component/const/itemCategories';
import { SUBCATEGORY_ORDER } from '@/component/const/itemSubcategories';

export const CATEGORY_MAX = 50;
export const SUBCATEGORY_MAX = 100;

// Shape sent to the dashboard: categories in display order, each with its subcategories in order
export async function listCategories() {
  const rows = await prisma.menuCategory.findMany({
    orderBy: { order: 'asc' },
    include: { subcategories: { orderBy: { order: 'asc' } } },
  });
  return rows.map((c) => ({
    _id: c.id,
    name: c.name,
    order: c.order,
    subcategories: c.subcategories.map((s) => ({ _id: s.id, name: s.name, order: s.order })),
  }));
}

// First use: copy the built-in categories into the database so they can be edited
export async function ensureCategoriesSeeded() {
  if ((await prisma.menuCategory.count()) > 0) return;

  await prisma.menuCategory.createMany({
    data: ITEM_CATEGORIES.map((name, order) => ({ name, order })),
    skipDuplicates: true,
  });
  const created = await prisma.menuCategory.findMany();
  const subs = created.flatMap((c) =>
    (SUBCATEGORY_ORDER[c.name] || []).map((name, order) => ({ categoryId: c.id, name, order }))
  );
  if (subs.length > 0) await prisma.menuSubcategory.createMany({ data: subs, skipDuplicates: true });
}

export function cleanName(value: unknown, max: number): { name?: string; error?: string } {
  const name = typeof value === 'string' ? value.trim().replace(/\s+/g, ' ') : '';
  if (!name) return { error: 'Please enter a name' };
  if (name.length > max) return { error: `Name cannot be more than ${max} characters` };
  return { name };
}

// Prisma P2002: unique constraint violated
export const isDuplicate = (error: unknown) => (error as { code?: string })?.code === 'P2002';
