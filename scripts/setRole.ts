import { ethers } from "hardhat";
import abi from "../artifacts/contracts/TasksManager.sol/TasksManager.json";

const { CONTRACT_ADDRESS } = process.env;

async function main() {
    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(
        `${CONTRACT_ADDRESS}`,
        abi.abi,
        signer
    );

    await contract.setRole(
        5,
        "0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266",
        true,
        {
            maxPriorityFeePerGas: 200000000000,
            maxFeePerGas: 200000000000,
        }
    );

    await contract.setRole(
        10,
        "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
        true,
        {
            maxPriorityFeePerGas: 200000000000,
            maxFeePerGas: 200000000000,
        }
    );
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
