// import logger from "../utils/logger";
// TODO import

import logger from "../utils/logger";
import { transferFunds } from "../utils/sendRopsten";

// usage
// transferFund({address: '0x0xxx00000000xx00x0', privateKey: '1x11111111'},{address: '0x0xxx000000000000x00x0x0'}, 0.10)

export const processPurchase = async (addr, amount) => {
  let ret = {};

  const sourceAddr = { address: process.env.PUBLIC_KEY, privateKey: process.env.PRIVATE_KEY };
  const destAddr = { address: addr };

  ret = await transferFunds(sourceAddr, destAddr, amount);
  return ret;
};
