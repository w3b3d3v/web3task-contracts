import { ethers } from "hardhat";
import { saveContractAddress, saveFrontendFiles } from "../utils/saveDataContract"

async function main() {
	const [deployer] = await ethers.getSigners();
	const Factory = await ethers.getContractFactory("TasksManager", deployer);
	// const Contract = await Factory.deploy({
	// 	gasLimit: 10000000,
	// 	maxPriorityFeePerGas: 200000000000,
	// 	maxFeePerGas: 200000000000,
	// });

	const Contract = await Factory.deploy();

	const chain = await deployer.getChainId();
	saveFrontendFiles(Contract, chain)

	console.log(
		"Deploying the Web3Task contract with the address:",
		deployer.address
	);

	saveContractAddress(Contract.address)

	console.log("Contract deployed to:", Contract.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});