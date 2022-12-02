/**
 */
const getEnvironment = () => {
  const { NODE_ENV } = process.env;

  switch (NODE_ENV) {
    case "production":
      return "prod";

    case "development":
      return "dev";

    default:
      return "dev";
  }
};

/* Response Functions */

/**
 * @param  {ResponseResult} args?
 * @returns ResponseResult
 */
const initResponseResult = (args) => ({
  data: null,
  insertId: null,
  rowsAffected: 0,
  ...args,
});

/**
 * @param  {Response} res
 * @param  {ResponseCommon} args?
 */
const sendResponseSuccess = (res, args) => {
  const response = {
    status: 200,
    success: true,
    message: "OK",
    ...args,
    results: initResponseResult(args?.results),
  };
  return res.status(response.status).json(response);
};

/**
 * @param  {Response} res
 * @param  {ResponseError} args?
 */
const sendResponseError = (res, args) => {
  const response = {
    status: 500,
    success: false,
    message: "Internal Server Error",
    errors: new Error(""),
    ...args,
  };
  return res.status(response.status).json(response);
};

module.exports = {
  getEnvironment,
  initResponseResult,
  sendResponseError,
  sendResponseSuccess,
};
