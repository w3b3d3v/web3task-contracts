// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Web3Task} from "./Web3Task.sol";
import {AccessControl} from "./AccessControl.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

contract TasksManager is AccessControl, Web3Task, Multicall {
    /// @dev Emitted when a task cannot be changed.
    error TaskCannotBeChanged(uint256 _taskId);

    /// @dev Emitted when a title is updated.
    event TitleUpdated(uint256 indexed _taskId);

    /// @dev Emitted when a description is updated.
    event DescriptionUpdated(uint256 indexed _taskId);

    /// @dev Emitted when an end date is updated.
    event EndDateUpdated(uint256 indexed _taskId);

    /// @dev Emitted when metadata is updated.
    event MetadataUpdated(uint256 indexed _taskId);

    /**
     * @dev This function checks if a task is concluded or canceled.
     */
    function isTerminated(uint256 _taskId) public view returns (bool) {
        Task memory task = getTask(_taskId);

        if (task.status == Status.Completed || task.status == Status.Canceled) {
            return true;
        }

        return false;
    }

    /**
     * @dev This function sets a new `title` for a task.
     *
     * Emits a {TitleUpdated} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `task.status` must not be `Status.Completed` or `Status.Canceled`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function setTitle(
        uint256 _taskId,
        uint256 _authorized,
        string memory _title
    )
        public
        virtual
        onlyOperator(this.setTitle.selector, _authorized, msg.sender)
    {
        if (isTerminated(_taskId)) {
            revert TaskCannotBeChanged(_taskId);
        }

        _tasks[_taskId].title = _title;

        emit TitleUpdated(_taskId);
    }

    /**
     * @dev This function sets a new `description` for a task.
     *
     * Emits a {DescriptionUpdated} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `task.status` must not be `Status.Completed` or `Status.Canceled`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function setDescription(
        uint256 _taskId,
        uint256 _authorized,
        string memory _description
    )
        public
        virtual
        onlyOperator(this.setDescription.selector, _authorized, msg.sender)
    {
        if (isTerminated(_taskId)) {
            revert TaskCannotBeChanged(_taskId);
        }

        _tasks[_taskId].description = _description;

        emit DescriptionUpdated(_taskId);
    }

    /**
     * @dev This function sets a new `endDate` for a task.
     *
     * Emits a {EndDateUpdated} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `task.status` must not be `Status.Completed` or `Status.Canceled`.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     */
    function setEndDate(
        uint256 _taskId,
        uint256 _authorized,
        uint256 _endDate
    )
        public
        virtual
        onlyOperator(this.setEndDate.selector, _authorized, msg.sender)
    {
        if (isTerminated(_taskId)) {
            revert TaskCannotBeChanged(_taskId);
        }

        _tasks[_taskId].endDate = _endDate;

        emit EndDateUpdated(_taskId);
    }

    /**
     * @dev This function sets a new `metadata` for a task.
     *
     * Emits a {MetadataUpdated} event.
     *
     * Requirements:
     *
     * - `_taskId` must be a valid task id.
     * - `msg.sender` must be an authorized operator (see {AccessControl}).
     *
     * NOTE: This function is not restricted by the task status. It can be
     * called at any time by the authorized operators.
     */
    function setMetadata(
        uint256 _taskId,
        uint256 _authorized,
        string memory _metadata
    )
        public
        virtual
        onlyOperator(this.setMetadata.selector, _authorized, msg.sender)
    {
        if (_tasks[_taskId].endDate < block.timestamp) {
            revert TaskCannotBeChanged(_taskId);
        }

        _tasks[_taskId].metadata = _metadata;

        emit MetadataUpdated(_taskId);
    }
}
