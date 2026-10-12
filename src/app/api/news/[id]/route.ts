import { NextRequest, NextResponse } from "next/server";
import { prisma, withLegacyId } from "@/lib/prisma";
import { isNotFound } from "@/lib/apiErrors";

// GET single news by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const newsItem = await prisma.news.findUnique({ where: { id } });

    if (!newsItem) {
      return NextResponse.json(
        { success: false, error: "News item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: true, data: withLegacyId(newsItem) },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch news item" },
      { status: 500 },
    );
  }
}

// DELETE news by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const deletedNews = await prisma.news.delete({ where: { id } });
    return NextResponse.json(
      { success: true, data: withLegacyId(deletedNews) },
      { status: 200 },
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "News item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete news item" },
      { status: 500 },
    );
  }
}

// PUT update news by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { title, description, image } = await request.json();
    // Validation
    if (!title || !description || !image) {
      return NextResponse.json(
        { success: false, error: "Please provide all required fields" },
        { status: 400 },
      );
    }
    const updatedNews = await prisma.news.update({
      where: { id },
      data: { title, description, image },
    });
    return NextResponse.json(
      { success: true, data: withLegacyId(updatedNews) },
      { status: 200 },
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "News item not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update news item" },
      { status: 500 },
    );
  }
}
