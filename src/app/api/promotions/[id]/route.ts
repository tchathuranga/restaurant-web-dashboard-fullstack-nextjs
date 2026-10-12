import { NextRequest, NextResponse } from "next/server";
import { prisma, withLegacyId } from "@/lib/prisma";
import { isNotFound } from "@/lib/apiErrors";

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
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch promotion" },
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
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "Promotion not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete promotion" },
      { status: 500 },
    );
  }
}
