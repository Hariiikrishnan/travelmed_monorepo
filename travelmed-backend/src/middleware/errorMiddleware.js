import { AppError } from '../utils/errors.js';

export const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // Log all errors for development
  if (process.env.NODE_ENV === 'development' || !process.env.NODE_ENV) {
    console.error('Error Details:', err);
  }

  // Handle Prisma Database Errors
  if (err.code === 'P2002') {
    // Unique constraint violation
    const field = err.meta?.target ? err.meta.target.join(', ') : 'field';
    return res.status(409).json({
      success: false,
      message: `A record with this ${field} already exists.`
    });
  }

  if (err.code === 'P2025') {
    // Record not found
    return res.status(404).json({
      success: false,
      message: err.meta?.cause || 'Record not found.'
    });
  }

  // Handle Zod Validation Errors
  if (err.name === 'ZodError') {
    const message = err.errors.map(e => `${e.path.join('.')}: ${e.message}`).join('; ');
    return res.status(400).json({
      success: false,
      message: `Validation Error: ${message}`,
      errors: err.errors
    });
  }

  // Handle JWT error
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid authorization token.'
    });
  }

  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Authorization token has expired.'
    });
  }

  // Operational, trusted error: send message to client
  if (err.isOperational) {
    return res.status(err.statusCode).json({
      success: false,
      message: err.message
    });
  }

  // Programming or other unknown error: don't leak error details in production
  const message = process.env.NODE_ENV === 'production' 
    ? 'An unexpected error occurred on the server.' 
    : err.message;

  return res.status(err.statusCode).json({
    success: false,
    message
  });
};
