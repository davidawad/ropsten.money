import { Router } from "express";
import logger from "../utils/logger";
import { processPurchase } from "../models/purchase";
import { isAddress } from "../utils/ethAddrValidators";

const router = Router();

const DEFAULT_AMOUNT = 0.001;

router.post("/", async (req, res) => {
  logger.info("NEW PURCHASE REQUEST");

  logger.info(req.body);

  if (process.env.NODE_ENV === "production") {
    // check that the request is coming from the correct origin
    // if (req.headers.origin !== "https://cash.app") {
    //   return res.status(403).send("Forbidden");
    // }

    if (req.body.pw !== process.env.PASSWORD) {
      return res.status(403).send("Forbidden");
    }
  }

  if (!req.body.addr) {
    logger.error("Request rejected. no address provided");
    return res.status(400).send("Bad Request");
  }

  if (!isAddress(req.body.addr)) {
    logger.error(`Request rejected. ${req.body.addr} is not a valid address`);
    return res.status(400).send("Bad Request");
  }

  if (parseFloat(req.body.amount) <= 0) {
    logger.error("Request rejected. invalid amount");
    return res.status(400).send("Bad Request");
  }

  // validate the purchase with a temporary password

  // wallet to send the address to
  let pw = req.body.pw;
  let addr = req.body.addr;
  let amount = req.body.amount || DEFAULT_AMOUNT; // TODO default sample amount

  logger.info(`Processing purchase of ${amount} (r)ETH by ${addr}`);

  const ret = await processPurchase(addr, amount);

  // if ret === 1 {
  //   return res.status(200).send("Success");
  // } else if (ret === 2) {
  //   return res.status(200).send("Already exists");
  // } else {
  //   return res.status(500).send("Error");
  // }

  return res.send(ret);
});

export default router;
