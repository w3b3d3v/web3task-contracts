import { ethers } from "hardhat";
import abi from "../artifacts/contracts/Web3Task.sol/Web3Task.json";

const { CONTRACT_ADDRESS } = process.env;

async function main() {
	const [signer] = await ethers.getSigners();
	const contract = new ethers.Contract(`${CONTRACT_ADDRESS}`, abi.abi, signer);

	await contract.deposit(5, {
		value: ethers.utils.parseEther("5"),
		maxPriorityFeePerGas: 200000000000,
		maxFeePerGas: 200000000000,
	});
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
