import { z } from 'zod';

export const BookingSchema = z.object({
    start: z.string(),
    end: z.string(),
    firstName: z.string().min(1, 'First name is required'),
    lastName: z.string().min(1, 'Last name is required'),
    email: z.string().email('Please enter a valid email'),
});