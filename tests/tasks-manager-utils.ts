import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
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
} from "../generated/TasksManager/TasksManager"

export function createApprovalEvent(
  owner: Address,
  approved: Address,
  tokenId: BigInt
): Approval {
  let approvalEvent = changetype<Approval>(newMockEvent())

  approvalEvent.parameters = new Array()

  approvalEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromAddress(approved))
  )
  approvalEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return approvalEvent
}

export function createApprovalForAllEvent(
  owner: Address,
  operator: Address,
  approved: boolean
): ApprovalForAll {
  let approvalForAllEvent = changetype<ApprovalForAll>(newMockEvent())

  approvalForAllEvent.parameters = new Array()

  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("owner", ethereum.Value.fromAddress(owner))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("operator", ethereum.Value.fromAddress(operator))
  )
  approvalForAllEvent.parameters.push(
    new ethereum.EventParam("approved", ethereum.Value.fromBoolean(approved))
  )

  return approvalForAllEvent
}

export function createAuthorizeOperatorEvent(
  interfaceId: Bytes,
  roleId: BigInt,
  isAuthorized: boolean
): AuthorizeOperator {
  let authorizeOperatorEvent = changetype<AuthorizeOperator>(newMockEvent())

  authorizeOperatorEvent.parameters = new Array()

  authorizeOperatorEvent.parameters.push(
    new ethereum.EventParam(
      "interfaceId",
      ethereum.Value.fromFixedBytes(interfaceId)
    )
  )
  authorizeOperatorEvent.parameters.push(
    new ethereum.EventParam("roleId", ethereum.Value.fromUnsignedBigInt(roleId))
  )
  authorizeOperatorEvent.parameters.push(
    new ethereum.EventParam(
      "isAuthorized",
      ethereum.Value.fromBoolean(isAuthorized)
    )
  )

  return authorizeOperatorEvent
}

export function createAuthorizePersonnelEvent(
  roleId: BigInt,
  authorizedAddress: Address,
  isAuthorized: boolean
): AuthorizePersonnel {
  let authorizePersonnelEvent = changetype<AuthorizePersonnel>(newMockEvent())

  authorizePersonnelEvent.parameters = new Array()

  authorizePersonnelEvent.parameters.push(
    new ethereum.EventParam("roleId", ethereum.Value.fromUnsignedBigInt(roleId))
  )
  authorizePersonnelEvent.parameters.push(
    new ethereum.EventParam(
      "authorizedAddress",
      ethereum.Value.fromAddress(authorizedAddress)
    )
  )
  authorizePersonnelEvent.parameters.push(
    new ethereum.EventParam(
      "isAuthorized",
      ethereum.Value.fromBoolean(isAuthorized)
    )
  )

  return authorizePersonnelEvent
}

export function createDepositEvent(
  authorizationId: BigInt,
  depositor: Address,
  amount: BigInt
): Deposit {
  let depositEvent = changetype<Deposit>(newMockEvent())

  depositEvent.parameters = new Array()

  depositEvent.parameters.push(
    new ethereum.EventParam(
      "authorizationId",
      ethereum.Value.fromUnsignedBigInt(authorizationId)
    )
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("depositor", ethereum.Value.fromAddress(depositor))
  )
  depositEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return depositEvent
}

export function createDescriptionUpdatedEvent(
  taskId: BigInt,
  description: string
): DescriptionUpdated {
  let descriptionUpdatedEvent = changetype<DescriptionUpdated>(newMockEvent())

  descriptionUpdatedEvent.parameters = new Array()

  descriptionUpdatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  descriptionUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "description",
      ethereum.Value.fromString(description)
    )
  )

  return descriptionUpdatedEvent
}

export function createEndDateUpdatedEvent(
  taskId: BigInt,
  endDate: BigInt
): EndDateUpdated {
  let endDateUpdatedEvent = changetype<EndDateUpdated>(newMockEvent())

  endDateUpdatedEvent.parameters = new Array()

  endDateUpdatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  endDateUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "endDate",
      ethereum.Value.fromUnsignedBigInt(endDate)
    )
  )

  return endDateUpdatedEvent
}

export function createMetadataUpdatedEvent(
  taskId: BigInt,
  metadata: string
): MetadataUpdated {
  let metadataUpdatedEvent = changetype<MetadataUpdated>(newMockEvent())

  metadataUpdatedEvent.parameters = new Array()

  metadataUpdatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  metadataUpdatedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )

  return metadataUpdatedEvent
}

