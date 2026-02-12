import { Router } from 'express';
import { AuthController } from '../controllers/authController';

import { validate } from '../middleware/validate';
import { registerSchema, loginSchema } from '../utils/schemas';

const router = Router();

router.post('/register', validate(registerSchema), AuthController.register);
router.post('/login', validate(loginSchema), AuthController.login);

export default router;
