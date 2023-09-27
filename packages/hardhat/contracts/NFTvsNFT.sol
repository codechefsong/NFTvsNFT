//SPDX-License-Identifier: MIT
pragma solidity >=0.8.0 <0.9.0;

import "@openzeppelin/contracts/utils/Counters.sol";

import "./ERC6551Registry.sol";

contract NFTvsNFT {
  using Counters for Counters.Counter;
  Counters.Counter public numberOfMatches;
  ERC6551Registry public registry;

  address public immutable owner;
  mapping(address => address) public tbaList;
  mapping(address => string) public tbaImageList;
  Match[] public matchList;
  
  struct Match {
    uint256 id;
    address player1;
    address player2;
    address nft1;
    address nft2;
    uint256 hp1;
    uint256 hp2;
    bool isMatch;
  }

  constructor(address _owner, address _registryAddress) {
    owner = _owner;
    registry = ERC6551Registry(_registryAddress);
  }

  function getMatches() public view returns (Match[] memory){
    return matchList;
  }

  function getMatchById(uint256 _id) public view returns (Match memory){
    return matchList[_id];
  }

  function createTokenBoundAccount(
    address _implementation,
    uint256 _chainId,
    address _tokenContract,
    uint256 _tokenId,
    uint256 _salt,
    bytes calldata _initData,
    string calldata _url
  ) external {
    address newTBA = registry.createAccount(_implementation, _chainId, _tokenContract, _tokenId, _salt, _initData);
    tbaList[msg.sender] = newTBA;
    tbaImageList[newTBA] = _url;
  }

  function createMatch() external {
    uint256 newMatchId = numberOfMatches.current();
    matchList.push(Match(newMatchId, msg.sender, address(0), tbaList[msg.sender], address(0), 100, 100, false));
    numberOfMatches.increment();
  }

  function joinMatch(uint256 _matchId) external {
    matchList[_matchId].player2 = msg.sender;
    matchList[_matchId].player2 = tbaList[msg.sender];
    matchList[_matchId].isMatch = true;
  }

  function attack(uint256 _matchId, uint256 _damage) external {
    if (matchList[_matchId].player1 == msg.sender) {
      if (_damage > matchList[_matchId].hp2) {
        matchList[_matchId].hp2 -= 0;
      }
      else matchList[_matchId].hp2 -= _damage;
    }
    else {
      if (_damage > matchList[_matchId].hp1) {
        matchList[_matchId].hp1 -= 0;
      }
      else matchList[_matchId].hp1 -= _damage;
    }
  }

  // Modifier: used to define a set of rules that must be met before or after a function is executed
  // Check the withdraw() function
  modifier isOwner() {
    // msg.sender: predefined variable that represents address of the account that called the current function
    require(msg.sender == owner, "Not the Owner");
    _;
  }

  /**
   * Function that allows the owner to withdraw all the Ether in the contract
   * The function can only be called by the owner of the contract as defined by the isOwner modifier
   */
  function withdraw() public isOwner {
    (bool success, ) = owner.call{ value: address(this).balance }("");
    require(success, "Failed to send Ether");
  }

  /**
   * Function that allows the contract to receive ETH
   */
  receive() external payable {}
}