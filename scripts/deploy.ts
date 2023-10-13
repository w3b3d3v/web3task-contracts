import { ethers } from "hardhat";
import { saveFrontendFiles } from "../utils/AbiToFrontend"
const fs = require('fs');
const path = require('path');
const filePath = path.join(__dirname, '../.env');

async function main() {
	const [deployer] = await ethers.getSigners();
	const Factory = await ethers.getContractFactory("TasksManager", deployer);
	const Contract = await Factory.deploy({
		gasLimit: 10000000,
		maxPriorityFeePerGas: 200000000000,
		maxFeePerGas: 200000000000,
	});

	const chain = await deployer.getChainId();
	saveFrontendFiles(Contract, chain)

	console.log(
		"Deploying the Web3Task contract with the address:",
		deployer.address
	);

	fs.readFile(filePath, 'utf8', (_, data) => {
		const newContent = data.replace(new RegExp("CONTRACT_ADDRESS=.*"), `CONTRACT_ADDRESS=${Contract.address}`);
		fs.writeFile(filePath, newContent, 'utf8', _ => { });
	});

	console.log("Contract deployed to:", Contract.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
