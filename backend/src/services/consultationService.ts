import prisma from '../config/db';
import { AppError } from '../middleware/error';

export class ConsultationService {
    static async updateStatus(consultationId: string, status: any, userId: string, role: string) {
        const consultation = await prisma.consultation.findUnique({
            where: { id: consultationId },
        });

        if (!consultation) throw new AppError('Consultation not found', 404);

        // Basic RBAC/Ownership check
        if (role !== 'ADMIN' && consultation.patientId !== userId && consultation.doctorId !== userId) {
            throw new AppError('Unauthorized', 403);
        }

        return prisma.consultation.update({
            where: { id: consultationId },
            data: { status },
        });
    }

    static async addPrescription(consultationId: string, doctorUserId: string, data: any) {
        const consultation = await prisma.consultation.findUnique({
            where: { id: consultationId },
        });

        if (!consultation || consultation.doctorId !== doctorUserId) {
            throw new AppError('Unauthorized or invalid consultation', 403);
        }

        return prisma.prescription.create({
            data: {
                consultationId,
                data,
            },
        });
    }
}
