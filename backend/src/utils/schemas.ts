import { z } from 'zod';

export const registerSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string().min(8),
        role: z.enum(['ADMIN', 'DOCTOR', 'PATIENT']),
        name: z.string().optional(),
    }),
});

export const loginSchema = z.object({
    body: z.object({
        email: z.string().email(),
        password: z.string(),
    }),
});

export const bookingSchema = z.object({
    body: z.object({
        doctorId: z.string().uuid(),
        slotId: z.string().uuid(),
    }),
});
