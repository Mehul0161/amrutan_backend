import prisma from '../config/db';

export class AuditService {
    static async log(userId: string | null, action: string, resource: string, payload: any) {
        try {
            await prisma.auditLog.create({
                data: {
                    userId,
                    action,
                    resource,
                    payload,
                },
            });
        } catch (error) {
            console.error('Audit Logging Failed:', error);
            // We don't want to break the main flow if audit logging fails, but in production we might use a queue
        }
    }
}
