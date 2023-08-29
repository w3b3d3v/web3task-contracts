import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { expect } from "chai";

describe("Web3Task", function () {
  let Web3Task: Contract;
  let address;
  let owner: any;
  let userA: any;
  let userB: any;
  let leaderId = 5;
  let memberId = 10;

  before(async function () {
    [owner, userA, userB] = await ethers.getSigners();

    const factory: ContractFactory = await ethers.getContractFactory("Web3Task", owner);

    Web3Task = await factory.deploy();

    await Web3Task.deployed();

    address = Web3Task.address;
  });

  it("should create new authorizations { leader, member }", async function () {
    expect(await Web3Task.setAuthorization(leaderId, userA.address, true)).to.emit(Web3Task, "AuthorizedPersonnel").withArgs(leaderId, userA.address, true);
    expect(await Web3Task.setAuthorization(memberId, userB.address, true)).to.emit(Web3Task, "AuthorizedPersonnel").withArgs(memberId, userB.address, true);
  })

  it("should failed to create new authorizations { id = 1 }", async function () {
    await expect(Web3Task.setAuthorization(1, userA.address, true)).to.be.revertedWithCustomError(Web3Task, "InvalidAuthId");
  })

  it("should failed to create new authorizations { sender != owner }", async function () {
    await expect(Web3Task.connect(userA).setAuthorization(leaderId, userA.address, true)).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  })

  it("should create new operator { createTask }", async function () {
    let interfaceId = Web3Task.interface.getSighash('createTask');
    expect(await Web3Task.setOperator(interfaceId, leaderId, true)).to.emit(Web3Task, "AuthorizedOperator").withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  })

  it("should create new task", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: Math.floor(Date.now() / 1000) + 3600,
      authorized: [memberId],
      creator: leaderId,
      assignee: userB.address,
      metadata: "ipfs://0xc0/",
  };

  const tx = await Web3Task.connect(userA).createTask(Task);
  const receipt = await tx.wait();
  const taskId = receipt.events[0].args[0];

  const task = await Web3Task.getTask(taskId);
  console.log(task);
  })
});