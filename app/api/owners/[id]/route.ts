// app/api/owners/[id]/route.ts
import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';

// GET a single owner by ID
export async function GET(request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const owner = await prisma.owner.findUnique({
      where: { id },
    });
    
    if (!owner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }
    
    return NextResponse.json(owner);
    
  } catch (error) {
    console.error('Error fetching owner:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owner' },
      { status: 500 }
    );
  }
}

// UPDATE an existing owner
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    const data = await request.json();
    const { ownername, ownerlong, status, contact } = data;
    
    // Basic validation
    if (!ownername || !ownerlong || !status || !contact) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }
    
    // Check if owner exists
    const existingOwner = await prisma.owner.findUnique({
      where: { id },
    });
    
    if (!existingOwner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }
    
    // Update owner
    const updatedOwner = await prisma.owner.update({
      where: { id },
      data: {
        ownername,
        ownerlong,
        status,
        contact,
      },
    });
    
    return NextResponse.json(updatedOwner);
  } catch (error) {
    console.error('Error updating owner:', error);
    return NextResponse.json(
      { error: 'Failed to update owner' },
      { status: 500 }
    );
  }
}

// DELETE an owner
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'Invalid ID format' },
        { status: 400 }
      );
    }
    
    // Check if owner exists
    const existingOwner = await prisma.owner.findUnique({
      where: { id },
    });
    
    if (!existingOwner) {
      return NextResponse.json(
        { error: 'Owner not found' },
        { status: 404 }
      );
    }
    
    // Delete owner
    await prisma.owner.delete({
      where: { id },
    });
    
    return NextResponse.json(
      { message: 'Owner deleted successfully' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error deleting owner:', error);
    return NextResponse.json(
      { error: 'Failed to delete owner' },
      { status: 500 }
    );
  }
}