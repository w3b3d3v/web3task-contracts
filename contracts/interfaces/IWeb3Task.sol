// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

interface IWeb3Task {
    event TaskCreated(
        uint256 indexed taskId,
        address indexed creator,
        address indexed assignee,
        uint256 reward,
        uint256 endDate
    );
    event TaskStarted(uint256 indexed taskId, address indexed assignee);
    event TaskUpdated(uint256 indexed taskId, Status status);

    enum Status {
        Created,
        Progress,
        Review,
        Completed,
        Canceled
    }

    struct Task {
        Status status;
        string title;
        string description;
        uint256 reward;
        uint256 endDate;
        uint256[] authorized;
        uint256 creator;
        address assignee;
        string metadata;
    }
}
