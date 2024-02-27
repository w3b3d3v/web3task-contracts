import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  AuthorizeOperator as AuthorizeOperatorEvent,
  AuthorizePersonnel as AuthorizePersonnelEvent,
  Deposit as DepositEvent,
  DescriptionUpdated as DescriptionUpdatedEvent,
  EndDateUpdated as EndDateUpdatedEvent,
  MetadataUpdated as MetadataUpdatedEvent,
  QuorumUpdated as QuorumUpdatedEvent,
  TaskCreated as TaskCreatedEvent,
  TaskReviewed as TaskReviewedEvent,
  TaskStarted as TaskStartedEvent,
  TaskUpdated as TaskUpdatedEvent,
  TitleUpdated as TitleUpdatedEvent,
  Transfer as TransferEvent,
  Withdraw as WithdrawEvent
} from "../generated/TasksManager/TasksManager"
import {
  Approval,
  ApprovalForAll,
  AuthorizeOperator,
  AuthorizePersonnel,
  Deposit,
  DescriptionUpdated,
  EndDateUpdated,
  MetadataUpdated,
  QuorumUpdated,
  TaskCreated,
  TaskReviewed,
  TaskStarted,
  TaskUpdated,
  TitleUpdated,
  Transfer,
  Withdraw
} from "../generated/schema"

export function handleApproval(event: ApprovalEvent): void {
  let entity = new Approval(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.approved = event.params.approved
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleApprovalForAll(event: ApprovalForAllEvent): void {
  let entity = new ApprovalForAll(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.owner = event.params.owner
  entity.operator = event.params.operator
  entity.approved = event.params.approved

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuthorizeOperator(event: AuthorizeOperatorEvent): void {
  let entity = new AuthorizeOperator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.interfaceId = event.params.interfaceId
  entity.roleId = event.params.roleId
  entity.isAuthorized = event.params.isAuthorized

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuthorizePersonnel(event: AuthorizePersonnelEvent): void {
  let entity = new AuthorizePersonnel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.roleId = event.params.roleId
  entity.authorizedAddress = event.params.authorizedAddress
  entity.isAuthorized = event.params.isAuthorized

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDeposit(event: DepositEvent): void {
  let entity = new Deposit(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.authorizationId = event.params.authorizationId
  entity.depositor = event.params.depositor
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleDescriptionUpdated(event: DescriptionUpdatedEvent): void {
  let entity = new DescriptionUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.description = event.params.description

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleEndDateUpdated(event: EndDateUpdatedEvent): void {
  let entity = new EndDateUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.endDate = event.params.endDate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleMetadataUpdated(event: MetadataUpdatedEvent): void {
  let entity = new MetadataUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.metadata = event.params.metadata

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleQuorumUpdated(event: QuorumUpdatedEvent): void {
  let entity = new QuorumUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.value = event.params.value

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskCreated(event: TaskCreatedEvent): void {
  let entity = new TaskCreated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.creator = event.params.creator
  entity.assignee = event.params.assignee
  entity.reward = event.params.reward
  entity.endDate = event.params.endDate

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskReviewed(event: TaskReviewedEvent): void {
  let entity = new TaskReviewed(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.reviewer = event.params.reviewer
  entity.metadata = event.params.metadata

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskStarted(event: TaskStartedEvent): void {
  let entity = new TaskStarted(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.assignee = event.params.assignee

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTaskUpdated(event: TaskUpdatedEvent): void {
  let entity = new TaskUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.status = event.params.status

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTitleUpdated(event: TitleUpdatedEvent): void {
  let entity = new TitleUpdated(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.taskId = event.params.taskId
  entity.title = event.params.title

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleTransfer(event: TransferEvent): void {
  let entity = new Transfer(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.from = event.params.from
  entity.to = event.params.to
  entity.tokenId = event.params.tokenId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleWithdraw(event: WithdrawEvent): void {
  let entity = new Withdraw(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.authorizationId = event.params.authorizationId
  entity.withdrawer = event.params.withdrawer
  entity.amount = event.params.amount

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}
