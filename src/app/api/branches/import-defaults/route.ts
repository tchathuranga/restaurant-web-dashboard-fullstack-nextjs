import { NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';
import { DEFAULT_BRANCHES } from '@/component/const/defaultBranches';

// POST copy the website's built-in branches into the database so they can be edited.
// Refuses when branches already exist so nothing is duplicated or overwritten.
export async function POST() {
  try {
    if ((await prisma.branch.count()) > 0) {
      return NextResponse.json(
        { success: false, error: 'Branches already exist' },
        { status: 409 }
      );
    }

    const data = await prisma.$transaction(
      DEFAULT_BRANCHES.map((branch, index) => prisma.branch.create({ data: { ...branch, order: index } }))
    );

    return NextResponse.json(
      { success: true, data: data.map(withLegacyId), message: 'Branches imported successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to import branches' },
      { status: 500 }
    );
  }
}
