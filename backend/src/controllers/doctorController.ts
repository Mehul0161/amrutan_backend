import { Request, Response, NextFunction } from 'express';
import { DoctorService } from '../services/doctorService';

export class DoctorController {
    static async getDoctors(req: Request, res: Response, next: NextFunction) {
        try {
            const doctors = await DoctorService.getDoctors(req.query);
            res.status(200).json({ status: 'success', data: { doctors } });
        } catch (error) {
            next(error);
        }
    }

    static async getAvailability(req: Request, res: Response, next: NextFunction) {
        try {
            const { doctorId } = req.params;
            const { start_date } = req.query;
            const slots = await DoctorService.getAvailability(doctorId as string, new Date(start_date as string));
            res.status(200).json({ status: 'success', data: { slots } });
        } catch (error) {
            next(error);
        }
    }

    static async createSlots(req: Request, res: Response, next: NextFunction) {
        try {
            const { doctorId } = req.params;
            const { slots } = req.body;
            const result = await DoctorService.createSlots(doctorId as string, slots);
            res.status(201).json({ status: 'success', data: result });
        } catch (error) {
            next(error);
        }
    }
}
