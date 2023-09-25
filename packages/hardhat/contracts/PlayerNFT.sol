// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract PlayerNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  mapping(address => Player[]) public mynfts;

  struct Player {
    uint256 id;
    string url;
  }

  constructor() ERC721("Player NFT", "PLY") {}

  function mint(address _to, string memory _tokenURI) public returns (uint256) {
    uint256 newItemId = _tokenIds.current();
    _mint(_to, newItemId);
    _setTokenURI(newItemId, _tokenURI);

    _tokenIds.increment();
    mynfts[_to].push(Player(newItemId, _tokenURI));
    return newItemId;
  }

  function getMyNFTs(address _owner) public view returns (Player[] memory){
    return mynfts[_owner];
  }
}