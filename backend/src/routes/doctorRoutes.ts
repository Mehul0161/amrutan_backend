import { Router } from 'express';
import { DoctorController } from '../controllers/doctorController';
import { authMiddleware, restrictTo } from '../middleware/auth';

const router = Router();

router.get('/', DoctorController.getDoctors);
router.get('/:doctorId/availability', DoctorController.getAvailability);

router.post(
    '/:doctorId/availability',
    authMiddleware,
    restrictTo('DOCTOR', 'ADMIN'),
    DoctorController.createSlots
);

export default router;
