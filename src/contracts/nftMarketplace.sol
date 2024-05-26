// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

import "./nft.sol";

contract NFTMarketplace {
    struct Listing {
        uint256 tokenId;
        address payable seller;
        uint256 price;
        bool sold;
    }

    MyToken public nftContract;
    mapping(uint256 => Listing) public listings;
    uint256 public listingCount;

    event TokenListed(uint256 tokenId, address seller, uint256 price);

    event TokenSold(uint256 tokenId, address buyer, uint256 price);

    constructor(address _nftContract) {
        nftContract = MyToken(_nftContract);
    }

    function listToken(uint256 _tokenId, uint256 _price) public {
        require(
            nftContract.ownerOf(_tokenId) == msg.sender,
            "You must own the token to list it"
        );
        require(_price > 0, "Price must be greater than zero");

        listingCount++;
        listings[_tokenId] = Listing(
            _tokenId,
            payable(msg.sender),
            _price,
            false
        );

        nftContract.transferFrom(msg.sender, address(this), _tokenId);

        emit TokenListed(_tokenId, msg.sender, _price);
    }

    function buyToken(uint256 _tokenId) public payable {
        Listing storage listing = listings[_tokenId];
        require(listing.price > 0, "Token not listed for sale");
        require(msg.value >= listing.price, "Insufficient payment");
        require(!listing.sold, "Token already sold");

        listing.seller.transfer(msg.value);
        nftContract.transferFrom(address(this), msg.sender, _tokenId);
        listing.sold = true;

        emit TokenSold(_tokenId, msg.sender, listing.price);
    }
}
