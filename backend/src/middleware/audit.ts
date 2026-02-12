import { Request, Response, NextFunction } from 'express';
import { AuditService } from '../services/auditService';

export const auditMiddleware = (action: string, resource: string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const originalSend = res.send;

        res.send = function (body) {
            const userId = (req as any).user?.id || null;

            // Only log successful potentially state-changing operations or specific actions
            if (res.statusCode >= 200 && res.statusCode < 300) {
                AuditService.log(userId, action, resource, {
                    method: req.method,
                    url: req.originalUrl,
                    params: req.params,
                    body: req.method === 'GET' ? null : req.body,
                });
            }

            return originalSend.apply(res, arguments as any);
        };

        next();
    };
};
