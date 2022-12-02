const { join } = require("path");
const dotenv = require("dotenv");
const { getEnvironment, sendResponseError } = require("./core/commonFuncs");
dotenv.config({
  path: join(process.cwd(), "env", `.env.${getEnvironment()}`),
});
const cors = require("cors");
const express = require("express");
const helmet = require("helmet");
const logger = require("morgan");
const routers = require("./main/routers");

const app = express();
const { PORT = 4001, NODE_ENV } = process.env;

/* Middleware */
app.use(cors());
app.use(
  helmet({
    contentSecurityPolicy: NODE_ENV === "production",
  })
);
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use("/public", express.static(process.cwd() + "/public"));

/* Routers */
app.use("/api", routers);

app.use((req, res, next) => {
  const status = 404;
  const errors = new Error("Not Found");
  next({ status, errors });
});

app.use((err, req, res, next) => {
  const { status = 500, errors = err } = err;
  const message = errors?.message || "Internal Server Error";
  return sendResponseError(res, { status, message, errors });
});

/* Listen Port */
app.listen(PORT, () =>
  console.log(`CDN is running at http://localhost:${PORT}/`)
);
