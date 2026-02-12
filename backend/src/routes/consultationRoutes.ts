import { Router } from 'express';
import { ConsultationController } from '../controllers/consultationController';
import { authMiddleware, restrictTo } from '../middleware/auth';

import { auditMiddleware } from '../middleware/audit';
import { idempotencyMiddleware } from '../middleware/idempotency';

const router = Router();

router.use(authMiddleware);

router.post(
    '/bookings',
    idempotencyMiddleware,
    auditMiddleware('CREATE_BOOKING', 'CONSULTATION'),
    ConsultationController.createBooking
);
router.patch('/:id', auditMiddleware('UPDATE_STATUS', 'CONSULTATION'), ConsultationController.updateStatus);
router.post(
    '/:id/prescriptions',
    restrictTo('DOCTOR'),
    auditMiddleware('ADD_PRESCRIPTION', 'PRESCRIPTION'),
    ConsultationController.addPrescription
);

export default router;
