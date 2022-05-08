// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IGatekeeperOne { 
    function enter(bytes8 _gateKey) external returns (bool);
}

contract Entrant is Ownable {
    IGatekeeperOne _gateKeeper;

    constructor(address _gatekeeperAddress) public payable {
        _gateKeeper = IGatekeeperOne(_gatekeeperAddress);
    }

    function enterGate(uint256 gasToUse) public onlyOwner returns (bool) {
        // The key needs to fulfill:
        // 0x11111111 == 0x1111 => mask would be 0x0000FFFF
        // 0x1111111100001111 != 0x00001111 => mask would be 0xFFFFFFFF0000FFFF
        // uint32(uint64(_gateKey)) == uint16(tx.origin)

        // Ethereum address (40 digits after 0x) is convertible in bytes20 which 
        // is convertible in uint160 without losing data
        // the convert to uint64 => bytes8
        bytes8 key = bytes8(uint64(uint160(tx.origin))) & 0xFFFFFFFF0000FFFF;
        return _gateKeeper.enter{gas: gasToUse}(key);
    }

}
