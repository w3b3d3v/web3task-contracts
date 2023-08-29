// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "./AccessControl.sol";
import {IWeb3Task} from "./interfaces/IWeb3Task.sol";

error InvalidAuthorized();
error InvalidEndDate();
error InvalidStatus(IWeb3Task.Status status);
error AlreadyVoted();

contract Web3Task is ERC721, AccessControl, IWeb3Task {
    uint256 public taskId;

    mapping(uint256 => Task) internal _tasks;
    mapping(uint256 => uint256) private _balances;

    constructor() ERC721("Web3Task", "W3TH") {}

    function createTask(
        Task calldata _task
    )
        external
        onlyOperator(this.createTask.selector, _task.creator, msg.sender)
        returns (uint256)
    {
        if (_task.endDate < block.timestamp) {
            revert InvalidEndDate();
        }

        if (_task.status != Status.Created) {
            revert InvalidStatus(Status.Created);
        }

        unchecked {
            taskId++;
        }

        _tasks[taskId] = _task;
        _tasks[taskId].status = Status.Created;

        emit TaskCreated(
            taskId,
            msg.sender,
            _task.assignee,
            _task.reward,
            _task.endDate
        );

        return taskId;
    }

    function startTask(
        uint256 _taskId,
        uint256 _authorizedId
    )
        external
        onlyOperator(this.startTask.selector, _authorizedId, msg.sender)
    {
        Task memory task = getTask(_taskId);

        if (!isAuthorized(task.authorized, _authorizedId)) {
            revert InvalidAuthorized();
        }

        if (task.status != Status.Created) {
            revert InvalidStatus(task.status);
        }

        if (task.assignee == address(0)) {
            _tasks[_taskId].assignee = msg.sender;
        }

        _tasks[_taskId].status = Status.Progress;

        emit TaskStarted(_taskId, msg.sender);
    }

    function reviewTask(
        uint256 _taskId,
        uint256 _authorizedId
    )
        external
        onlyOperator(this.startTask.selector, _authorizedId, msg.sender)
    {
        Task memory task = getTask(_taskId);

        if (!isAuthorized(task.authorized, _authorizedId)) {
            revert InvalidAuthorized();
        }

        if (task.status != Status.Progress) {
            revert InvalidStatus(task.status);
        }

        _tasks[_taskId].status = Status.Review;

        emit TaskUpdated(_taskId, Status.Review);
    }

    mapping(uint256 => uint256) internal _approvals;
    mapping(uint256 => address) internal _alreadyVoted;

    function completeTask(
        uint256 _taskId,
        uint256 _authorizedId
    )
        external
        onlyOperator(this.startTask.selector, _authorizedId, msg.sender)
    {
        if (_alreadyVoted[_taskId] == msg.sender) {
            revert AlreadyVoted();
        }

        _alreadyVoted[_taskId] = msg.sender;
        _approvals[_taskId]++;

        Task memory task = getTask(_taskId);

        if (task.status != Status.Review) {
            revert InvalidStatus(task.status);
        }

        if (_approvals[_taskId] >= 2) {
            _tasks[_taskId].status = Status.Completed;

            _mint(task.assignee, taskId);

            emit TaskUpdated(_taskId, Status.Completed);
        }
    }

    function cancelTask(
        uint256 _taskId,
        uint256 _authorizedId
    )
        external
        onlyOperator(this.startTask.selector, _authorizedId, msg.sender)
    {
        Task memory task = getTask(_taskId);

        if (task.status != Status.Canceled) {
            revert InvalidStatus(task.status);
        }

        _tasks[_taskId].status = Status.Canceled;

        emit TaskUpdated(_taskId, Status.Canceled);
    }

    function getTask(uint256 _taskId) public view returns (Task memory) {
        Task memory task = _tasks[_taskId];

        if (task.endDate < block.timestamp) {
            task.status = Status.Canceled;
        }

        return task;
    }

    function deposit(uint256 _authorizedId) public payable {
        _balances[_authorizedId] = msg.value;
    }

    function isAuthorized(
        uint256[] memory _authorized,
        uint256 _authorizationId
    ) internal pure returns (bool) {
        for (uint256 i; i < _authorized.length; ) {
            unchecked {
                i++;
            }
            if (_authorized[i] == _authorizationId) {
                return true;
            }
        }

        return false;
    }
}
