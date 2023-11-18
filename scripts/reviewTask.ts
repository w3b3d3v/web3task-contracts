import { ethers } from "hardhat";
import abi from "../artifacts/contracts/TasksManager.sol/TasksManager.json";

const { CONTRACT_ADDRESS } = process.env;

async function main() {
  const [signer] = await ethers.getSigners();
  const contract = new ethers.Contract(`${CONTRACT_ADDRESS}`, abi.abi, signer);

  await contract.reviewTask(8, 3, "Executed");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
