import { Request, Response, NextFunction } from 'express';
import { BookingService } from '../services/bookingService';
import { ConsultationService } from '../services/consultationService';

export class ConsultationController {
    static async createBooking(req: Request, res: Response, next: NextFunction) {
        try {
            const { doctorId, slotId } = req.body;
            const patientId = (req as any).user.id; // From authMiddleware
            const consultation = await BookingService.createBooking(patientId, doctorId, slotId);
            res.status(201).json({ status: 'success', data: { consultation } });
        } catch (error) {
            next(error);
        }
    }

    static async updateStatus(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { status } = req.body;
            const { id: userId, role } = (req as any).user;
            const consultation = await ConsultationService.updateStatus(id as string, status, userId, role);
            res.status(200).json({ status: 'success', data: { consultation } });
        } catch (error) {
            next(error);
        }
    }

    static async addPrescription(req: Request, res: Response, next: NextFunction) {
        try {
            const { id } = req.params;
            const { id: doctorUserId } = (req as any).user;
            const prescription = await ConsultationService.addPrescription(id as string, doctorUserId, req.body);
            res.status(201).json({ status: 'success', data: { prescription } });
        } catch (error) {
            next(error);
        }
    }
}
