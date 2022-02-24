import { Router } from "express";
import logger from "../utils/logger";

const router = Router();

router.get("/", (req, res) => {
  logger.info("GET /health");

  const data = {
    uptime: process.uptime(),
    message: "Ok",
    date: new Date(),
  };

  res.status(200).send(data);
});

export default router;
