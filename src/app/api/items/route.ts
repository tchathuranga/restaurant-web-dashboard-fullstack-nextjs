import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Item from '@/models/Item';

// GET all items or filter by category
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const searchParams = request.nextUrl.searchParams;
    const category = searchParams.get('category');

    let query = {};
    if (category && category !== 'All') {
      query = { category };
    }

    const items = await Item.find(query).sort({ createdAt: -1 });

    // Group items by category
    const groupedData = items.reduce((acc: any, item: any) => {
      const categoryName = item.category;
      const existingCategory = acc.find((cat: any) => cat.Category === categoryName);
      
      if (existingCategory) {
        existingCategory.data.push(item);
      } else {
        acc.push({
          Category: categoryName,
          data: [item],
        });
      }
      
      return acc;
    }, []);

    // Define the desired category order
    const categoryOrder = [
      'Cafe Items',
      'North Indian',
      'South Indian',
      'Cakes',
      'Ice Cream',
      'Chaat Items',
      'Juices',
      'Sweets',
    ];

    // Sort grouped data by the defined order
    const sortedData = groupedData.sort((a: any, b: any) => {
      const indexA = categoryOrder.indexOf(a.Category);
      const indexB = categoryOrder.indexOf(b.Category);
      return indexA - indexB;
    });

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
    await dbConnect();

    const body = await request.json();
    const { image, title, description, price, imageAlt, category } = body;

    // Validation
    if (!image || !title ||  !category) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }

    const item = await Item.create({
      image,
      title,
      description,
      price,
      imageAlt,
      category,
    });

    return NextResponse.json(
      {
        success: true,
        data: item,
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
