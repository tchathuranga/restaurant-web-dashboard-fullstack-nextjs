import { NextRequest, NextResponse } from 'next/server';
import { errorMessage } from '@/server/http';
import { prisma, withLegacyId } from '@/server/prisma';

// GET all vacancies
export async function GET() {
  try {
    const vacancies = await prisma.vacancy.findMany({ orderBy: { createdAt: 'desc' } });

    return NextResponse.json(
      { success: true, data: vacancies.map(withLegacyId) },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: errorMessage(error, 'Failed to fetch vacancies') },
      { status: 500 }
    );
  }
}

// POST create a new vacancy
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { title, location, type, description } = body;
    // Validation (description is required by the model, so the database would reject an empty one anyway)
    if (!title || !location || !type || !description) {
      return NextResponse.json(
        { success: false, error: 'Please provide all required fields' },
        { status: 400 }
      );
    }
    const vacancy = await prisma.vacancy.create({
      data: { title, location, type, description },
    });

    return NextResponse.json(
      { success: true, data: withLegacyId(vacancy) },
      { status: 201 }
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: errorMessage(error, 'Failed to create vacancy') },
      { status: 500 }
    );
  }
}
