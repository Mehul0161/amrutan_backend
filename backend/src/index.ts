import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import { logger } from './utils/logger';
import { errorMiddleware } from './middleware/error';
import { rateLimit } from 'express-rate-limit';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: 'Too many requests from this IP, please try again after 15 minutes',
});

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use('/api', limiter);

// Logging Middleware
app.use(morgan('combined', { stream: { write: (message) => logger.info(message.trim()) } }));

// Routes
import authRoutes from './routes/authRoutes';
import doctorRoutes from './routes/doctorRoutes';
import consultationRoutes from './routes/consultationRoutes';

app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/doctors', doctorRoutes);
app.use('/api/v1/consultations', consultationRoutes);

import client from 'prom-client';

// Prometheus Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

app.get('/metrics', async (req, res) => {
    res.set('Content-Type', client.register.contentType);
    res.end(await client.register.metrics());
});

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

// Error Handling
app.use(errorMiddleware);

app.listen(port, () => {
    logger.info(`Server running on port ${port}`);
});

export default app;
