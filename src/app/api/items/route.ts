import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/server/http';
import { prisma, withLegacyId } from '@/server/prisma';
import { getSubcategory } from '@/constants/itemSubcategories';
import { ensureCategoriesSeeded } from '@/server/menuCategories';

// GET all items or filter by category
export async function GET(request: NextRequest) {
  try {
    await ensureCategoriesSeeded();
    const category = request.nextUrl.searchParams.get('category');

    const rows = await prisma.item.findMany({
      where: category && category !== 'All' ? { category } : {},
      orderBy: { createdAt: 'desc' },
    });

    // Older items have no stored subcategory; derive it the same way the website does
    const items = rows.map((row) => ({
      ...withLegacyId(row),
      subcategory: row.subcategory || getSubcategory(row.title, row.category),
    }));

    // Group items by category
    const grouped = new Map<string, typeof items>();
    for (const item of items) {
      const group = grouped.get(item.category);
      if (group) group.push(item);
      else grouped.set(item.category, [item]);
    }

    // Sort grouped data by the order set in the category manager (unknown names go last)
    const categories = await prisma.menuCategory.findMany({ orderBy: { order: 'asc' } });
    const rank = (name: string) => {
      const index = categories.findIndex((c) => c.name === name);
      return index === -1 ? categories.length : index;
    };
    const sortedData = [...grouped.entries()]
      .map(([Category, data]) => ({ Category, data }))
      .sort((a, b) => rank(a.Category) - rank(b.Category));

    return NextResponse.json(
      {
        success: true,
        data: sortedData,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: errorMessage(error, 'Failed to fetch items'),
      },
      { status: 500 }
    );
  }
}

// POST create a new item
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { image, title, description, price, imageAlt, category, subcategory } = body;

    // Validation
    if (!image || !title || !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }
    await ensureCategoriesSeeded();
    if (!(await prisma.menuCategory.findUnique({ where: { name: String(category) } }))) {
      return NextResponse.json({ success: false, error: 'Please select a valid category' }, { status: 400 });
    }
    if (String(title).length > 100) {
      return NextResponse.json(
        { success: false, error: 'Title cannot be more than 100 characters' },
        { status: 400 }
      );
    }

    const item = await prisma.item.create({
      data: {
        image,
        title,
        description,
        price,
        imageAlt,
        category,
        subcategory: subcategory || getSubcategory(title, category),
      },
    });

    return NextResponse.json(
      {
        success: true,
        data: withLegacyId(item),
        message: 'Item created successfully',
      },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      {
        success: false,
        error: errorMessage(error, 'Failed to create item'),
      },
      { status: 500 }
    );
  }
}
