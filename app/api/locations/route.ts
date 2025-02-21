import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract necessary fields
    const { name } = data;
    
    // Basic validation
    if (!name) {
      return NextResponse.json(
        { error: 'Missing required field: name' },
        { status: 400 }
      );
    }
    
    // Validate name length (based on schema @db.VarChar(50))
    if (name.length > 50) {
      return NextResponse.json(
        { error: 'Location name must be 50 characters or less' },
        { status: 400 }
      );
    }
    
    // Create new location
    const newLocation = await prisma.location.create({
      data: {
        name,
      },
    });
    
    console.log('Created location in database:', newLocation);
    return NextResponse.json(newLocation, { status: 201 });
  } catch (error) {
    console.error('Error creating location:', error);
    return NextResponse.json(
      { error: 'Failed to create location', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const locations = await prisma.location.findMany({
      orderBy: {
        name: 'asc', // Sort alphabetically by name
      },
      select: {
        id: true,
        name: true,
        // Optionally include related Records if needed
        // Record: {
        //   select: {
        //     id: true
        //   }
        // }
      },
    });
    
    console.log(`Fetched ${locations.length} locations from database`);
    return NextResponse.json(locations);
  } catch (error) {
    console.error('Error fetching locations:', error);
    return NextResponse.json(
      { error: 'Failed to fetch locations', details: (error as Error).message },
      { status: 500 }
    );
  }
}