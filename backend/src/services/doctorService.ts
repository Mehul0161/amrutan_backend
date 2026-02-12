import prisma from '../config/db';
import { AppError } from '../middleware/error';

export class DoctorService {
    static async getDoctors(filters: any) {
        const { specialty, query } = filters;
        return prisma.doctorProfile.findMany({
            where: {
                specialty: specialty ? { contains: specialty, mode: 'insensitive' } : undefined,
                user: query ? {
                    name: { contains: query, mode: 'insensitive' }
                } : undefined,
            },
            include: {
                user: {
                    select: {
                        id: true,
                        email: true,
                    }
                }
            }
        });
    }

    static async getAvailability(doctorId: string, startDate: Date) {
        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + 7); // Show 1 week

        return prisma.availabilitySlot.findMany({
            where: {
                doctorId,
                startTime: {
                    gte: startDate,
                    lte: endDate,
                },
                status: 'AVAILABLE',
            },
            orderBy: {
                startTime: 'asc',
            }
        });
    }

    static async createSlots(doctorId: string, slots: { startTime: string, endTime: string }[]) {
        const data = slots.map(slot => ({
            doctorId,
            startTime: new Date(slot.startTime),
            endTime: new Date(slot.endTime),
            status: 'AVAILABLE' as any,
        }));

        return prisma.availabilitySlot.createMany({
            data,
        });
    }
}
