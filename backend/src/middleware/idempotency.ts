import { Request, Response, NextFunction } from 'express';
import Redis from 'ioredis';
import { logger } from '../utils/logger';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export const idempotencyMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    const key = req.headers['idempotency-key'];

    if (!key) {
        return next();
    }

    const cachedResponse = await redis.get(`idempotency:${key}`);
    if (cachedResponse) {
        const { status, body } = JSON.parse(cachedResponse);
        return res.status(status).json(body);
    }

    const originalJson = res.json;
    res.json = function (body) {
        redis.setex(`idempotency:${key}`, 86400, JSON.stringify({
            status: res.statusCode,
            body
        }));
        return originalJson.call(this, body);
    };

    next();
};
