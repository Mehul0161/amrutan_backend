import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '../config/db';
import { AppError } from '../middleware/error';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secret-key';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '1d';

export class AuthService {
    static async register(data: any) {
        const { email, password, role, name } = data;

        const existingUser = await prisma.user.findUnique({ where: { email } });
        if (existingUser) {
            throw new AppError('Email already in use', 400);
        }

        const passwordHash = await bcrypt.hash(password, 12);

        return prisma.user.create({
            data: {
                email,
                passwordHash,
                role,
                // If doctor, we might need more info but for now keeping it simple
            },
            select: {
                id: true,
                email: true,
                role: true,
                createdAt: true,
            },
        });
    }

    static async login(email: string, password: string) {
        const user = await prisma.user.findUnique({ where: { email } });
        if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
            throw new AppError('Invalid email or password', 401);
        }

        const token = jwt.sign(
            { id: user.id, role: user.role },
            JWT_SECRET as jwt.Secret,
            { expiresIn: JWT_EXPIRES_IN as any }
        );

        return {
            token,
            user: {
                id: user.id,
                email: user.email,
                role: user.role,
            },
        };
    }
}
