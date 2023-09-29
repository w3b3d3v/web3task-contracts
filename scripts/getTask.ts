import { ethers } from "hardhat";
import abi from "../artifacts/contracts/Web3Task.sol/Web3Task.json"

async function main() {
    const [signer] = await ethers.getSigners();

    const contract = new ethers.Contract("0xec20dcbf0380f1c9856ee345af41f62ee45a95a1", abi.abi, signer);

    const getTaskResponse = await contract.getTask(0);


    console.log('GetTaskResponse = ', getTaskResponse);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
