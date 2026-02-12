import prisma from '../config/db';
import { AppError } from '../middleware/error';

export class BookingService {
    static async createBooking(patientId: string, doctorId: string, slotId: string) {
        // Transaction to ensure atomicity
        return prisma.$transaction(async (tx: any) => {
            // 1. Check if slot is still available and belongs to the doctor
            const slot = await tx.availabilitySlot.findFirst({
                where: {
                    id: slotId,
                    doctorId,
                    status: 'AVAILABLE' as any,
                },
            });

            if (!slot) {
                throw new AppError('Slot is no longer available or invalid', 400);
            }

            // 2. Mark slot as BOOKED
            await tx.availabilitySlot.update({
                where: { id: slotId },
                data: { status: 'BOOKED' as any },
            });

            // 3. Create Consultation
            const consultation = await tx.consultation.create({
                data: {
                    patientId,
                    doctorId: (await tx.doctorProfile.findUnique({ where: { id: doctorId } }))?.userId || '',
                    slotId,
                    status: 'PENDING' as any,
                    meetingLink: `https://telehealth.amrutam.co.in/meet/${Math.random().toString(36).substring(7)}`,
                },
            });

            return consultation;
        });
    }
}
