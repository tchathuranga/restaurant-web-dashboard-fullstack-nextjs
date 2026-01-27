import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Types } from "mongoose";
import News from "@/models/news";

// GET single news by ID
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
          error: "Invalid news ID",
        },
        { status: 400 },
      );
    }
    const newsItem = await News.findById(id);

    if (!newsItem) {
      return NextResponse.json(
        {
          success: false,
          error: "News item not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: newsItem,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch news item",
      },
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
    await dbConnect();
    const { id } = await context.params;
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid news ID",
        },
        { status: 400 },
      );
    }
    const deletedNews = await News.findByIdAndDelete(id);

    if (!deletedNews) {
      return NextResponse.json(
        {
          success: false,
          error: "News item not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: deletedNews,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete news item",
      },
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
    await dbConnect();
    const { id } = await context.params;
    const body = await request.json();
    const { title, description, image } = body;
    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid news ID",
        },
        { status: 400 },
      );
    }
    // Validation
    if (!title || !description || !image) {
      return NextResponse.json(
        {
          success: false,
          error: "Please provide all required fields",
        },
        { status: 400 },
      );
    }
    const updatedNews = await News.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });
    if (!updatedNews) {
      return NextResponse.json(
        {
          success: false,
          error: "News item not found",
        },
        { status: 404 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        data: updatedNews,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update news item",
      },
      { status: 500 },
    );
  }
}