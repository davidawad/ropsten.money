import "dotenv/config";

const process = require("process");
// const { readJson } = require("../src/utils/utils");
const logger = require("../utils/logger");

import { transferFunds } from "../utils/sendRopsten.js";

// sample items
const sourceAddr = { address: process.env.PUBLIC_KEY, privateKey: process.env.PRIVATE_KEY };

// test destination address, primary dev wallet
const destAddr = { address: "0x6b8D111d0BDD8dEC5fbB0aB78f0a0dc46e05dEf9" };
const amount = 0.001;

async function main() {
  try {
    // let configpath = process.argv[2] ? process.argv[2] : process.env.CONFIG_PATH;
    // logger.info("Minting a collection using " + configpath);

    // const settings = await readJson(configpath);
    // const paths = configpath.split("/");
    // const collectionId = paths[paths.length - 2];

    logger.info(`Transferring ${amount} ETH from ${sourceAddr.address} to ${destAddr.address}`);

    // TODO make this dynamic, but for now just do it manually for testing
    await transferFunds(sourceAddr, destAddr, amount);
  } catch (err) {
    logger.error(err);
  }
}

main();
