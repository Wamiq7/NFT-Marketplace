// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract MyToken is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor() ERC721("MyToken", "MWA") {
        tokenCounter = 0;
    }

    function createToken(string memory tokenURI) public returns (uint256) {
        uint256 tokenId = tokenCounter;
        _safeMint(msg.sender, tokenId);
        _setTokenURI(tokenId, tokenURI);
        tokenCounter++;
        return tokenId;
    }
}
