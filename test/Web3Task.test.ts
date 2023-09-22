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

	it("should fund the authorizationId (Role) {leader = 5}", async function () {
		await Web3Task.connect(owner).deposit(leaderId, {
			value: ethers.utils.parseEther("5"),
		});
	});

	it("should create new authorizations { leader, member }", async function () {
		expect(await Web3Task.setAuthorization(leaderId, userA.address, true))
			.to.emit(Web3Task, "AuthorizedPersonnel")
			.withArgs(leaderId, userA.address, true);
		expect(await Web3Task.setAuthorization(leaderId, userB.address, true))
			.to.emit(Web3Task, "AuthorizedPersonnel")
			.withArgs(leaderId, userB.address, true);
		expect(await Web3Task.setAuthorization(memberId, userC.address, true))
			.to.emit(Web3Task, "AuthorizedPersonnel")
			.withArgs(memberId, userC.address, true);
	});

	it("should failed to create new authorizations { id = 0 }", async function () {
		await expect(
			Web3Task.setAuthorization(0, userA.address, true)
		).to.be.revertedWithCustomError(Web3Task, "InvalidAuthId");
	});

	it("should failed to create new authorizations { id = 1 }", async function () {
		await expect(
			Web3Task.setAuthorization(1, userA.address, true)
		).to.be.revertedWithCustomError(Web3Task, "InvalidAuthId");
	});

	it("should failed to create new authorizations { sender != owner }", async function () {
		await expect(
			Web3Task.connect(userA).setAuthorization(leaderId, userA.address, true)
		).to.be.revertedWithCustomError(Web3Task, "Unauthorized");
	});

	it("should create new operator { createTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("createTask");
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { startTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("startTask");
		expect(await Web3Task.setOperator(interfaceId, memberId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, memberId, true);
		expect(await Web3Task.isOperator(interfaceId, memberId)).to.be.equal(true);
	});

	it("should create new operator { reviewTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("reviewTask");
		expect(await Web3Task.setOperator(interfaceId, memberId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, memberId, true);
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, memberId)).to.be.equal(true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { completeTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("completeTask");
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { cancelTask }", async function () {
		let interfaceId = Web3Task.interface.getSighash("cancelTask");
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setTitle }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setTitle");
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setDescription }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setDescription");
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setEndDate }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setEndDate");
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
			.withArgs(interfaceId, leaderId, true);
		expect(await Web3Task.isOperator(interfaceId, leaderId)).to.be.equal(true);
	});

	it("should create new operator { setMetadata }", async function () {
		let interfaceId = Web3Task.interface.getSighash("setMetadata");
		expect(await Web3Task.setOperator(interfaceId, leaderId, true))
			.to.emit(Web3Task, "AuthorizedOperator")
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
			authorized: [memberId],
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
			authorized: [memberId],
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
			authorized: [memberId],
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
			authorized: [memberId],
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
			authorized: [memberId],
			creatorRole: leaderId,
			assignee: userB.address,
			metadata: "ipfs://0xc0/",
		};

		await expect(
			Web3Task.connect(userA).createTask(Task)
		).to.be.revertedWithCustomError(Web3Task, "InvalidEndDate");
	});

	it("should set title", async function () {
		expect(
			await Web3Task.connect(userA).setTitle(createdTaskId, leaderId, taskTitle)
		)
			.to.emit(Web3Task, "TitleUpdated")
			.withArgs(createdTaskId);
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.title).to.equal(taskTitle);
	});

	it("should set description", async function () {
		expect(
			await Web3Task.connect(userA).setDescription(
				createdTaskId,
				leaderId,
				taskDescription
			)
		)
			.to.emit(Web3Task, "TitleUpdated")
			.withArgs(createdTaskId);
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.description).to.equal(taskDescription);
	});

	it("should set endDate", async function () {
		const target = Math.floor(Date.now() / 1000) + 3600;
		expect(
			await Web3Task.connect(userA).setEndDate(createdTaskId, leaderId, target)
		)
			.to.emit(Web3Task, "TitleUpdated")
			.withArgs(createdTaskId);
		const task = await Web3Task.getTask(createdTaskId);
		expect(task.endDate).to.equal(target);
	});

	it("should set metadata", async function () {
		expect(
			await Web3Task.connect(userA).setTitle(createdTaskId, leaderId, taskTitle)
		)
			.to.emit(Web3Task, "MetadataUpdated")
			.withArgs(createdTaskId);
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
		await expect(
			Web3Task.connect(userA).setTitle(createdTaskId, leaderId, taskTitle)
		)
			.to.be.revertedWithCustomError(Web3Task, "TaskCannotBeChanged")
			.withArgs(createdTaskId);
	});
});
