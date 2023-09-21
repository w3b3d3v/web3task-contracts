// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import {Web3Task} from "./Web3Task.sol";
import {AccessControl} from "./AccessControl.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

contract TasksManager is AccessControl, Web3Task, Multicall {
    error TaskCannotBeChanged(uint256 _taskId);
    event TitleUpdated(uint256 indexed _taskId);
    event DescriptionUpdated(uint256 indexed _taskId);
    event EndDateUpdated(uint256 indexed _taskId);
    event MetadataUpdated(uint256 indexed _taskId);

    function isConcluded(uint256 _taskId) public view returns (bool) {
        if (
            _tasks[_taskId].status == Status.Completed ||
            _tasks[_taskId].status == Status.Canceled
        ) {
            return true;
        }
        return false;
    }

    function setTitle(
        uint256 _taskId,
        uint256 _authorized,
        string memory _title
    )
        public
        virtual
        onlyOperator(this.setTitle.selector, _authorized, msg.sender)
    {
        if (isConcluded(_taskId)) {
            revert TaskCannotBeChanged(_taskId);
        }
        _tasks[_taskId].title = _title;
        emit TitleUpdated(_taskId);
    }

    function setDescription(
        uint256 _taskId,
        uint256 _authorized,
        string memory _description
    )
        public
        virtual
        onlyOperator(this.setDescription.selector, _authorized, msg.sender)
    {
        if (isConcluded(_taskId)) {
            revert TaskCannotBeChanged(_taskId);
        }
        _tasks[_taskId].description = _description;
        emit DescriptionUpdated(_taskId);
    }

    function setEndDate(
        uint256 _taskId,
        uint256 _authorized,
        uint256 _endDate
    )
        public
        virtual
        onlyOperator(this.setEndDate.selector, _authorized, msg.sender)
    {
        if (isConcluded(_taskId)) {
            revert TaskCannotBeChanged(_taskId);
        }
        _tasks[_taskId].endDate = _endDate;
        emit EndDateUpdated(_taskId);
    }

    function setMetadata(
        uint256 _taskId,
        uint256 _authorized,
        string memory _metadata
    )
        public
        virtual
        onlyOperator(this.setMetadata.selector, _authorized, msg.sender)
    {
        _tasks[_taskId].metadata = _metadata;
        emit MetadataUpdated(_taskId);
    }
}
