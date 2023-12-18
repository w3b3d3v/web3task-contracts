import { HardhatUserConfig } from "hardhat/config";
import "@nomicfoundation/hardhat-toolbox";
import dotenv from "dotenv";
dotenv.config();

const { POLYGON_URL, MUMBAI_URL, PRIVATE_KEY_LEADER, ETHERSCAN_KEY } =
    process.env;

const config: HardhatUserConfig = {
    solidity: {
        version: "0.8.20",
        settings: {
            optimizer: {
                enabled: true,
                runs: 200,
            },
        },
    },
    allowUnlimitedContractSize: true,
    networks: {
        hardhat: {
            chainId: 31337,
            forking: {
                url: `${POLYGON_URL}`,
                blockNumber: 38359528,
            },
        },
        mumbai: {
            url: `${MUMBAI_URL}`,
            accounts: [`${PRIVATE_KEY_LEADER}`],
        },
        polygon: {
            url: `${POLYGON_URL}`,
            accounts: [`${PRIVATE_KEY_LEADER}`],
        },
    },
    gasReporter: {
        enabled: true,
    },
    etherscan: {
        apiKey: `${ETHERSCAN_KEY}`,
    },
};

export default config;
