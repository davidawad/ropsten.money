import { Router } from "express";
import web3 from "web3";
import logger from "../utils/logger";
import { processPurchase } from "../models/purchase";

const router = Router();

const DEFAULT_AMOUNT = 0.001;

router.post("/", async (req, res) => {
  logger.info(`Request from ${req.headers.origin}`);

  logger.info(req.body);

  let addr = req.body["Your (rETH) address"];
  let amount = 10; // user bought 10 rETH

  logger.info(`Purchase to wallet ${addr} for ${amount} (rETH)`);

  if (process.env.NODE_ENV === "production") {
    // check that the request is coming from the correct origin
    if (req.headers.origin !== "https://gumroad.com") {
      return res.status(403).send("Forbidden");
    }

    // verify password
    // if (req.body.pw !== process.env.PASSWORD) {
    //   return res.status(403).send("Forbidden");
    // }
  }

  // verify gumroad seller id as a "loose password"
  if (req.body["seller_id"] !== process.env.GUMROAD_SELLER_ID) {
    logger.error("Request rejected. Seller id not provided");
    return res.status(403).send("Forbidden");
  }

  if (!addr) {
    logger.error("Request rejected. No address provided");
    return res.status(400).send("Bad Request");
  }

  if (!web3.utils.isAddress(addr)) {
    logger.error(`Request rejected. ${addr} is not a valid address`);
    return res.status(400).send("Bad Request");
  }

  if (amount <= 0) {
    logger.error("Request rejected. invalid amount");
    return res.status(400).send("Bad Request");
  }

  logger.info(`Processing purchase of ${amount} (r)ETH by ${addr}`);

  const ret = await processPurchase(addr, amount);

  return res.send(ret);
});

export default router;
