import { newMockEvent } from "matchstick-as"
import { ethereum, Address, BigInt, Bytes } from "@graphprotocol/graph-ts"
import {
  Approval,
  ApprovalForAll,
  AuthorizedOperator,
  AuthorizedPersonnel,
  TaskCreated,
  TaskStarted,
  TaskUpdated,
  Transfer
} from "../generated/Web3Task/Web3Task"

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

export function createAuthorizedOperatorEvent(
  id: BigInt,
  interfaceId: Bytes
): AuthorizedOperator {
  let authorizedOperatorEvent = changetype<AuthorizedOperator>(newMockEvent())

  authorizedOperatorEvent.parameters = new Array()

  authorizedOperatorEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  authorizedOperatorEvent.parameters.push(
    new ethereum.EventParam(
      "interfaceId",
      ethereum.Value.fromFixedBytes(interfaceId)
    )
  )

  return authorizedOperatorEvent
}

export function createAuthorizedPersonnelEvent(
  id: BigInt,
  addr: Address,
  authorized: boolean
): AuthorizedPersonnel {
  let authorizedPersonnelEvent = changetype<AuthorizedPersonnel>(newMockEvent())

  authorizedPersonnelEvent.parameters = new Array()

  authorizedPersonnelEvent.parameters.push(
    new ethereum.EventParam("id", ethereum.Value.fromUnsignedBigInt(id))
  )
  authorizedPersonnelEvent.parameters.push(
    new ethereum.EventParam("addr", ethereum.Value.fromAddress(addr))
  )
  authorizedPersonnelEvent.parameters.push(
    new ethereum.EventParam(
      "authorized",
      ethereum.Value.fromBoolean(authorized)
    )
  )

  return authorizedPersonnelEvent
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
