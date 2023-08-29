import { HardhatUserConfig } from "hardhat/config";
import dotenv from "dotenv";
import "@nomicfoundation/hardhat-toolbox";
import "@nomicfoundation/hardhat-chai-matchers";
import "hardhat-gas-reporter";

dotenv.config();
const { POLYGON_URL, MUMBAI_URL, PRIVATE_KEY, ETHERSCAN_KEY } = process.env;

const config: HardhatUserConfig = {
  solidity: "0.8.19",
  networks: {
    hardhat: {
      chainId: 137,
      forking: {
        url: `${POLYGON_URL}`,
        blockNumber: 38359528
      }
    },
    mumbai: {
      url: `${MUMBAI_URL}`,
      accounts: [`${PRIVATE_KEY}`]
    }
  },
  gasReporter: {
    enabled: true,
  },
  etherscan: {
    apiKey: `${ETHERSCAN_KEY}`
  }
};

export default config;