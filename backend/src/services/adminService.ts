import prisma from '../config/db';

export class AdminService {
    static async getAnalytics() {
        const stats = await Promise.all([
            prisma.consultation.count(),
            prisma.doctorProfile.count(),
            prisma.payment.aggregate({
                _sum: {
                    amount: true,
                },
                where: {
                    status: 'COMPLETED',
                },
            }),
        ]);

        return {
            totalConsultations: stats[0],
            activeDoctors: stats[1],
            totalRevenue: stats[2]._sum.amount || 0,
        };
    }

    static async getAuditLogs(resourceId?: string) {
        return prisma.auditLog.findMany({
            where: resourceId ? {
                payload: {
                    path: ['params', 'id'],
                    equals: resourceId,
                },
            } : undefined,
            orderBy: {
                timestamp: 'desc',
            },
            take: 100,
        });
    }
}
