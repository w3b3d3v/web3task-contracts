import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  const taskFactory = (await ethers.getContractFactory("Web3Task")).deploy();

  console.log("Deploying the Web3Task contract with the address:", deployer.address);
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});