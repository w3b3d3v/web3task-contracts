# Web3Task-contracts

This protocol aims to solve the problem of monetized contribuitions by fractionalizing work and demands just like the github issues, where the company creates the issues and places a bouty for users to solve them under the company's terms.

## Current Status

Project is currently under the MvP stage. The following features will be implemented in the next versions:

- Bid
- Disputes
- Ranking
- Proxy
- Fee Mechanism
- Deployment for 3rd-parties (Multiple projects using the same contract to optimize front-end indexing)

if you are a developer and want to contribute to this features, please contact us as we are still in the conception phase of them.

## Disputes

We are aware that disputes are a common ground in this kind of service, so we are not mainly working on a solution to address this problem as a lot of people tried and failed. Instead our solution is a gamified approach for both task creator and task assignee. Delivering prior to date will harvest better score for the assignee, while having its created tasks completed the task creator will also harvest profile score. This score will be used to rank users in the platform, and the higher the score the more trustable the user is. Opening disputes is supposed to be a risky and unworthy move by both sides, as disputes will drastically decrease the score of both sides or the side that is wrong according to the DAO final saying.

## Bounties

The task creator will be able to create a task and set a bounty for it, and the task assignee will be able to start the task and submit it for review. If the task creator approves the task, the bounty will be sent to the task assignee, otherwise the task creator will be able to cancel the task and get the bounty back.

## Ranking

The ranking system will be based on the score of the user, which will be calculated based on the following factors:

- Deliver time prior to deadline
- Reward Amount
- Disputes during the execution of the task

The scores will only be applied after the task final complitude.

## Features

Regarding Task management, the following features are implemented:

- Create
- Start
- Review
- Complete
- Cancel
- Edit Title
- Edit Description
- Edit Deadline
- Edit Metadata

Note that editing sensitive information that might affect the task assignee will not be allowed.

To manage the Access Control of users, the following methods are implemented:

- Set Role: Sets the role id for an address as true,
- Set Operator: Sets which role id can manage the contract functions.

## Contracts

- TaskManager: The main contract that manages the tasks.
- AccessControl: The contract that manages the access control of the users.
- Web3Task: The core implementation of the task marketplace.
- IW3Task: The interface of the Web3Task contract.

## Installation

```bash
yarn
npm i
```

## Setting Up Local Blockchain

Run a Hardhat node:

```bash
npx hardhat node
```

The node will generate some accounts. Add the first one to Metamask.

> **_NOTE:_** Note: Use the first account to avoid errors.

## Deploying Smart Contracts Local Blockchain

Deploy the TaskManager contract

```bash
npx hardhat run --network localhost scripts/deploy.ts
```

Funding the Contract

```bash
npx hardhat run --network localhost scripts/fundingContract.ts
```

## Livenet Deployment

Remove the `.sample` from the `.env.sample` file and fill in the values with the corresponding API from RPC providers.

## Usage

If you are not using livenet, you should comment chain condigurations at `hardhat.config.ts` or mock the keys in the `.env` file, otherwise you will get an error from hardhat.

```bash
yarn test
```

## Contact

Advisor: 0xneves (@ownerlessinc)

This project is under the MIT license, feel free to use it and contribute. If you have any questions, please contact us at https://discord.gg/web3dev under the `pod-labs` channel.
