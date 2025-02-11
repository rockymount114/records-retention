import * as z from 'zod';
import { ZodSchema } from 'zod';

export const profileSchema = z.object({
  // firstName: z.string().max(5, { message: 'max length is 5' }),
  firstName: z.string().min(2, {message: 'minimum length is 1'}),
  lastName: z.string().min(2, {message: 'minimum length is 1'}),
  username: z.string().min(2),
});