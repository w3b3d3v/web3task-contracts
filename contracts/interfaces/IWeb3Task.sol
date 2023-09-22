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
    error InsufficientBalance(uint256 balance, uint256 withdrawAmount);

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
     * @dev Emmited when the minimum `APPROVALS` to complete a task is updated.
     */
    event QuorumUpdated(uint256 value);

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
     * @dev Emitted when a review is pushed for a task.
     */
    event TaskReviewed(
        uint256 indexed taskId,
        address indexed reviewer,
        string metadata
    );

    /**
     * @dev Emitted when a deposit is made.
     */
    event Deposit(
        uint256 indexed authorizationId,
        address indexed depositor,
        uint256 amount
    );

    /**
     * @dev Emitted when a withdraw is made.
     */
    event Withdraw(
        uint256 indexed authorizationId,
        address indexed withdrawer,
        uint256 amount
    );

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
     * @dev This function sets the minimum quorum of approvals to complete a task.
     *
     * Emit a {QuorumUpdated} event.
     */
    function setMinQuorum(uint256 value) external;

    /**
     * @dev The core function to create a task.
     *
     * Will increment global `_taskId`.
     *
     * Emits a {TaskCreated} event.
     *
     * Requirements:
     *
     * - `task.endDate` must be greater than `block.timestamp`.
     * - `task.status` must be `Status.Created`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function createTask(Task calldata task) external returns (uint256);

    /**
     * @dev This function starts a task. It will set the `msg.sender` as the
     * assignee in case none is provided. Meaning anyone with the authorization
     * can start the task.
     *
     * The task status will be set to `Status.Progress` and the next step is
     * to execute the task and call a {reviewTask} when ready.
     *
     * Emits a {TaskStarted} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `task.status` must be `Status.Created`.
     * - `task.endDate` must be greater than `block.timestamp`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function startTask(uint256 taskId, uint256 authId) external returns (bool);

    /**
     * @dev This function reviews a task and let the caller push a metadata.
     *
     * Metadata is a string that can be used to store any kind of information
     * related to the task. It can be used to store a link to a file using IPFS.
     *
     * IMPORTANT: This function can be called more than once by both task creator
     * or asssignee. This is because we want to allow a ping-pong of reviews until
     * the due date or completion. This will create a history of reviews that can
     * be used to track the progress of the task and raise a dispute if needed.
     *
     * Emits a {TaskUpdated} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `msg.sender` must be `_task.assignee` or the `_task.creator`.
     * - `task.status` must be `Status.Progress` or `Status.Review`.
     * - `task.endDate` must be greater than `block.timestamp`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     *
     * NOTE: If the status is `Status.Progress` it will be set to `Status.Review` once.
     */
    function reviewTask(
        uint256 taskId,
        uint256 authId,
        string memory metadata
    ) external returns (bool);

    /**
     * @dev This function completes a task and transfers the rewards to the assignee.
     *
     * The task status will be set to `Status.Completed` and the task will be
     * considered done.
     *
     * The `_task.assignee` will receive the `_task.reward` and also a NFT representing
     * the completed task with the tokenId equal to the `_taskId`.
     *
     * IMPORTANT: The assignee agrees to the reward distribution by completing the
     * task and its aware that the task can be disputed by the creator. The assignee
     * can also open a dispute if the creator does not approve the completion by
     * reaching higher DAO authorities.
     *
     * Emits a {TaskUpdated} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `task.status` must be `Status.Review`.
     * - `task.endDate` must be greater than `block.timestamp`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     * - `msg.sender` can only cast one vote per task.
     * - `APPROVALS` must reach the quorum.
     */
    function completeTask(
        uint256 taskId,
        uint256 authId
    ) external returns (bool);

    /**
     * @dev This function cancels a task and invalidates its continuity.
     *
     * The task status will be set to `Status.Canceled`.
     *
     * IMPORTANT: Tasks that were previously set to `Completed` can be
     * canceled as well, but the assignee will keep the reward and the NFT.
     *
     * Emits a {TaskUpdated} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `task.status` cannot be `Status.Canceled`.
     * - `task.endDate` must be greater than `block.timestamp`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function cancelTask(uint256 taskId, uint256 authId) external returns (bool);

    /**
     * @dev This function returns a task by its id.
     *
     * Requirements:
     *
     * - `_taskId` must exist.
     * - `task.endDate` must be greater than `block.timestamp
     */
    function getTask(uint256 taskId) external view returns (Task memory);

    /**
     * @dev This function allows to deposit funds into the contract into
     * a specific authorization role.
     *
     * If the authorization role is e.g.: "Leader of Marketing" as the `authId`
     * number 5, then sending funds to this function passing the id will increase
     * the balance of the authorization role by `msg.value`.
     *
     * Emits a {Deposit} event.
     *
     * NOTE: Any authorization role id can be used as a parameter, even those
     * that are not yet created. For this and more related issues, there is
     * an {emergencyWithdraw} in the contract.
     */
    function deposit(uint256 authId) external payable returns (bool);

    /**
     * @dev This function allows to withdraw funds from the contract from
     * a specific authorization role.
     *
     * Emits a {Withdraw} event.
     *
     * Requirements:
     *
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     * - `balance` of the authorization role must be greater than `_amount`.
     */
    function withdraw(uint256 authId, uint256 amount) external returns (bool);

    /**
     * @dev This function allows to withdraw all funds from the contract.
     *
     * Emits a {Withdraw} event.
     *
     * Requirements:
     *
     * - `msg.sender` must be the contract owner (see {AccessControl}).
     */
    function emergengyWithdraw() external;
}
