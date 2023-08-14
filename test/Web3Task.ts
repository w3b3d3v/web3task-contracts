import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { expect } from "chai";

describe("Web3Task", function () {
  let contract: Contract;

  beforeEach(async function () {
    const factory: ContractFactory = await ethers.getContractFactory("Web3Task");
    contract = await factory.deploy("Web3Task", "W3BTASK");
    await contract.deployed();
  });

  it("should mint a new NFT", async function () {
    const [owner, addr1] = await ethers.getSigners();

    // Check the token ID before minting
    const tokenIdBeforeMint = await contract.nextTokenId();
    expect(tokenIdBeforeMint).to.equal(1);

    // Mint a new NFT
    await contract.connect(owner).mint(addr1.address);

    // Check the token ID after minting
    const tokenIdAfterMint = await contract.nextTokenId();
    expect(tokenIdAfterMint).to.equal(2);

    // Check if the token belongs to the minted address
    const ownerOfToken = await contract.ownerOf(1);
    expect(ownerOfToken).to.equal(addr1.address);
  });
});