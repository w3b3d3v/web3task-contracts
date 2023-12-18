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

    var sigHash = contract.interface.getSighash("createTask");
    await contract.setOperator(sigHash, 5, true, {
        maxPriorityFeePerGas: 200000000000,
        maxFeePerGas: 200000000000,
    });

    var sigHash = contract.interface.getSighash("startTask");
    await contract.setOperator(sigHash, 10, true, {
        maxPriorityFeePerGas: 200000000000,
        maxFeePerGas: 200000000000,
    });

    var sigHash = contract.interface.getSighash("reviewTask");
    await contract.setOperator(sigHash, 5, true, {
        maxPriorityFeePerGas: 200000000000,
        maxFeePerGas: 200000000000,
    });

    var sigHash = contract.interface.getSighash("reviewTask");
    await contract.setOperator(sigHash, 10, true, {
        maxPriorityFeePerGas: 200000000000,
        maxFeePerGas: 200000000000,
    });

    var sigHash = contract.interface.getSighash("completeTask");
    await contract.setOperator(sigHash, 5, true, {
        maxPriorityFeePerGas: 200000000000,
        maxFeePerGas: 200000000000,
    });

    var sigHash = contract.interface.getSighash("cancelTask");
    await contract.setOperator(sigHash, 5, true, {
        maxPriorityFeePerGas: 200000000000,
        maxFeePerGas: 200000000000,
    });
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});
