import { ethers } from "hardhat";

async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying the NFT contract with the address:", deployer.address);

  const MyNFT = await ethers.getContractFactory("Web3Task");
  const myNFT = await MyNFT.deploy("Web3Task", "W3BTASK");

  console.log("NFT contract deployed with the address:", myNFT.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });