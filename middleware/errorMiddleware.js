export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

// eslint-disable-next-line no-unused-vars
export const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = error.message || 'Internal server error';

  // Sequelize unique-constraint violation (e.g. duplicate email).
  if (error.name === 'SequelizeUniqueConstraintError') {
    statusCode = 409;
    const field = error.errors?.[0]?.path;
    message =
      field === 'email'
        ? 'An account with this email already exists.'
        : 'That value is already in use.';
  }

  // Sequelize validation errors.
  if (error.name === 'SequelizeValidationError') {
    statusCode = 400;
    message = error.errors?.map((e) => e.message).join(', ') || 'Validation failed';
  }

  // DB connectivity / pool exhaustion under load — tell the client to retry.
  if (
    error.name === 'SequelizeConnectionError' ||
    error.name === 'SequelizeConnectionAcquireTimeoutError' ||
    error.name === 'SequelizeConnectionRefusedError'
  ) {
    statusCode = 503;
    message = 'Service temporarily busy. Please retry in a moment.';
  }

  // Invalid / expired JWT.
  if (error.name === 'JsonWebTokenError') {
    statusCode = 401;
    message = 'Invalid authentication token.';
  }
  if (error.name === 'TokenExpiredError') {
    statusCode = 401;
    message = 'Session expired. Please sign in again.';
  }

  // Log genuine server-side failures only (5xx). 4xx are normal client errors.
  if (statusCode >= 500) {
    console.error('EXPRESS ERROR:', req.method, req.originalUrl, '-', error.message);
    console.error(error.stack);
  }

  // Never leak an unexpected 500's raw message to the client in production —
  // it can expose internals. Use a generic message; full detail stays in logs.
  if (statusCode >= 500 && process.env.NODE_ENV === 'production') {
    message = 'Internal server error';
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};
