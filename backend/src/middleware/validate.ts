import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';
import { AppError } from './error';

export const validate = (schema: ZodSchema) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            await schema.parseAsync({
                body: req.body,
                query: req.query,
                params: req.params,
            });
            return next();
        } catch (error: any) {
            if (error && error.issues) {
                return res.status(400).json({
                    status: 'fail',
                    message: 'Validation failed',
                    errors: error.issues.map((err: any) => ({
                        path: err.path.join('.'),
                        message: err.message
                    }))
                });
            }
            return next(error);
        }
    };
};
