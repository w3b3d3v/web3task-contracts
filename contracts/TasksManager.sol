// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {Web3Task} from "./Web3Task.sol";
import {AccessControl} from "./AccessControl.sol";
import {Multicall} from "@openzeppelin/contracts/utils/Multicall.sol";

error NotConcluded(uint256 _taskId);

contract TasksManager is AccessControl, Web3Task, Multicall {
    event TitleUpdated(uint256 indexed _taskId);
    event DescriptionUpdated(uint256 indexed _taskId);
    event EndDateUpdated(uint256 indexed _taskId);
    event MetadataUpdated(uint256 indexed _taskId);

    modifier isConcluded(uint256 _taskId) {
        if (
            _tasks[_taskId].status == Status.Completed ||
            _tasks[_taskId].status == Status.Canceled
        ) {
            revert NotConcluded(_taskId);
        }
        _;
    }

    function setTitle(
        uint256 _taskId,
        uint256 _authorized,
        string memory _title
    )
        external
        isConcluded(_taskId)
        onlyOperator(this.setTitle.selector, _authorized, msg.sender)
    {
        _tasks[_taskId].title = _title;
        emit TitleUpdated(_taskId);
    }

    function setDescription(
        uint256 _taskId,
        uint256 _authorized,
        string memory _description
    )
        external
        isConcluded(_taskId)
        onlyOperator(this.setDescription.selector, _authorized, msg.sender)
    {
        _tasks[_taskId].description = _description;
        emit DescriptionUpdated(_taskId);
    }

    function setEndDate(
        uint256 _taskId,
        uint256 _authorized,
        uint256 _endDate
    )
        external
        isConcluded(_taskId)
        onlyOperator(this.setEndDate.selector, _authorized, msg.sender)
    {
        _tasks[_taskId].endDate = _endDate;
        emit EndDateUpdated(_taskId);
    }

    function setMetadata(
        uint256 _taskId,
        uint256 _authorized,
        string memory _metadata
    )
        external
        isConcluded(_taskId)
        onlyOperator(this.setMetadata.selector, _authorized, msg.sender)
    {
        _tasks[_taskId].metadata = _metadata;
        emit MetadataUpdated(_taskId);
    }
}
