import { NextRequest, NextResponse } from 'next/server';
import { prisma, withLegacyId } from '@/lib/prisma';
import { isNotFound } from '@/lib/apiErrors';
import { validateBranchBody } from '@/lib/branchValidation';

// PUT update a branch
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = validateBranchBody(await request.json());
    if ('error' in result) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }

    const branch = await prisma.branch.update({ where: { id }, data: result.value });

    return NextResponse.json(
      { success: true, data: withLegacyId(branch), message: 'Branch updated successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json({ success: false, error: 'Branch not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to update branch' },
      { status: 500 }
    );
  }
}

// DELETE a branch
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const branch = await prisma.branch.delete({ where: { id } });

    return NextResponse.json(
      { success: true, data: withLegacyId(branch), message: 'Branch deleted successfully' },
      { status: 200 }
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json({ success: false, error: 'Branch not found' }, { status: 404 });
    }
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to delete branch' },
      { status: 500 }
    );
  }
}
