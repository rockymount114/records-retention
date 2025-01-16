import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/prisma/client';
import { z } from 'zod';

const createRecordSchema = z.object({
    site: z.string().default("CITY HALL"),
    locationId: z.number().int(),
    ownerId: z.number().int(),
    boxId: z.number().int(),
    status: z.string().default("ACTIVE"),
    disposition: z.string().default("ACTIVE"),
    retention: z.coerce.number().int().optional(),
    content: z.string().optional(),
    reviewDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid date format for reviewDate",
    }).transform((date) => date ? new Date(date) : null),
    deleteDate: z.string().optional().refine((date) => !date || !isNaN(Date.parse(date)), {
        message: "Invalid date format for deleteDate",
    }).transform((date) => date ? new Date(date) : null),
});

export async function POST(request: NextRequest) {
    try {
        if (!request.body) {
            return NextResponse.json({ error: "Request body is missing" }, { status: 400 });
        }

        const body = await request.json();
        const validation = createRecordSchema.safeParse(body);
        
        if (!validation.success) {
            return NextResponse.json(
                { error: "Validation failed", details: validation.error.format() }, 
                { status: 400 }
            );
        }

        const validatedData = validation.data;

        // Check if location exists
        const location = await prisma.location.findUnique({
            where: { id: validatedData.locationId }
        });
        if (!location) {
            return NextResponse.json(
                { error: `Location with ID ${validatedData.locationId} not found` },
                { status: 404 }
            );
        }

        // Check if owner exists
        const owner = await prisma.owner.findUnique({
            where: { id: validatedData.ownerId }
        });
        if (!owner) {
            return NextResponse.json(
                { error: `Owner with ID ${validatedData.ownerId} not found` },
                { status: 404 }
            );
        }

        // Check if box exists
        const box = await prisma.box.findUnique({
            where: { id: validatedData.boxId }
        });
        if (!box) {
            return NextResponse.json(
                { error: `Box with ID ${validatedData.boxId} not found` },
                { status: 404 }
            );
        }

        const newRecord = await prisma.record.create({
            data: {
                site: validatedData.site,
                locationId: validatedData.locationId,
                ownerId: validatedData.ownerId,
                boxId: validatedData.boxId,
                status: validatedData.status,
                disposition: validatedData.disposition,
                retention: validatedData.retention,
                content: validatedData.content,
                reviewDate: validatedData.reviewDate || new Date(), // Provide default if not specified
                deleteDate: validatedData.deleteDate,
                updatedAt: new Date(),
            },
        });

        return NextResponse.json(newRecord, { status: 201 });
    } catch (error) {
        if (error instanceof Error) {
            console.error("Error details:", {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
        } else {
            console.error("Unknown error:", error);
        }

        return NextResponse.json(
            { error: "Internal Server Error", message: error instanceof Error ? error.message : "Unknown error occurred" },
            { status: 500 }
        );
    }
}