export function createQuorumUpdatedEvent(value: BigInt): QuorumUpdated {
  let quorumUpdatedEvent = changetype<QuorumUpdated>(newMockEvent())

  quorumUpdatedEvent.parameters = new Array()

  quorumUpdatedEvent.parameters.push(
    new ethereum.EventParam("value", ethereum.Value.fromUnsignedBigInt(value))
  )

  return quorumUpdatedEvent
}

export function createTaskCreatedEvent(
  taskId: BigInt,
  creator: Address,
  assignee: Address,
  reward: BigInt,
  endDate: BigInt
): TaskCreated {
  let taskCreatedEvent = changetype<TaskCreated>(newMockEvent())

  taskCreatedEvent.parameters = new Array()

  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("creator", ethereum.Value.fromAddress(creator))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("assignee", ethereum.Value.fromAddress(assignee))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam("reward", ethereum.Value.fromUnsignedBigInt(reward))
  )
  taskCreatedEvent.parameters.push(
    new ethereum.EventParam(
      "endDate",
      ethereum.Value.fromUnsignedBigInt(endDate)
    )
  )

  return taskCreatedEvent
}

export function createTaskReviewedEvent(
  taskId: BigInt,
  reviewer: Address,
  metadata: string
): TaskReviewed {
  let taskReviewedEvent = changetype<TaskReviewed>(newMockEvent())

  taskReviewedEvent.parameters = new Array()

  taskReviewedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskReviewedEvent.parameters.push(
    new ethereum.EventParam("reviewer", ethereum.Value.fromAddress(reviewer))
  )
  taskReviewedEvent.parameters.push(
    new ethereum.EventParam("metadata", ethereum.Value.fromString(metadata))
  )

  return taskReviewedEvent
}

export function createTaskStartedEvent(
  taskId: BigInt,
  assignee: Address
): TaskStarted {
  let taskStartedEvent = changetype<TaskStarted>(newMockEvent())

  taskStartedEvent.parameters = new Array()

  taskStartedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskStartedEvent.parameters.push(
    new ethereum.EventParam("assignee", ethereum.Value.fromAddress(assignee))
  )

  return taskStartedEvent
}

export function createTaskUpdatedEvent(
  taskId: BigInt,
  status: i32
): TaskUpdated {
  let taskUpdatedEvent = changetype<TaskUpdated>(newMockEvent())

  taskUpdatedEvent.parameters = new Array()

  taskUpdatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  taskUpdatedEvent.parameters.push(
    new ethereum.EventParam(
      "status",
      ethereum.Value.fromUnsignedBigInt(BigInt.fromI32(status))
    )
  )

  return taskUpdatedEvent
}

export function createTitleUpdatedEvent(
  taskId: BigInt,
  title: string
): TitleUpdated {
  let titleUpdatedEvent = changetype<TitleUpdated>(newMockEvent())

  titleUpdatedEvent.parameters = new Array()

  titleUpdatedEvent.parameters.push(
    new ethereum.EventParam("taskId", ethereum.Value.fromUnsignedBigInt(taskId))
  )
  titleUpdatedEvent.parameters.push(
    new ethereum.EventParam("title", ethereum.Value.fromString(title))
  )

  return titleUpdatedEvent
}

export function createTransferEvent(
  from: Address,
  to: Address,
  tokenId: BigInt
): Transfer {
  let transferEvent = changetype<Transfer>(newMockEvent())

  transferEvent.parameters = new Array()

  transferEvent.parameters.push(
    new ethereum.EventParam("from", ethereum.Value.fromAddress(from))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam("to", ethereum.Value.fromAddress(to))
  )
  transferEvent.parameters.push(
    new ethereum.EventParam(
      "tokenId",
      ethereum.Value.fromUnsignedBigInt(tokenId)
    )
  )

  return transferEvent
}

export function createWithdrawEvent(
  authorizationId: BigInt,
  withdrawer: Address,
  amount: BigInt
): Withdraw {
  let withdrawEvent = changetype<Withdraw>(newMockEvent())

  withdrawEvent.parameters = new Array()

  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "authorizationId",
      ethereum.Value.fromUnsignedBigInt(authorizationId)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam(
      "withdrawer",
      ethereum.Value.fromAddress(withdrawer)
    )
  )
  withdrawEvent.parameters.push(
    new ethereum.EventParam("amount", ethereum.Value.fromUnsignedBigInt(amount))
  )

  return withdrawEvent
}
