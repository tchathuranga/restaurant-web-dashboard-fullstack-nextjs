import { NextRequest, NextResponse } from "next/server";
import { prisma, withLegacyId } from "@/lib/prisma";
import { isNotFound } from "@/lib/apiErrors";

// GET single gallery item by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const galleryItem = await prisma.gallery.findUnique({ where: { id } });

    if (!galleryItem) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: withLegacyId(galleryItem) },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch gallery item" },
      { status: 500 },
    );
  }
}

// DELETE gallery item by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const deletedItem = await prisma.gallery.delete({ where: { id } });
    return NextResponse.json(
      { success: true, data: withLegacyId(deletedItem) },
      { status: 200 },
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete gallery item" },
      { status: 500 },
    );
  }
}
