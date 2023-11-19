// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Web3Task} from "./Web3Task.sol";
import {AccessControl} from "./AccessControl.sol";
import {Multicall} from "./Multicall.sol";

contract TasksManager is AccessControl, Web3Task, Multicall {
    /// @dev Emitted when a task cannot be changed.
    error TaskCannotBeChanged(uint256 taskId, Status status);

    /// @dev Emitted when a title is updated.
    event TitleUpdated(uint256 indexed taskId, string title);

    /// @dev Emitted when a description is updated.
    event DescriptionUpdated(uint256 indexed taskId, string description);

    /// @dev Emitted when an end date is updated.
    event EndDateUpdated(uint256 indexed taskId, uint256 endDate);

    /// @dev Emitted when metadata is updated.
    event MetadataUpdated(uint256 indexed taskId, string metadata);

    /**
     * @dev This function sets a new `title` for a task.
     *
     * Emits a {TitleUpdated} event.
     */
    function setTitle(uint256 _taskId, string memory _title) public virtual {
        validateTask(_taskId);
        _tasks[_taskId].title = _title;
        emit TitleUpdated(_taskId, _title);
    }

    /**
     * @dev This function sets a new `description` for a task.
     *
     * Emits a {DescriptionUpdated} event.
     */
    function setDescription(
        uint256 _taskId,
        string memory _description
    ) public virtual {
        validateTask(_taskId);
        _tasks[_taskId].description = _description;
        emit DescriptionUpdated(_taskId, _description);
    }

    /**
     * @dev This function sets a new `endDate` for a task.
     *
     * Emits a {EndDateUpdated} event.
     */
    function setEndDate(uint256 _taskId, uint256 _endDate) public virtual {
        validateTask(_taskId);
        _tasks[_taskId].endDate = _endDate;
        emit EndDateUpdated(_taskId, _endDate);
    }

    /**
     * @dev This function sets a new `metadata` for a task.
     *
     * Emits a {MetadataUpdated} event.
     *
     * NOTE: This function is not restricted by the task status. It can be
     * called at any time by the authorized operators.
     */
    function setMetadata(
        uint256 _taskId,
        string memory _metadata
    ) public virtual {
        validateTask(_taskId);
        _tasks[_taskId].metadata = _metadata;
        emit MetadataUpdated(_taskId, _metadata);
    }

    /**
     * @dev This function checks if a task can be changed.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id withing the right timestamp.
     * - `task.status` must not be `Status.Completed` or `Status.Canceled`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function validateTask(uint256 _taskId) internal view {
        Task memory task = getTask(_taskId);

        if (task.status == Status.Completed || task.status == Status.Canceled) {
            revert TaskCannotBeChanged(_taskId, task.status);
        }

        if (!hasRole(task.creatorRole, msg.sender)) {
            revert Unauthorized(msg.sender);
        }
    }
}
