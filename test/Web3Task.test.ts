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
		const amount = ethers.utils.parseEther("10");
		await Web3Task.connect(owner).deposit(leaderId, {
			value: amount,
		});
		const balance = await Web3Task.getBalance(leaderId);
		expect(balance).to.equal(amount);
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

		await expect(
			await Web3Task.connect(owner).withdraw(
				leaderId,
				ethers.utils.parseEther("0.1")
			)
		)
			.to.emit(Web3Task, "Withdraw")
			.withArgs(leaderId, owner.address, ethers.utils.parseEther("0.1"));
	});

	it("should create new authorizations { leader, member }", async function () {
		await expect(await Web3Task.setRole(leaderId, userA.address, true))
			.to.emit(Web3Task, "AuthorizePersonnel")
			.withArgs(leaderId, userA.address, true);
		await expect(await Web3Task.setRole(leaderId, userB.address, true))
			.to.emit(Web3Task, "AuthorizePersonnel")
			.withArgs(leaderId, userB.address, true);
		await expect(await Web3Task.setRole(memberId, userC.address, true))
			.to.emit(Web3Task, "AuthorizePersonnel")
			.withArgs(memberId, userC.address, true);
	});

	it("should failed to create new authorizations { id = 0 }", async function () {
		await expect(
			Web3Task.setRole(0, userA.address, true)
		).to.be.revertedWithCustomError(Web3Task, "InvalidRoleId");
	});

	it("should failed to create new operator { id = 1 }", async function () {
		let interfaceId = Web3Task.interface.getSighash("createTask");
		expect(
			await Web3Task.setOperator(interfaceId, leaderId, true)
		).to.be.revertedWithCustomError(Web3Task, "InvalidRoleId");
	});

	it("should failed to create new authorizations { sender != owner }", async function () {
		await expect(
			Web3Task.connect(userA).setRole(leaderId, userA.address, true)
		).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
	});

	it("should create new operator { createTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("createTask");
		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
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
		await expect(await Web3Task.setOperator(interfaceId, memberId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, memberId, true);
		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, memberId)).to.be.equal(true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { completeTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("completeTask");
		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { cancelTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("cancelTask");

		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, leaderId, true);

		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setTitle }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setTitle");
		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setDescription }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setDescription");
		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setEndDate }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setEndDate");
		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setMetadata }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setMetadata");
		await expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizeOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should failed to create new operator { sender != owner }", async function () {
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

	it("should failed to create new task (unauthorized user - userC)", async function () {
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

	it("should failed to create new task (invalid leaderId)", async function () {
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

	it("should failed to create new task (invalid status -  Progress (1))", async function () {
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

	it("should failed to create new task (invalid end date)", async function () {
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
		await expect(
			await Web3Task.connect(userA).setTitle(createdTaskId, taskTitle)
		)
			.to.emit(Web3Task, "TitleUpdated")
			.withArgs(createdTaskId, taskTitle);
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.title).to.equal(taskTitle);
	});

	it("should set description", async function () {
		await expect(
			await Web3Task.connect(userA).setDescription(
				createdTaskId,
				taskDescription
			)
		)
			.to.emit(Web3Task, "DescriptionUpdated")
			.withArgs(createdTaskId, taskDescription);
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.description).to.equal(taskDescription);
	});

	it("should set endDate", async function () {
		const targetDate = Math.floor(Date.now() / 1000) + 3600;
		await expect(
			await Web3Task.connect(userA).setEndDate(createdTaskId, targetDate)
		)
			.to.emit(Web3Task, "EndDateUpdated")
			.withArgs(createdTaskId, targetDate);
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.endDate).to.equal(targetDate);
	});

	it("should set metadata", async function () {
		await expect(
			await Web3Task.connect(userA).setMetadata(createdTaskId, "newMeta")
		)
			.to.emit(Web3Task, "MetadataUpdated")
			.withArgs(createdTaskId, "newMeta");
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.metadata).to.equal("newMeta");
	});

	it("should start task", async function () {
		await expect(
			await Web3Task.connect(userC).startTask(createdTaskId, memberId)
		)
			.to.emit(Web3Task, "TaskStarted")
			.withArgs(createdTaskId, userC.address);
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.status).to.equal(Status.Progress);
	});

	it("should review task", async function () {
		const mockData = "ipfs link";
		const task2 = await Web3Task.getTask(createdTaskId);
		expect(task2.assignee == userC.address).to.equal(true);
		await expect(
			await Web3Task.connect(userC).reviewTask(
				createdTaskId,
				memberId,
				mockData
			)
		)
			.to.emit(Web3Task, "TaskReviewed")
			.withArgs(createdTaskId, userC.address, mockData);

		// Leaders can also call review to place a note during
		// the task review process. This is supposed to ping pong
		// between the leader and the assignee until the task is
		// completed.
		await expect(
			await Web3Task.connect(userB).reviewTask(
				createdTaskId,
				leaderId,
				mockData
			)
		)
			.to.emit(Web3Task, "TaskReviewed")
			.withArgs(createdTaskId, userB.address, mockData);

		const task = await Web3Task.getTask(createdTaskId);
		expect(task.status).to.equal(Status.Review);
	});

	it("should complete task ", async function () {
		expect(await Web3Task.connect(userA).completeTask(createdTaskId, leaderId))
			.to.be.ok;
		await expect(
			await Web3Task.connect(userB).completeTask(createdTaskId, leaderId)
		)
			.to.emit(Web3Task, "TaskUpdated")
			.withArgs(createdTaskId, Status.Completed);

		const task = await Web3Task.getTask(createdTaskId);
		expect(task.status).to.equal(Status.Completed);
	});

	it("should cancel task", async function () {
		await expect(
			await Web3Task.connect(userA).cancelTask(createdTaskId, leaderId)
		)
			.to.emit(Web3Task, "TaskUpdated")
			.withArgs(createdTaskId, Status.Canceled);
	});

	it("should set title failure", async function () {
		const test = await Web3Task.getTask(createdTaskId);
		console.log(test);
		console.log(createdTaskId);
		console.log(Status.Canceled);
		await expect(Web3Task.connect(userA).setTitle(createdTaskId, taskTitle))
			.to.be.revertedWithCustomError(Web3Task, "TaskCannotBeChanged")
			.withArgs(createdTaskId, Status.Canceled);
	});
});
