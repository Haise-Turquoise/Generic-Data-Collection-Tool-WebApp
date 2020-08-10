export const returnNormalJson = (res, data, statusCode = 200) => {
  return res.status(statusCode).json({
    status: 'ok',
    data,
    error: null,
  });
};

export const returnErrorJson = (res, error, statusCode = 400) => {
  return res.status(statusCode).json({
    status: 'error',
    data: null,
    error,
  });
};
