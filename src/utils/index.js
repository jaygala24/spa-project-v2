export const handleError = (req, res, next) => {
  const error = new Error('Not found');
  error.status = 404;
  next(error);
};

export const catchError = (error, req, res, next) => {
  res.status(error.status || 500).json({
    success: false,
    data: {},
    error: [{ message: error.message }]
  });
};
