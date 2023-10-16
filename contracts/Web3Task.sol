// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "./AccessControl.sol";
import {IWeb3Task} from "./interfaces/IWeb3Task.sol";

abstract contract Web3Task is ERC721, AccessControl, IWeb3Task {
    /// @dev Current taskId, aslo used as token id.
    uint256 private taskId;

    /// @dev Amount of necessary approvals to finish a task.
    uint256 private APPROVALS = 2;

    ///@dev Mapping of taskId to Task.
    mapping(uint256 => Task) internal _tasks;

    /// @dev Mapping of access control id to balance.
    mapping(uint256 => uint256) private _balances;

    /// @dev Mapping of taskId to its approvals for conclusion.
    mapping(uint256 => uint256) private _approvals;

    /// @dev Mapping of taskId to address that already voted.
    mapping(uint256 => address) private _alreadyVoted;

    /// @dev Mapping of address to its tasks.
    mapping(address => uint256[]) private _countOfTasks;

    /// @dev Mapping of address to points.
    mapping(address => uint256) private _points;

    /// @dev Mapping of task to creation time.
    mapping(uint256 => uint256) private _createTime;

    /**
     * @dev Sets the values for {name} and {symbol}.
     */
    constructor() ERC721("Web3Task", "W3TH") {}

    /**
     * @dev See {IWeb3Task-setMinQuorum}.
     */
    function setMinQuorum(uint256 _value) public virtual onlyOwner {
        APPROVALS = _value;
        emit QuorumUpdated(_value);
    }

    /**
     * @dev See {IWeb3Task-createTask}.
     */
    function createTask(
        Task calldata _task
    )
        public
        virtual
        onlyOperator(this.createTask.selector, _task.creatorRole, msg.sender)
        returns (uint256)
    {
        if (
            _task.endDate < block.timestamp ||
            _task.endDate > block.timestamp + 15 days
        ) {
            revert InvalidEndDate(_task.endDate, block.timestamp);
        }

        if (_task.status != Status.Created) {
            revert InvalidStatus(_task.status);
        }

        uint256 balance = _balances[_task.creatorRole];
        if (_task.reward > balance || _task.reward < 10e12) {
            revert InsufficientBalance(balance, _task.reward);
        }

        // Overflow not possible: taskId <= max uint256.
        unchecked {
            taskId++;
        }

        _tasks[taskId] = _task;
        _countOfTasks[msg.sender].push(taskId);
        _createTime[taskId] = block.timestamp;

        emit TaskCreated(
            taskId,
            msg.sender,
            _task.assignee,
            _task.reward,
            _task.endDate
        );

        return taskId;
    }

    /**
     * @dev See {IWeb3Task-startTask}.
     */
    function startTask(
        uint256 _taskId,
        uint256 _roleId
    )
        public
        virtual
        onlyOperator(this.startTask.selector, _roleId, msg.sender)
        returns (bool)
    {
        Task memory task = getTask(_taskId);

        if (task.status != Status.Created) {
            revert InvalidStatus(task.status);
        }

        if (!_isRoleAllowed(task.authorizedRoles, _roleId)) {
            revert InvalidRoleId(_roleId);
        }

        if (task.assignee == address(0)) {
            _tasks[_taskId].assignee = msg.sender;
        } else if (task.assignee != msg.sender) {
            revert Unauthorized(msg.sender);
        }

        _tasks[_taskId].status = Status.Progress;
        _countOfTasks[task.assignee].push(_taskId);

        emit TaskStarted(_taskId, msg.sender);

        return true;
    }

    /**
     * @dev See {IWeb3Task-reviewTask}.
     */
    function reviewTask(
        uint256 _taskId,
        uint256 _roleId,
        string memory _metadata
    )
        public
        virtual
        onlyOperator(this.reviewTask.selector, _roleId, msg.sender)
        returns (bool)
    {
        Task memory task = getTask(_taskId);

        if (task.assignee != msg.sender) {
            if (task.creatorRole != _roleId) {
                revert Unauthorized(msg.sender);
            }
        }

        if (task.status == Status.Progress) {
            _tasks[_taskId].status = Status.Review;
        } else if (task.status != Status.Review) {
            revert InvalidStatus(task.status);
        }

        emit TaskReviewed(_taskId, msg.sender, _metadata);

        return true;
    }

    /**
     * @dev See {IWeb3Task-completeTask}.
     */
    function completeTask(
        uint256 _taskId,
        uint256 _roleId
    )
        public
        virtual
        onlyOperator(this.completeTask.selector, _roleId, msg.sender)
        returns (bool)
    {
        Task memory task = getTask(_taskId);

        if (task.status != Status.Review) {
            revert InvalidStatus(task.status);
        }

        if (task.creatorRole != _roleId) {
            revert Unauthorized(msg.sender);
        }

        if (_alreadyVoted[_taskId] == msg.sender) {
            revert AlreadyVoted(msg.sender);
        }

        _alreadyVoted[_taskId] = msg.sender;
        _approvals[_taskId]++;

        if (_approvals[_taskId] >= APPROVALS) {
            _tasks[_taskId].status = Status.Completed;

            _mint(task.assignee, _taskId);

            _points[msg.sender] += _setScore(_taskId, task.reward);

            (bool sent, ) = payable(task.assignee).call{value: task.reward}("");
            if (!sent || task.reward > _balances[_roleId]) {
                revert InsufficientBalance(_balances[_roleId], task.reward);
            }

            emit TaskUpdated(_taskId, Status.Completed);
            emit Withdraw(_roleId, task.assignee, task.reward);
        }

        return true;
    }

    /**
     * @dev See {IWeb3Task-cancelTask}.
     */
    function cancelTask(
        uint256 _taskId,
        uint256 _roleId
    )
        public
        virtual
        onlyOperator(this.cancelTask.selector, _roleId, msg.sender)
        returns (bool)
    {
        Task memory task = getTask(_taskId);

        if (task.status == Status.Canceled) {
            revert InvalidStatus(task.status);
        }

        _tasks[_taskId].status = Status.Canceled;

        emit TaskUpdated(_taskId, Status.Canceled);

        return true;
    }

    /**
     * @dev See {IWeb3Task-getTask}.
     */
    function getTask(
        uint256 _taskId
    ) public view virtual returns (Task memory) {
        Task memory task = _tasks[_taskId];

        if (task.endDate < block.timestamp) {
            if (task.endDate == 0) {
                revert InvalidTaskId(_taskId);
            }

            task.status = Status.Canceled;
        }

        return task;
    }

    /**
     * @dev See {IWeb3Task-getTests}.
     */
    function getUserTasks(
        address _address
    ) public view returns (uint256[] memory) {
        return _countOfTasks[_address];
    }

    /**
     * @dev See {IWeb3Task-getBalance}.
     */
    function getBalance(uint256 _roleId) public view virtual returns (uint256) {
        return _balances[_roleId];
    }

    /**
     * @dev See {IWeb3Task-getTaskId}.
     */
    function getTaskId() public view virtual returns (uint256) {
        return taskId;
    }

    /**
     * @dev See {IWeb3Task-getMinQuorum}.
     */
    function getMinQuorum() public view virtual returns (uint256) {
        return APPROVALS;
     * @dev See {IWeb3Task-getScore}.
     */
    function getScore(address _address) public view virtual returns (uint256) {
        return _points[_address];
    }

    /**
     * @dev See {IWeb3Task-deposit}.
     */
    function deposit(uint256 _roleId) public payable virtual returns (bool) {
        _balances[_roleId] = msg.value;
        emit Deposit(_roleId, msg.sender, msg.value);
        return true;
    }

    /**
     * @dev See {IWeb3Task-withdraw}.
     */
    function withdraw(
        uint256 _roleId,
        uint256 _amount
    )
        public
        virtual
        onlyOperator(this.withdraw.selector, _roleId, msg.sender)
        returns (bool)
    {
        uint256 balance = _balances[_roleId];

        if (balance < _amount) {
            revert InsufficientBalance(_balances[_roleId], _amount);
        }

        _balances[_roleId] -= _amount;

        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        if (!sent) {
            revert InsufficientBalance(balance, _amount);
        }

        emit Withdraw(_roleId, msg.sender, _amount);

        return true;
    }

    /**
     * @dev See {IWeb3Task-emergengyWithdraw}.
     */
    function emergengyWithdraw() public virtual onlyOwner {
        payable(msg.sender).call{value: address(this).balance}("");
        emit Withdraw(0, msg.sender, address(this).balance);
    }

    /**
     * @dev Will loop in search for a valid assignee's roleId.
     *
     * IMPORTANT: The user might be an operator of the `startTask`
     * function, but might not have the assignee's roleId. In this
     * case it will revert.
     *
     * Since the entire mapping for role structure cannot be looped,
     * we ask for the user to point the role he is using to call
     * the function. We then check if the auth provided matches any
     * of the initially auths, settled in the current task.
     */
    function _isRoleAllowed(
        uint256[] memory _authorizedRoles,
        uint256 _roleId
    ) internal pure virtual returns (bool) {
        for (uint256 i; i < _authorizedRoles.length; ) {
            if (_authorizedRoles[i] == _roleId) {
                return true;
            }

            // Overflow not possible: i <= max uint256.
            unchecked {
                i++;
            }
        }
        return false;
    }

    /**
     * @dev Will set the score after completing the task.
     */
    function _setScore(
        uint256 _taskId,
        uint256 _reward
    ) internal view virtual returns (uint256) {
        return (block.timestamp - _createTime[_taskId]) * (_reward / 10e12);
    }
}
