import { Router } from "express";
import logger from "../utils/logger";
import { processPurchase } from "../models/purchase";
import { isAddress } from "../utils/ethAddrValidators";

const router = Router();

router.get("/", async (req, res) => {
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

  logger.info(isAddress(req.body.addr));

  // if (!isAddress(req.body.addr)) {
  //   logger.error("Request rejected. invalid address");
  //   return res.status(400).send("Bad Request");
  // }

  if (parseFloat(req.body.amount) <= 0) {
    logger.error("Request rejected. invalid amount");
    return res.status(400).send("Bad Request");
  }

  // TODO send request to validate receipt, OR validate the purchase with a temporary password

  // wallet to send the address to
  let pw = req.body.pw;
  let addr = req.body.addr;
  let amount = req.body.amount || 0.001; // TODO default sample amount

  // TODO validate the args

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
