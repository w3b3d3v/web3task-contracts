// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

interface IWeb3Task {
    /**
     * @dev Emitted when `msg.sender` already voted for a specific task.
     */
    error AlreadyVoted(address voter);

    /**
     * @dev Emitted when authorization Id (Role) does not hold enough balance to operate.
     */
    error InsufficientBalance(uint256 balance, uint256 amount);

    /**
     * @dev Emitted when `` is not authorized to operate the contract.
     */
    error InvalidAuthorizationId(uint256 authorizationId);

    /**
     * @dev Emitted when `endDate` is less than `block.timestamp`.
     */
    error InvalidEndDate(uint256 endDate, uint256 blockTimestamp);

    /**
     * @dev Emitted when `status` provided mismatches the one asked by the function.
     */
    error InvalidStatus(Status status);

    /**
     * @dev Emitted when a new `taskId` is created.
     */
    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        address indexed assignee,
        uint256 reward,
        uint256 endDate
    );

    /**
     * @dev Emitted when a task is started.
     */
    event TaskStarted(uint256 indexed taskId, address indexed assignee);

    /**
     * @dev Emitted when a task is reviewed.
     */
    event TaskUpdated(uint256 indexed taskId, Status status);

    /**
     * @dev Enum representing the possible states of a task.
     */
    enum Status {
        Created,
        Progress,
        Review,
        Completed,
        Canceled
    }

    /**
     * @dev Core struct of a task.
     */
    struct Task {
        Status status;
        string title;
        string description;
        uint256 reward;
        uint256 endDate;
        uint256[] authorized;
        uint256 creatorRole;
        address assignee;
        string metadata;
    }

    /**
     * @dev The core function to create a task.
     *
     * Emits a {TaskCreated} event.
     *
     * Requirements:
     *
     * - `_task.endDate` must be greater than `block.timestamp`.
     * - `_task.status` must be `Status.Created`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function createTask(Task calldata _task) external returns (uint256);
}
