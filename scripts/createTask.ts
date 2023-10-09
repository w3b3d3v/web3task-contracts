import { ethers } from "hardhat";
import abi from "../artifacts/contracts/TasksManager.sol/TasksManager.json"

const { CONTRACT_ADDRESS } = process.env;

function generateRandomReward(): string {
    const minReward = 0.00001;
    const maxReward = 0.001;

    const reward = minReward + Math.random() * (maxReward - minReward);
    return reward.toFixed(6);
}

async function main() {
    const [signer] = await ethers.getSigners();
    const contract = new ethers.Contract(`${CONTRACT_ADDRESS}`, abi.abi, signer);

    for (let i = 0; i <= 50; i++) {
        const Task = {
            status: 0,
            title: `Create page ${i}`,
            description: `Create page ${i}`,
            reward: ethers.utils.parseEther(generateRandomReward()),
            endDate: ethers.constants.MaxUint256,
            authorizedRoles: [66, 3],
            creatorRole: 99,
            assignee: "0xa607c9d1913009356E2Eb97D0c526e7c0A5a86a4",
            metadata: "ipfs://0xc0/",
        };

        await contract.createTask(Task, {
            maxPriorityFeePerGas: 200000000000,
            maxFeePerGas: 200000000000
        });
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});