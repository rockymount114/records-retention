import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
    firstName: z.string().min(1, { message: 'First Name must be at least 1 characters' }),
    lastName: z.string().min(1, { message: 'Last Name must be at least 1 characters' }),
    username: z.string().min(5, { message: 'Username must be at least 5 characters' }),
});

export function validateWithZodSchema<T>(schema: ZodSchema<T>, data: unknown): T {
    const result = schema.safeParse(data);
    if (!result.success) {
        const errors = result.error.errors.map((error) => error.message);
        throw new Error(errors.join(', '));
    }
    return result.data;
}

export const imageSchema = z.object({
    image: validateFile(),
});

function validateFile() {
    const maxUploadSize = 1024 * 1024;
    const acceptedFileTypes = ['image/'];
    return z
        .instanceof(File)
        .refine((file) => {
            return !file || file.size <= maxUploadSize;
        }, `File size must be less than 1 MB`)
        .refine((file) => {
            return !file || acceptedFileTypes.some((type) => file.type.startsWith(type));
        }, 'File must be an image');
}

export const recordSchema = z.object({
    siteId: z.string().min(1, 'Site is required'),
    boxId: z.string().min(1, 'Box is required').regex(/^\d+$/, 'Box must be a number'),
    locationId: z.string().min(1, 'Location is required').regex(/^\d+$/, 'Location must be a number'),
    ownerId: z.string().min(1, 'Owner is required').regex(/^\d+$/, 'Owner ID must be a number'),
    disposition: z.string().min(1, 'Disposition is required').default('ACTIVE'),
    status: z.string().min(1, 'Status is required').default('ACTIVE'),
    retention: z.string().transform((val) => (val ? parseInt(val, 10) : 0)),
    content: z.string().optional(),
});