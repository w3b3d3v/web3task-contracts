import { ethers } from "hardhat";

async function main() {
	const [deployer] = await ethers.getSigners();

	const Factory = await ethers.getContractFactory("TasksManager", deployer);

	const Contract = await Factory.deploy({
		gasLimit: 10000000,
		maxPriorityFeePerGas: 200000000000,
		maxFeePerGas: 200000000000,
	});

	console.log(
		"Deploying the Web3Task contract with the address:",
		deployer.address
	);

	console.log("Contract deployed to:", Contract.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
