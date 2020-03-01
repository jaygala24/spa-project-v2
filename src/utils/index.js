export const handleError = async (err, res) => {
  const { statusCode, message } = err;
  return res.status(statusCode).json({
    success: false,
    data: {},
    error: [{ message: message }],
  });
};
