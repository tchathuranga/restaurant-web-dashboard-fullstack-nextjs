import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import { Types } from "mongoose";
import Vacancy from "@/models/vacancy";

// GET single vacancy by ID
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
          error: "Invalid vacancy ID",
        },
        { status: 400 },
      );
    }

    const vacancy = await Vacancy.findById(id);

    if (!vacancy) {
      return NextResponse.json(
        {
          success: false,
          error: "Vacancy not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: vacancy,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch vacancy",
      },
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
    await dbConnect();

    const { id } = await context.params;

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid vacancy ID",
        },
        { status: 400 },
      );
    }

    const vacancy = await Vacancy.findByIdAndDelete(id);

    if (!vacancy) {
      return NextResponse.json(
        {
          success: false,
          error: "Vacancy not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: vacancy,
        message: "Vacancy deleted successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to delete vacancy",
      },
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
    await dbConnect();

    const { id } = await context.params;
    const body = await request.json();

    // Validate MongoDB ObjectId
    if (!Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid vacancy ID",
        },
        { status: 400 },
      );
    }

    const vacancy = await Vacancy.findByIdAndUpdate(id, body, {
      new: true,
      runValidators: true,
    });

    if (!vacancy) {
      return NextResponse.json(
        {
          success: false,
          error: "Vacancy not found",
        },
        { status: 404 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        data: vacancy,
        message: "Vacancy updated successfully",
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to update vacancy",
      },
      { status: 500 },
    );
  }
}
