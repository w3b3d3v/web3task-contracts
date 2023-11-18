import { ethers } from "hardhat";
import abi from "../artifacts/contracts/TasksManager.sol/TasksManager.json";

const { CONTRACT_ADDRESS } = process.env;

async function main() {
	const [signer] = await ethers.getSigners();
	const contract = new ethers.Contract(`${CONTRACT_ADDRESS}`, abi.abi, signer);

	await contract.setRole(
		5,
		"0x8626f6940E2eb28930eFb4CeF49B2d1F2C9C1199",
		true
	);

	// await contract.setRole(
	// 	10,
	// 	"0x70997970C51812dc3A010C7d01b50e0d17dc79C8",
	// 	true
	// );
}

main().catch((error) => {
	console.error(error);
	process.exitCode = 1;
});
