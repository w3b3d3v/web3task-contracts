import { ethers } from "hardhat";
import { Contract, ContractFactory } from "ethers";
import { expect } from "chai";

describe("Web3Task", function () {
  let Web3Task: Contract;
  let address;
  let owner: any;
  let userA: any;
  let userB: any;
  let userC: any;
  let leaderId = 5;
  let memberId = 10;
  let createdTaskId: any;
  const taskTitle = "123";
  const taskDescription = "123";

  enum Status {
    Created,
    Progress,
    Review,
    Completed,
    Canceled,
  }

  before(async function () {
    [owner, userA, userB, userC] = await ethers.getSigners();

    const factory: ContractFactory = await ethers.getContractFactory(
      "TasksManager",
      owner
    );

    Web3Task = await factory.deploy();

    await Web3Task.deployed();

    address = Web3Task.address;
  });

  it("should set the minimum quorum to 2", async function () {
    await Web3Task.connect(owner).setMinQuorum(2);
    expect(await Web3Task.APPROVALS()).to.equal(2);
  });

  it("should fund the authorizationId (Role) {leader = 5}", async function () {
    await Web3Task.connect(owner).deposit(leaderId, {
      value: ethers.utils.parseEther("10"),
    });
  });

  it("should fund the authorizationId (Role) {memberId = 10}", async function () {
    await Web3Task.connect(owner).deposit(memberId, {
      value: ethers.utils.parseEther("50"),
    });
  });

  it("should set owner as withdraw operator, then withdraw from it", async function () {
    await Web3Task.connect(owner).setOperator(
      Web3Task.interface.getSighash("withdraw"),
      leaderId,
      true
    );

    expect(
      await Web3Task.connect(owner).withdraw(
        leaderId,
        ethers.utils.parseEther("0.1")
      )
    )
      .to.emit(Web3Task, "Withdraw")
      .withArgs(leaderId, owner.address, ethers.utils.parseEther("0.1"));
  });

  it("should create new authorizations { leader, member }", async function () {
    expect(await Web3Task.setRole(leaderId, userA.address, true))
      .to.emit(Web3Task, "AuthorizePersonnel")
      .withArgs(leaderId, userA.address, true);
    expect(await Web3Task.setRole(leaderId, userB.address, true))
      .to.emit(Web3Task, "AuthorizePersonnel")
      .withArgs(leaderId, userB.address, true);
    expect(await Web3Task.setRole(memberId, userC.address, true))
      .to.emit(Web3Task, "AuthorizePersonnel")
      .withArgs(memberId, userC.address, true);
  });

  it("should fail to create new authorizations { id = 0 }", async function () {
    await expect(
      Web3Task.setRole(0, userA.address, true)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidRoleId");
  });

  it("should fail to create new operator { id = 1 }", async function () {
    let interfaceId = Web3Task.interface.getSighash("createTask");
    expect(
      await Web3Task.setOperator(interfaceId, leaderId, true)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidRoleId");
  });

  it("should fail to create new authorizations { sender != owner }", async function () {
    await expect(
      Web3Task.connect(userA).setRole(leaderId, userA.address, true)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  it("should create new operator { createTask }", async function () {
    let interfaceId = Web3Task.interface.getSighash("createTask");
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should create new operator { startTask }", async function () {
    let interfaceId = Web3Task.interface.getSighash("startTask");
    await expect(await Web3Task.setOperator(interfaceId, memberId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, memberId, true);
    expect(await Web3Task.isOperator(interfaceId, memberId)).to.be.equal(true);
  });

  it("should create new operator { reviewTask }", async function () {
    let interfaceId = Web3Task.interface.getSighash("reviewTask");
    expect(await Web3Task.setOperator(interfaceId, memberId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, memberId, true);
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, memberId)).to.be.equal(true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should create new operator { completeTask }", async function () {
    let interfaceId = Web3Task.interface.getSighash("completeTask");
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should create new operator { cancelTask }", async function () {
    let interfaceId = Web3Task.interface.getSighash("cancelTask");
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should create new operator { setTitle }", async function () {
    let interfaceId = Web3Task.interface.getSighash("setTitle");
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should create new operator { setDescription }", async function () {
    let interfaceId = Web3Task.interface.getSighash("setDescription");
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should create new operator { setEndDate }", async function () {
    let interfaceId = Web3Task.interface.getSighash("setEndDate");
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should create new operator { setMetadata }", async function () {
    let interfaceId = Web3Task.interface.getSighash("setMetadata");
    expect(await Web3Task.setOperator(interfaceId, leaderId, true))
      .to.emit(Web3Task, "AuthorizeOperator")
      .withArgs(interfaceId, leaderId, true);
    expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
  });

  it("should fail to create new operator { sender != owner }", async function () {
    let interfaceId = Web3Task.interface.getSighash("createTask");
    await expect(
      Web3Task.connect(userA).setOperator(interfaceId, leaderId, true)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  it("should create new task", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userC.address,
      metadata: "ipfs://0xc0/",
    };

    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];

    createdTaskId = taskId;

    const task = await Web3Task.getTask(taskId);
    expect(Task.title).equal(task.title);
  });

  it("should fail to create new task (unauthorized user - userC)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userB.address,
      metadata: "ipfs://0xc0/",
    };

    await expect(
      Web3Task.connect(userC).createTask(Task)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  it("should fail to create new task (invalid leaderId)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: 200,
      assignee: userB.address,
      metadata: "ipfs://0xc0/",
    };

    await expect(
      Web3Task.connect(userA).createTask(Task)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  it("should fail to create new task (invalid status -  Progress (1))", async function () {
    const Task = {
      status: 1,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userB.address,
      metadata: "ipfs://0xc0/",
    };

    await expect(
      Web3Task.connect(userA).createTask(Task)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidStatus");
  });

  it("should fail to create new task (invalid end date)", async function () {
    const expiredDate = (await ethers.provider.getBlock("latest")).timestamp;

    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: expiredDate - 1,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userB.address,
      metadata: "ipfs://0xc0/",
    };

    await expect(
      Web3Task.connect(userA).createTask(Task)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidEndDate");
  });

  it("should set title", async function () {
    expect(await Web3Task.connect(userA).setTitle(createdTaskId, taskTitle))
      .to.emit(Web3Task, "TitleUpdated")
      .withArgs(createdTaskId, taskTitle);
    const task = await Web3Task.getTask(createdTaskId);
    expect(task.title).to.equal(taskTitle);
  });

  it("should set description", async function () {
    expect(
      await Web3Task.connect(userA).setDescription(
        createdTaskId,
        taskDescription
      )
    )
      .to.emit(Web3Task, "TitleUpdated")
      .withArgs(createdTaskId, taskDescription);
    const task = await Web3Task.getTask(createdTaskId);
    expect(task.description).to.equal(taskDescription);
  });

  it("should set endDate", async function () {
    const targetDate = Math.floor(Date.now() / 1000) + 3600;
    expect(await Web3Task.connect(userA).setEndDate(createdTaskId, targetDate))
      .to.emit(Web3Task, "TitleUpdated")
      .withArgs(createdTaskId, targetDate);
    const task = await Web3Task.getTask(createdTaskId);
    expect(task.endDate).to.equal(targetDate);
  });

  it("should set metadata", async function () {
    expect(await Web3Task.connect(userA).setTitle(createdTaskId, taskTitle))
      .to.emit(Web3Task, "MetadataUpdated")
      .withArgs(createdTaskId, taskTitle);
    const task = await Web3Task.getTask(createdTaskId);
    expect(task.title).to.equal(taskTitle);
  });

  it("should start task", async function () {
    expect(await Web3Task.connect(userC).startTask(createdTaskId, memberId))
      .to.emit(Web3Task, "TaskStarted")
      .withArgs(createdTaskId, userC.address);
    const task = await Web3Task.getTask(createdTaskId);
    expect(task.status).to.equal(Status.Progress);
  });

  it("should review task", async function () {
    const task2 = await Web3Task.getTask(createdTaskId);
    expect(task2.assignee == userC.address).to.equal(true);
    expect(
      await Web3Task.connect(userC).reviewTask(
        createdTaskId,
        memberId,
        "ipfs link"
      )
    )
      .to.emit(Web3Task, "TaskUpdated")
      .withArgs(createdTaskId, Status.Review);

    // Leaders can also call review to place a note during
    // the task review process. This is supposed to ping pong
    // between the leader and the assignee until the task is
    // completed.
    expect(
      await Web3Task.connect(userB).reviewTask(
        createdTaskId,
        leaderId,
        "ipfs link"
      )
    )
      .to.emit(Web3Task, "TaskUpdated")
      .withArgs(createdTaskId, Status.Review);

    const task = await Web3Task.getTask(createdTaskId);
    expect(task.status).to.equal(Status.Review);
  });

  it("should complete task ", async function () {
    expect(await Web3Task.connect(userA).completeTask(createdTaskId, leaderId))
      .to.be.ok;
    expect(await Web3Task.connect(userB).completeTask(createdTaskId, leaderId))
      .to.emit(Web3Task, "TaskUpdated")
      .withArgs(createdTaskId, Status.Completed);

    const task = await Web3Task.getTask(createdTaskId);
    expect(task.status).to.equal(Status.Completed);
  });

  it("should cancel task", async function () {
    expect(await Web3Task.connect(userA).cancelTask(createdTaskId, leaderId))
      .to.emit(Web3Task, "TaskUpdated")
      .withArgs(createdTaskId, Status.Canceled);
  });

  it("should set title failure", async function () {
    await expect(Web3Task.connect(userA).setTitle(createdTaskId, taskTitle))
      .to.be.revertedWithCustomError(Web3Task, "TaskCannotBeChanged")
      .withArgs(createdTaskId, Status.Canceled);
  });

  //New-test - Testing setting minQuorum with no owner
  it("should fail to set  the minimum quorum when the caller is not the owner", async function () {
    const initialQuorum = 2;
    const newValue = 5;
    await expect(
      Web3Task.connect(userA).setMinQuorum(newValue)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
    const currentQuorum = await Web3Task.APPROVALS();
    expect(currentQuorum).to.equal(initialQuorum);
  });

  //New-test - Testing setting minQuorum with zero or negative value
  it("should fail when a negative value is set for the minimum quorum", async function () {
    await expect(Web3Task.connect(owner).setMinQuorum(-2)).to.be.rejected;
  });

  //New-test - Testing creating a task with an invalid status (1 - 4)
  it("should falied to create new task ( invalid status - Progress (1), Review (2), Completed (3), Canceled (4) )", async function () {
    const invalidStatuses = [1, 2, 3, 4];
    for (const status of invalidStatuses) {
      const Task = {
        status: status,
        title: "Invalid status task",
        description: "Não esquecer",
        reward: ethers.utils.parseEther("1"),
        endDate: ethers.constants.MaxUint256,
        authorizedRoles: [memberId],
        creatorRole: leaderId,
        assignee: userC.address,
        metadata: "ipfs://0xc0/",
      };
      await expect(
        Web3Task.connect(userA).createTask(Task)
      ).to.be.revertedWithCustomError(Web3Task, "InvalidStatus");
    }
  });

  //New-test - Testing creating two tasks with the same parameters to return different IDs
  it("should create a new task with the same parameters as different tasks, not duplicate", async function () {
    const Task = {
      status: 0,
      title: "Task with same parameters",
      description: "Task description",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userC.address,
      metadata: "ipfs://0xc0/",
    };

    let tx = await Web3Task.connect(userA).createTask(Task);
    let receipt = await tx.wait();
    let firstTaskId = receipt.events[0].args[0];

    tx = await Web3Task.connect(userA).createTask(Task);
    receipt = await tx.wait();
    let secondTaskId = receipt.events[0].args[0];

    expect(firstTaskId).to.not.equal(secondTaskId);
  });

  //New-test - Testing creating a task with an invalid reward (0)
  it("should fail to create a new task (invalid reward - 0)", async function () {
    const Task = {
      status: 0,
      title: "invalid reward",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("0"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userB.address,
      metadata: "ipfs://0xc0/",
    };
    await expect(
      Web3Task.connect(userA).createTask(Task)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidReward");
  });

  //New-test - Testing creating a task with an invalid reward (negative value)
  it("should fail to create new task (invalid reward - negative value)", async function () {
    const Task = {
      status: 0,
      title: "invalid reward",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("-2"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userB.address,
      metadata: "ipfs://0xc0/",
    };
    await expect(Web3Task.connect(userA).createTask(Task)).to.be.rejected;
  });

  //New-test - Testing creating a task with an invalid reward (greater than the balance)
  it("should fail to create a task with a reward greater than the balance", async function () {
    const Task = {
      status: 0,
      title: "Task with high reward",
      description: "Task description",
      reward: ethers.utils.parseEther("200"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userC.address,
      metadata: "ipfs://0xc0/",
    };
    await expect(
      Web3Task.connect(userA).createTask(Task)
    ).to.be.revertedWithCustomError(Web3Task, "InsufficientBalance");
  });

  //Net-Test - Testing creating a task with an unautorized user
  it("should fail to start a task (unauthorized user)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("startTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);

    await expect(
      Web3Task.connect(userB).startTask(createdTaskId, leaderId)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  //New-Test - Testing starting a task with an invalid status
  it("should fail to start a task (Invalid Status)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("startTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);

    Web3Task.connect(userA).startTask(createdTaskId, leaderId);

    await expect(
      Web3Task.connect(userA).startTask(createdTaskId, leaderId)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidStatus");
  });

  //New-Test - Testing starting a task with an invalid roleId
  it("should fail to start a task (invalid roleId)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    await expect(
      Web3Task.connect(userA).startTask(createdTaskId, memberId)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  //New-test - Testing starting a task with an invalid assignee
  it("should set msg.sender as the task assignee when starting a task", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: ethers.constants.AddressZero,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("startTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);

    await Web3Task.connect(userA).startTask(createdTaskId, leaderId);

    const task = await Web3Task.getTask(createdTaskId);
    expect(task.assignee).to.equal(userA.address);
  });

  //New-test - Testing to review a task with a unauthorized user
  it("should fail to review a task (Unauthorized User)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("startTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);
    await Web3Task.connect(userA).startTask(createdTaskId, leaderId);

    interfaceId = Web3Task.interface.getSighash("reviewTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);

    await expect(
      Web3Task.connect(userB).reviewTask(
        createdTaskId,
        memberId,
        "Should fail to review this task"
      )
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  it("should fail to review a task (InvalidStatus)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("reviewTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);

    await expect(
      Web3Task.connect(userA).reviewTask(
        createdTaskId,
        leaderId,
        "ipfs://0xc1/"
      )
    ).to.be.revertedWithCustomError(Web3Task, "InvalidStatus");
  });

  it("should fail to complete a task (InvalidStatus)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("completeTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);

    await expect(
      Web3Task.connect(userA).completeTask(createdTaskId, leaderId)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidStatus");
  });

  it("should fail to complete a task (Unauthorized)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("startTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);
    await Web3Task.connect(userA).startTask(createdTaskId, leaderId);

    interfaceId = Web3Task.interface.getSighash("reviewTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);
    await Web3Task.connect(userA).reviewTask(
      createdTaskId,
      leaderId,
      "ipfs://0xc1/"
    );
    interfaceId = Web3Task.interface.getSighash("completeTask");
    await Web3Task.connect(owner).setOperator(interfaceId, memberId, true);

    await expect(
      Web3Task.connect(userA).completeTask(createdTaskId, memberId)
    ).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
  });

  it("should fail to complete a task (AlreadyVoted)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;
    let interfaceId = Web3Task.interface.getSighash("startTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);
    await Web3Task.connect(userA).startTask(createdTaskId, leaderId);
    interfaceId = Web3Task.interface.getSighash("reviewTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);
    await Web3Task.connect(userA).reviewTask(
      createdTaskId,
      leaderId,
      "ipfs://0xc1/"
    );
    interfaceId = Web3Task.interface.getSighash("completeTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);
    await Web3Task.connect(userA).completeTask(createdTaskId, leaderId);

    await expect(
      Web3Task.connect(userA).completeTask(createdTaskId, leaderId)
    ).to.be.revertedWithCustomError(Web3Task, "AlreadyVoted");
  });

  it("should fail to cancel a task (InvalidStatus)", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    let interfaceId = Web3Task.interface.getSighash("cancelTask");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);
    await Web3Task.connect(userA).cancelTask(createdTaskId, leaderId);

    await expect(
      Web3Task.connect(userA).cancelTask(createdTaskId, leaderId)
    ).to.be.revertedWithCustomError(Web3Task, "InvalidStatus");
  });

  it("should set task status to Canceled if endDate has passed", async function () {
    // Get the current block timestamp
    const latestBlock = await ethers.provider.getBlock("latest");
    const currentBlockTimeStamp = latestBlock.timestamp;

    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: currentBlockTimeStamp + 3600,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };
    const tx = await Web3Task.connect(userA).createTask(Task);
    const receipt = await tx.wait();
    const taskId = receipt.events[0].args[0];
    createdTaskId = taskId;

    const task = await Web3Task.getTask(createdTaskId);

    // Advance the block timestamp by 2 hours to make the task's endDate pass
    await ethers.provider.send("evm_increaseTime", [7200]);
    await ethers.provider.send("evm_mine", []); // Mine a new block to apply the time increase

    const updatedTask = await Web3Task.getTask(createdTaskId);

    expect(updatedTask.status).to.equal(Status.Canceled);
  });

  it("should return the count of tasks for a user", async function () {
    const Task = {
      status: 0,
      title: "Pagar membros do PodLabs",
      description: "Não esquecer",
      reward: ethers.utils.parseEther("1"),
      endDate: ethers.constants.MaxUint256,
      authorizedRoles: [memberId, leaderId],
      creatorRole: leaderId,
      assignee: userA.address,
      metadata: "ipfs://0xc0/",
    };

    // Get the initial count of tasks for userA
    const initialTasks = await Web3Task.getUserTasks(userA.address);
    const initialCount = initialTasks.length;

    // Create 3 tasks with userA's address
    for (let i = 0; i < 3; i++) {
      await Web3Task.connect(userA).createTask(Task);
    }

    // Get the final count of tasks for userA
    const finalTasks = await Web3Task.getUserTasks(userA.address);
    const finalCount = finalTasks.length;

    // Check if the count has increased by 3
    expect(finalCount).to.equal(initialCount + 3);
  });
  it("should fail to withdraw (Amount higher than Balance)", async function () {
    let interfaceId = Web3Task.interface.getSighash("withdraw");
    await Web3Task.connect(owner).setOperator(interfaceId, leaderId, true);

    await expect(
      Web3Task.connect(userA).withdraw(leaderId, ethers.utils.parseEther("200"))
    ).to.be.revertedWithCustomError(Web3Task, "InsufficientBalance");
  });

  it("should withdraw all funds and emit Withdraw event on emergency withdrawal", async function () {
    await expect(
      Web3Task.connect(owner).emergengyWithdraw({ gasLimit: 9500000 })
    )
      .to.emit(Web3Task, "Withdraw")
      .withArgs(0, owner.address, 0);

    const balanceAfter = await ethers.provider.getBalance(Web3Task.address);

    expect(balanceAfter).to.equal(0);
  });
});
