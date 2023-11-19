import { ethers } from "hardhat";
import { dateNowToUnixTimestamp } from "./utils";
import abi from "../artifacts/contracts/TasksManager.sol/TasksManager.json";

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

	const currentTimeStamp = await dateNowToUnixTimestamp();

	for (let i = 0; i <= 2; i++) {
		const Task = {
			status: 0,
			title: `Task ${i + 1}`,
			description: `This is the task of id: ${i + 1}`,
			reward: ethers.utils.parseEther(generateRandomReward()),
			endDate: Number(currentTimeStamp) + 86400,
			authorizedRoles: [5, 10],
			creatorRole: 5,
			assignee: "0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
			metadata:
				"https://ipfs.io/ipfs/QmY5DnoeR8KvFQbf2swJcSZrBfXo4icnMuzrjGvj6q7CEh",
		};

		await contract.createTask(Task);
	}
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
