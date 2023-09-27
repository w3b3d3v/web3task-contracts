import { ethers } from "hardhat";
import abi from "../artifacts/contracts/TasksManager.sol/TasksManager.json"

async function main() {
    const [signer] = await ethers.getSigners();

    const contract = new ethers.Contract("0xec20dcbf0380f1c9856ee345af41f62ee45a95a1", abi.abi, signer);

    const payloadArray = [];
    for (var i = 1; i < 20; i++) {
        payloadArray.push(contract.interface.encodeFunctionData('getTask', [i]));
    }

    const result = await contract.multicall(payloadArray);

    console.log('result', result);

}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
