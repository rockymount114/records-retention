import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string().min(1, {message: 'First Name must be at least 1 characters'}),
  lastName: z.string().min(1, {message: 'Last Name must be at least 1 characters'}),
  username: z.string().min(5, {message: 'Username must be at least 5 characters'}),
});


export function validateWithZodSchema<T>(
  schema: ZodSchema<T>,
  data: unknown
): T {
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
      return (
        !file || acceptedFileTypes.some((type) => file.type.startsWith(type))
      );
    }, 'File must be an image');
}




export const recordSchema = z.object({
  site: z
    .string()
    .min(2, {
      message: 'site must be at least 2 characters.',
    })
    .max(100, {
      message: 'site must be less than 100 characters.',
    }),
    disposition: z
    .string()
    .min(2, {
      message: 'disposition must be at least 2 characters.',
    })
    .max(100, {
      message: 'disposition must be less than 100 characters.',
    }),  
  retention: z.coerce.number().int().min(0, {
    message: 'retention must be a positive number.',
  }),
  content: z.string().refine(
    (content) => {
      const wordCount = content.split(' ').length;
      return wordCount >= 10 && wordCount <= 1000;
    },
    {
      message: 'content must be between 10 and 1000 words.',
    }
  ),
  
});