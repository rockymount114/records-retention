import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();

    // Extract necessary fields
    const { boxNumber } = data;

    // Basic validation
    if (!boxNumber) {
      return NextResponse.json(
        { error: 'Missing required field: boxNumber' },
        { status: 400 }
      );
    }

    // Create new box
    const newBox = await prisma.box.create({
      data: {
        boxNumber: Number(boxNumber), // Ensure it's stored as a number
      },
    });

    console.log('Created box in database:', newBox);
    return NextResponse.json(newBox, { status: 201 });
  } catch (error) {
    if (error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Box number already exists.' },
        { status: 400 }
      );
    }

    console.error('Error creating box:', error);
    return NextResponse.json(
      { error: 'Failed to create box', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const boxes = await prisma.box.findMany({
      orderBy: {
        boxNumber: 'asc', // Sort by box number ascending
      },
      select: {
        id: true,
        boxNumber: true,
      },
    });

    console.log(`Fetched ${boxes.length} boxes from database`);
    return NextResponse.json(boxes);
  } catch (error) {
    console.error('Error fetching boxes:', error);
    return NextResponse.json(
      { error: 'Failed to fetch boxes', details: (error as Error).message },
      { status: 500 }
    );
  }
}