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
        { error: 'Site name must be 50 characters or less' },
        { status: 400 }
      );
    }
    
    // Create new site
    const newSite = await prisma.site.create({
      data: {
        name,
      },
    });
    
    console.log('Created site in database:', newSite);
    return NextResponse.json(newSite, { status: 201 });
  } catch (error) {
    console.error('Error creating site:', error);
    return NextResponse.json(
      { error: 'Failed to create site', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const sites = await prisma.site.findMany({
      orderBy: {
        name: 'asc', // Sort alphabetically by name
      },
      select: {
        id: true,
        name: true,
      },
    });
    
    console.log(`Fetched ${sites.length} sites from database`);
    return NextResponse.json(sites);
  } catch (error) {
    console.error('Error fetching sites:', error);
    return NextResponse.json(
      { error: 'Failed to fetch sites', details: (error as Error).message },
      { status: 500 }
    );
  }
}