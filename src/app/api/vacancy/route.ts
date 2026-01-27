import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/mongodb';
import Vacancy from '@/models/vacancy';

// GET all vacancies
export async function GET(request: NextRequest) {
  try {
    await dbConnect();

    const vacancies = await Vacancy.find().sort({ createdAt: -1 });

    return NextResponse.json(
      {
        success: true,
        data: vacancies,
      },
      { status: 200 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to fetch vacancies',
      },
      { status: 500 }
    );
  } 
}

// POST create a new vacancy
export async function POST(request: NextRequest) {
  try {
    await dbConnect(); 
    const body = await request.json();
    const { title, location, type, description } = body;
    // Validation
    if (!title || !location || !type) {
      return NextResponse.json(
        {
          success: false,
          error: 'Please provide all required fields',
        },
        { status: 400 }
      );
    }
    const vacancy = await Vacancy.create({
      title,
      location,
      type,
      description
    });

    return NextResponse.json(
      {
        success: true,
        data: vacancy,
      },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || 'Failed to create vacancy',
      },
      { status: 500 }
    );
  }
}