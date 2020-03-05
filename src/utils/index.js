export const handleError = async (err, res) => {
  const { statusCode, message } = err;
  return res.status(statusCode || 500).json({
    success: false,
    data: {},
    error: [
      {
        message: message || 'Something went wrong. Please try again!',
      },
    ],
  });
};
