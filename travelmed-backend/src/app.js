import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import { globalLimiter, authLimiter } from './middleware/rateLimiter.js';
import { errorHandler } from './middleware/errorMiddleware.js';
import { NotFoundError } from './utils/errors.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import medicineRoutes from './routes/medicineRoutes.js';
import doctorRoutes from './routes/doctorRoutes.js';
import scenarioRoutes from './routes/scenarioRoutes.js';
import testimonialRoutes from './routes/testimonialRoutes.js';
import orderRoutes from './routes/orderRoutes.js';
import paymentRoutes from './routes/paymentRoutes.js';
import couponRoutes from './routes/couponRoutes.js';
import ticketRoutes from './routes/ticketRoutes.js';
import logRoutes from './routes/logRoutes.js';

dotenv.config();

const app = express();

// Global Middlewares
app.use(helmet());
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://127.0.0.1:3000',
  'http://127.0.0.1:3001',
  'http://127.0.0.1:3002'
];

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }
    const msg = `The CORS policy for this site does not allow access from specified Origin: ${origin}`;
    return callback(new Error(msg), false);
  },
  credentials: true
}));
app.use(express.json());

// Apply global rate limit
app.use(globalLimiter);

// API Routes
app.use('/api/auth', authLimiter, authRoutes);
app.use('/api/medicines', medicineRoutes);
app.use('/api/doctors', doctorRoutes);
app.use('/api/travel-scenarios', scenarioRoutes);
app.use('/api/testimonials', testimonialRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/payments', paymentRoutes);
app.use('/api/coupons', couponRoutes);
app.use('/api/tickets', ticketRoutes);
app.use('/api/logs', logRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new NotFoundError(`Can't find ${req.originalUrl} on this server.`));
});

// Centralized Error Handler
app.use(errorHandler);

export default app;
