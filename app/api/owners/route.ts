// app/api/owners/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

export async function POST(request: NextRequest) {
  try {
    const data = await request.json();
    
    // Extract necessary fields
    const { ownername, ownerlong, status, contact } = data;
    
    // Basic validation
    if (!ownername || !ownerlong || !status || !contact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Create new owner
    const newOwner = await prisma.owner.create({
      data: {
        ownername,
        ownerlong,
        status,
        contact,
      },
    });
    
    console.log('Created owner in database:', newOwner);
    return NextResponse.json(newOwner, { status: 201 });
  } catch (error) {
    console.error('Error creating owner:', error);
    return NextResponse.json(
      { error: 'Failed to create owner', details: (error as Error).message },
      { status: 500 }
    );
  }
}

export async function GET() {
  try {
    const owners = await prisma.owner.findMany({
      where: {
        status: 'ACTIVE',
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
    
    console.log(`Fetched ${owners.length} owners from database`);
    return NextResponse.json(owners);
  } catch (error) {
    console.error('Error fetching owners:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owners', details: (error as Error).message },
      { status: 500 }
    );
  }
}