import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Types } from "mongoose";
import gallery from "@/models/gallery";

// GET single gallery item by ID
export async function GET(
  request: NextRequest,
    context: { params: Promise<{ id: string }> },
) {
  try {
    await dbConnect();
    const { id } = await context.params;
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid gallery item ID",
        },
        { status: 400 },
      );
    }
    const galleryItem = await gallery.findById(id);

    if (!galleryItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Gallery item not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: galleryItem,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch gallery item",
      },
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
    await dbConnect();
    const { id } = await context.params;
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid gallery item ID",
        },
        { status: 400 },
      );
    }
    const deletedItem = await gallery.findByIdAndDelete(id);

    if (!deletedItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Gallery item not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: deletedItem,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete gallery item",
      },
      { status: 500 },
    );
  }
}

