import { Request, Response, NextFunction } from 'express';
import { AdminService } from '../services/adminService';

export class AdminController {
    static async getAnalytics(req: Request, res: Response, next: NextFunction) {
        try {
            const stats = await AdminService.getAnalytics();
            res.status(200).json({ status: 'success', data: stats });
        } catch (error) {
            next(error);
        }
    }

    static async getAuditLogs(req: Request, res: Response, next: NextFunction) {
        try {
            const { resource_id } = req.query;
            const logs = await AdminService.getAuditLogs(resource_id as string);
            res.status(200).json({ status: 'success', data: { logs } });
        } catch (error) {
            next(error);
        }
    }
}
