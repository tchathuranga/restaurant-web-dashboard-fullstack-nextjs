import { NextRequest, NextResponse } from "next/server";
import { prisma, withLegacyId } from "@/server/prisma";
import { errorMessage, isNotFound } from '@/server/http';

// GET single promotion by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const promotionItem = await prisma.promotion.findUnique({ where: { id } });
    if (!promotionItem) {
      return NextResponse.json(
        { success: false, error: "Promotion not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: withLegacyId(promotionItem) },
      { status: 200 },
    );
  } catch (error) {
    return NextResponse.json(
      { success: false, error: errorMessage(error, "Failed to fetch promotion") },
      { status: 500 },
    );
  }
}

// DELETE promotion by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    await prisma.promotion.delete({ where: { id } });
    return NextResponse.json(
      { success: true, message: "Promotion deleted successfully" },
      { status: 200 },
    );
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "Promotion not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: errorMessage(error, "Failed to delete promotion") },
      { status: 500 },
    );
  }
}
