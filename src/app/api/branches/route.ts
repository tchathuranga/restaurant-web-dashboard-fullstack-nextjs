import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';
import { validateBranchBody } from '@/lib/branchValidation';

export const dynamic = 'force-dynamic';

// GET all branches in display order
export async function GET() {
  try {
    const rows = await prisma.branch.findMany({ orderBy: [{ order: 'asc' }, { createdAt: 'asc' }] });
    return NextResponse.json({ success: true, data: rows.map(withLegacyId) }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch branches' },
      { status: 500 }
    );
  }
}

// POST create a branch (added at the end of the list)
export async function POST(request: NextRequest) {
  try {
    const result = validateBranchBody(await request.json());
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const last = await prisma.branch.findFirst({ orderBy: { order: 'desc' } });
    const branch = await prisma.branch.create({
      data: { ...result.value, order: (last?.order ?? -1) + 1 },
    });

    return NextResponse.json(
      { success: true, data: withLegacyId(branch), message: 'Branch created successfully' },
      { status: 201 }
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to create branch' },
      { status: 500 }
    );
  }
}
