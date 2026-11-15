import { NextRequest, NextResponse } from "next/server";
import { prisma, withLegacyId } from "@/server/prisma";
import { errorMessage, isNotFound } from '@/server/http';

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
  } catch (error) {
    return NextResponse.json(
      { success: false, error: errorMessage(error, "Failed to fetch gallery item") },
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
  } catch (error) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "Gallery item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: errorMessage(error, "Failed to delete gallery item") },
      { status: 500 },
    );
  }
}
