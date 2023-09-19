// SPDX-License-Identifier: MIT
pragma solidity ^0.8.13;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract MoveNFT is ERC721URIStorage {
  using Counters for Counters.Counter;
  Counters.Counter private _tokenIds;

  Move[] public moves;
  mapping(address => Move[]) public playerMoves;

  constructor() ERC721("Move NFT", "MOVE") {}

  struct Move {
    uint256 id;
    string name;
    uint256 power;
  }

  function getMyMoves(address _owner) public view returns (Move[] memory){
    return playerMoves[_owner];
  }

  function mint(address _to, string memory _tokenURI_, string calldata _name, uint256 _power) public returns (uint256) {
    uint256 newItemId = _tokenIds.current();
    _mint(_to, newItemId);
    _setTokenURI(newItemId, _tokenURI_);

    _tokenIds.increment();
    moves.push(Move(newItemId, _name, _power));
    playerMoves[_to].push(Move(newItemId, _name, _power));
    return newItemId;
  }
}