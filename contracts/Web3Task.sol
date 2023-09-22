// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import {AccessControl} from "./AccessControl.sol";
import {IWeb3Task} from "./interfaces/IWeb3Task.sol";

abstract contract Web3Task is ERC721, AccessControl, IWeb3Task {
    /// Current taskId, aslo used as token id.
    uint256 public taskId;

    /// Amount of necessary approvals to finish a task.
    uint256 public APPROVALS = 2;

    /// Mapping of taskId to Task.
    mapping(uint256 => Task) internal _tasks;

    /// Mapping of access control id to balance.
    mapping(uint256 => uint256) private _balances;

    /// Mapping of taskId to its approvals for conclusion.
    mapping(uint256 => uint256) private _approvals;

    /// Mapping of taskId to address that already voted.
    mapping(uint256 => address) private _alreadyVoted;

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
        if (_task.endDate < block.timestamp) {
            revert InvalidEndDate(_task.endDate, block.timestamp);
        }

        if (_task.status != Status.Created) {
            revert InvalidStatus(_task.status);
        }

        unchecked {
            taskId++;
        }

        _tasks[taskId] = _task;

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
        uint256 _authId
    )
        public
        virtual
        onlyOperator(this.startTask.selector, _authId, msg.sender)
        returns (bool)
    {
        Task memory task = getTask(_taskId);

        if (!_isAuthorized(task.authorized, _authId)) {
            revert InvalidAuthorizationId(_authId);
        }

        if (task.assignee == address(0)) {
            _tasks[_taskId].assignee = msg.sender;
        }

        if (task.assignee != msg.sender) {
            revert Unauthorized(msg.sender);
        }

        if (task.status != Status.Created) {
            revert InvalidStatus(task.status);
        }

        _tasks[_taskId].status = Status.Progress;

        emit TaskStarted(_taskId, msg.sender);

        return true;
    }

    /**
     * @dev See {IWeb3Task-reviewTask}.
     */
    function reviewTask(
        uint256 _taskId,
        uint256 _authId,
        string memory _metadata
    )
        public
        virtual
        onlyOperator(this.reviewTask.selector, _authId, msg.sender)
        returns (bool)
    {
        Task memory task = getTask(_taskId);

        if (task.assignee != msg.sender) {
            if (task.creatorRole != _authId) {
                revert Unauthorized(msg.sender);
            }
        }

        if (task.status == Status.Progress) {
            _tasks[_taskId].status = Status.Review;
        } else if (task.status != Status.Review) {
            revert InvalidStatus(task.status);
        }

        emit TaskUpdated(_taskId, Status.Review);
        emit TaskReviewed(_taskId, msg.sender, _metadata);

        return true;
    }

    /**
     * @dev See {IWeb3Task-completeTask}.
     */
    function completeTask(
        uint256 _taskId,
        uint256 _authId
    )
        public
        virtual
        onlyOperator(this.completeTask.selector, _authId, msg.sender)
        returns (bool)
    {
        if (_alreadyVoted[_taskId] == msg.sender) {
            revert AlreadyVoted(msg.sender);
        }

        _alreadyVoted[_taskId] = msg.sender;
        _approvals[_taskId]++;

        Task memory task = getTask(_taskId);

        if (task.creatorRole != _authId) {
            revert Unauthorized(msg.sender);
        }

        if (task.status != Status.Review) {
            revert InvalidStatus(task.status);
        }

        if (_approvals[_taskId] >= APPROVALS) {
            _tasks[_taskId].status = Status.Completed;

            _mint(task.assignee, _taskId);

            if (task.reward > _balances[_authId]) {
                revert InsufficientBalance(_balances[_authId], task.reward);
            }

            (bool sent, ) = payable(task.assignee).call{value: task.reward}("");
            if (!sent) {
                revert InsufficientBalance(_balances[_authId], task.reward);
            }

            emit TaskUpdated(_taskId, Status.Completed);
            emit Withdraw(_authId, task.assignee, task.reward);
        }

        return true;
    }

    /**
     * @dev See {IWeb3Task-cancelTask}.
     */
    function cancelTask(
        uint256 _taskId,
        uint256 _authId
    )
        public
        virtual
        onlyOperator(this.cancelTask.selector, _authId, msg.sender)
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
            task.status = Status.Canceled;
        }

        return task;
    }

    /**
     * @dev See {IWeb3Task-deposit}.
     */
    function deposit(uint256 _authId) public payable virtual returns (bool) {
        _balances[_authId] = msg.value;
        emit Deposit(_authId, msg.sender, msg.value);
        return true;
    }

    /**
     * @dev See {IWeb3Task-withdraw}.
     */
    function withdraw(
        uint256 _authId,
        uint256 _amount
    )
        public
        virtual
        onlyOperator(this.withdraw.selector, _authId, msg.sender)
        returns (bool)
    {
        uint256 balance = _balances[_authId];

        if (balance < _amount) {
            revert InsufficientBalance(_balances[_authId], _amount);
        }

        _balances[_authId] -= _amount;

        (bool sent, ) = payable(msg.sender).call{value: _amount}("");
        if (!sent) {
            revert InsufficientBalance(balance, _amount);
        }

        emit Withdraw(_authId, msg.sender, _amount);

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
     * @dev Will loop in search for a valid authorizationId.
     *
     * Since the entire authorization mapping structure cannot be looped,
     * we ask for the user to point the authorization he is using to call
     * the function. We then check if the auth provided matches the any
     * of the initially auths, settled in the current task.
     */
    function _isAuthorized(
        uint256[] memory _authorized,
        uint256 _authorizationId
    ) internal pure virtual returns (bool) {
        for (uint256 i; i < _authorized.length; ) {
            if (_authorized[i] == _authorizationId) {
                return true;
            }

            unchecked {
                i++;
            }
        }
        return false;
    }
}
