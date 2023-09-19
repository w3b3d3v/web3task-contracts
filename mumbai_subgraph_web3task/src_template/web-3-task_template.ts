import {
  Approval as ApprovalEvent,
  ApprovalForAll as ApprovalForAllEvent,
  AuthorizedOperator as AuthorizedOperatorEvent,
  AuthorizedPersonnel as AuthorizedPersonnelEvent,
  TaskCreated as TaskCreatedEvent,
  TaskStarted as TaskStartedEvent,
  TaskUpdated as TaskUpdatedEvent,
  Transfer as TransferEvent
} from "../generated/Web3Task/Web3Task"
import {
  Approval,
  ApprovalForAll,
  AuthorizedOperator,
  AuthorizedPersonnel,
  TaskCreated,
  TaskStarted,
  TaskUpdated,
  Transfer
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

export function handleAuthorizedOperator(event: AuthorizedOperatorEvent): void {
  let entity = new AuthorizedOperator(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Web3Task_id = event.params.id
  entity.interfaceId = event.params.interfaceId

  entity.blockNumber = event.block.number
  entity.blockTimestamp = event.block.timestamp
  entity.transactionHash = event.transaction.hash

  entity.save()
}

export function handleAuthorizedPersonnel(
  event: AuthorizedPersonnelEvent
): void {
  let entity = new AuthorizedPersonnel(
    event.transaction.hash.concatI32(event.logIndex.toI32())
  )
  entity.Web3Task_id = event.params.id
  entity.addr = event.params.addr
  entity.authorized = event.params.authorized

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
