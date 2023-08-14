// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

import {ERC721} from "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract Web3Task is ERC721, Ownable {
    uint256 public nextTokenId;

    constructor(string memory name, string memory symbol) ERC721(name, symbol) {
        nextTokenId = 1;
    }

    function mint(address to) external onlyOwner {
        uint256 tokenId = nextTokenId;
        nextTokenId++;
        _safeMint(to, tokenId);
    }
}