import { Router } from 'express';
import { AdminController } from '../controllers/adminController';
import { authMiddleware, restrictTo } from '../middleware/auth';

const router = Router();

router.use(authMiddleware, restrictTo('ADMIN'));

router.get('/analytics', AdminController.getAnalytics);
router.get('/audit-logs', AdminController.getAuditLogs);

export default router;
