import logger from "./logger";
import axios from "axios";
import Web3 from "web3";

const EthereumTx = require("ethereumjs-tx").Transaction;

const ethNetwork = process.env.ALCHEMY_ROPSTEN_URL;
const web3 = new Web3(new Web3.providers.HttpProvider(ethNetwork));

const chainToId = {
  mainnet: 1,
  morden: 2,
  ropsten: 3,
  rinkeby: 4,
  kovan: 42,
};

export const transferFunds = async (sendersData, recieverData, amountToSend) => {
  return new Promise(async (resolve, reject) => {
    var nonce = await web3.eth.getTransactionCount(sendersData.address);

    web3.eth.getBalance(sendersData.address, async (err, result) => {
      if (err) {
        return reject();
      }

      let balance = web3.utils.fromWei(result, "ether");

      logger.info(`Wallet ${sendersData.address} has balance of ${balance} ETH`);

      if (balance < amountToSend) {
        logger.error("insufficient funds");
        return reject();
      }

      let gasPrices = await getCurrentGasPrices();

      let details = {
        to: recieverData.address,
        value: web3.utils.toHex(web3.utils.toWei(amountToSend.toString(), "ether")),
        gas: 21000,
        gasPrice: gasPrices.low * 1000000000,
        nonce: nonce,
        chainId: chainToId["ropsten"], // EIP 155 chainId - mainnet: 1, rinkeby: 4
      };

      logger.info("Sending transaction");
      logger.info(details);

      const transaction = new EthereumTx(details, { chain: "ropsten" });

      logger.info("using private key " + sendersData.privateKey);

      let privKey = Buffer.from(sendersData.privateKey, "hex");

      logger.info("signing transaction");

      transaction.sign(privKey);

      logger.info("serializing transaction");
      const serializedTransaction = transaction.serialize();

      web3.eth.sendSignedTransaction("0x" + serializedTransaction.toString("hex"), (err, id) => {
        if (err) {
          logger.error(err);
          return reject();
        }

        resolve({ id: id, link: process.env.ALCHEMY_ROPSTEN_URL });
      });
    });
  });
};

export async function getCurrentGasPrices() {
  let response = await axios.get("https://ethgasstation.info/json/ethgasAPI.json");
  let prices = {
    low: response.data.safeLow / 10,
    medium: response.data.average / 10,
    high: response.data.fast / 10,
  };
  return prices;
}

export async function getBalance(address) {
  return new Promise((resolve, reject) => {
    web3.eth.getBalance(address, async (err, result) => {
      if (err) {
        return reject(err);
      }
      resolve(web3.utils.fromWei(result, "ether"));
    });
  });
}

// transferFund({address: '0x0xxx00000000xx00x0', privateKey: '1x11111111'},{address: '0x0xxx000000000000x00x0x0'},0.10)
