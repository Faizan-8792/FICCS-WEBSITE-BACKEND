export const notFound = (req, res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  res.status(404);
  next(error);
};

export const errorHandler = (error, req, res, next) => {
  let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
  let message = error.message || 'Internal server error';

  // MongoDB duplicate key error (E11000)
  if (error.code === 11000) {
    statusCode = 400;
    const field = Object.keys(error.keyValue || {})[0];
    if (field === 'email') {
      message = 'An account with this email already exists.';
    } else if (field && field !== 'username') {
      message = `${field} already exists.`;
    } else {
      // Stale index on a removed field (e.g. username) — treat as generic conflict
      message = 'Account could not be created. Please try again.';
    }
  }

  // Mongoose validation error
  if (error.name === 'ValidationError') {
    statusCode = 400;
    message = Object.values(error.errors).map((e) => e.message).join(', ');
  }

  res.status(statusCode).json({
    message,
    stack: process.env.NODE_ENV === 'production' ? undefined : error.stack,
  });
};
