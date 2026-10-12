import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';
import { getSubcategory } from '@/component/const/itemSubcategories';
import { ensureCategoriesSeeded } from '@/lib/menuCategories';

// GET all items or filter by category
export async function GET(request: NextRequest) {
  try {
    await ensureCategoriesSeeded();
    const category = request.nextUrl.searchParams.get('category');

    const rows = await prisma.item.findMany({
      where: category && category !== 'All' ? { category } : {},
      orderBy: { createdAt: 'desc' },
    });

    const items = rows.map((row) => {
      const plain = withLegacyId(row) as any;
      // Older items have no stored subcategory; derive it the same way the website does
      plain.subcategory = plain.subcategory || getSubcategory(plain.title, plain.category);
      return plain;
    });

    // Group items by category
    const groupedData = items.reduce((acc: any, item: any) => {
      const existingCategory = acc.find((cat: any) => cat.Category === item.category);

      if (existingCategory) {
        existingCategory.data.push(item);
      } else {
        acc.push({
          Category: item.category,
          data: [item],
        });
      }

      return acc;
    }, []);

    // Sort grouped data by the order set in the category manager (unknown names go last)
    const categories = await prisma.menuCategory.findMany({ orderBy: { order: 'asc' } });
    const rank = (name: string) => {
      const index = categories.findIndex((c) => c.name === name);
      return index === -1 ? categories.length : index;
    };
    const sortedData = groupedData.sort((a: any, b: any) => rank(a.Category) - rank(b.Category));

    return NextResponse.json(
      {
        success: true,
        data: sortedData,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch items',
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
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create item',
      },
      { status: 500 }
    );
  }
}
