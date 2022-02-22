import "dotenv/config";

import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";

import logger from "./utils/logger";
import morganMiddleware from "./utils/morganMiddleware";
import routes from "./routes";

// sensible defaults
const HOST = process.env.HOST || "localhost";
const PORT = process.env.PORT || 8888;
const NODE_ENV = process.env.NODE_ENV || "development";

const app = express();

// * Application-Level Middleware * //

// Third-Party Middleware

app.use(cors()); // cross origin resource sharing
app.use(helmet()); // add request headers to protect against common vulnerabilities
app.use(compression()); //Compress all routes

// Built-In Middleware

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Custom Middleware
app.use(morganMiddleware);

app.use((req, res, next) => {
  req.context = {};
  next();
});

// * Routes * //

app.use(routes);

// * Start * //

app.listen(PORT, () => {
  logger.info(`Starting the cash server in ${NODE_ENV} mode on ${HOST}:${PORT}`);
});
