// USAGE:
// Logger.error("This is an error log");
// Logger.warn("This is a warn log");
// Logger.info("This is a info log");
// Logger.http("This is a http log");
// Logger.debug("This is a debug log");

var winston = require("winston");

var levels = {
  error: 0,
  warn: 1,
  info: 2,
  http: 3,
  debug: 4,
};

var level = function () {
  var env = process.env.NODE_ENV || "development";
  var isDevelopment = env === "development";
  return isDevelopment ? "debug" : "warn";
};

var colors = {
  error: "red",
  warn: "yellow",
  info: "green",
  http: "magenta",
  debug: "white",
};

winston.addColors(colors);

const format = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss:ms" }),
  winston.format.colorize({ all: true }),
  winston.format.printf((info) => `${info.timestamp} ${info.level}: ${info.message}`),
);

var transports = [
  new winston.transports.Console(),
  new winston.transports.File({
    filename: "logs/error.log",
    level: "error",
  }),
  new winston.transports.File({ filename: "logs/all.log" }),
];

const logger = winston.createLogger({
  level: level(),
  levels: levels,
  format: format,
  transports: transports,
});

module.exports = logger;
