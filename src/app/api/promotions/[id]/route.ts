import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Types } from "mongoose";
import promotions from "@/models/promotions";

// GET single promotion by ID
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
          error: "Invalid promotion ID",
        },
        { status: 400 },
      );
    }
    const promotionItem = await promotions.findById(id);
    if (!promotionItem) {
      return NextResponse.json(
        {
          success: false,
          error: "Promotion not found",
        },
        { status: 404 },
      );
    }   
    return NextResponse.json(
      {
        success: true,
        data: promotionItem,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch promotion",
      },
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
    await dbConnect();
    const { id } = await context.params;
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
        return NextResponse.json(
        {
          success: false,
          error: "Invalid promotion ID",
        },
        { status: 400 },
      );
    }
    const deletedPromotion = await promotions.findByIdAndDelete(id);
    if (!deletedPromotion) {
      return NextResponse.json(
        {
          success: false,
          error: "Promotion not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Promotion deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete promotion",
      },
      { status: 500 },
    );
  }
}