import { Router } from "express";
import logger from "../utils/logger";
import { processPurchase } from "../models/purchase";

const router = Router();

router.get("/", async (req, res) => {
  if (process.env.NODE_ENV === "production") {
    // check that the request is coming from the correct origin
    // if (req.headers.origin !== "https://cash.app") {
    //   return res.status(403).send("Forbidden");
    // }
  }

  // TODO send request to validate receipt, OR validate the purchase with a temporary password

  // wallet to send the address to
  let addr = req.params.addr;
  let amount = req.params.amount || 0.001; // TODO default sample amount

  // TODO validate the args

  logger.info(`Processing purchase for ${addr} for ${amount} ETH`);

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
