import { ethers } from "hardhat";
import abi from "../artifacts/contracts/Web3Task.sol/Web3Task.json"

const { CONTRACT_ADDRESS } = process.env;

async function main() {
    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(`${CONTRACT_ADDRESS}`, abi.abi, signer);
    const getTaskResponse = await contract.getTask(1);
    console.log('GetTaskResponse = ', getTaskResponse);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});