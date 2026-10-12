import { NextRequest, NextResponse } from "next/server";
import { prisma, withLegacyId } from "@/lib/prisma";
import { isNotFound } from "@/lib/apiErrors";

// GET single vacancy by ID
export async function GET(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const vacancy = await prisma.vacancy.findUnique({ where: { id } });

    if (!vacancy) {
      return NextResponse.json(
        { success: false, error: "Vacancy not found" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, data: withLegacyId(vacancy) },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || "Failed to fetch vacancy" },
      { status: 500 },
    );
  }
}

// DELETE vacancy by ID
export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    const vacancy = await prisma.vacancy.delete({ where: { id } });

    return NextResponse.json(
      { success: true, data: withLegacyId(vacancy), message: "Vacancy deleted successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "Vacancy not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to delete vacancy" },
      { status: 500 },
    );
  }
}

// PUT update vacancy by ID
export async function PUT(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;
    const { title, location, type, description } = await request.json();

    const vacancy = await prisma.vacancy.update({
      where: { id },
      data: { title, location, type, description },
    });

    return NextResponse.json(
      { success: true, data: withLegacyId(vacancy), message: "Vacancy updated successfully" },
      { status: 200 },
    );
  } catch (error: any) {
    if (isNotFound(error)) {
      return NextResponse.json(
        { success: false, error: "Vacancy not found" },
        { status: 404 },
      );
    }
    return NextResponse.json(
      { success: false, error: error.message || "Failed to update vacancy" },
      { status: 500 },
    );
  }
}
