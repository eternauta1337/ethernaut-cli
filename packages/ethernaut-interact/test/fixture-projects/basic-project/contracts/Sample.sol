// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract Sample {
    uint256 public counter;

    function incrementCounter(uint256 amount) public {
        if (amount == 0) {
            amount = 1;
        }

        counter += amount;
    }

    function decrementCounter(uint256 amount) public {
        if (amount == 0) {
            amount = 1;
        }

        require(counter - amount >= 0, "Can't decrement by given amount");

        counter -= amount;
    }
}