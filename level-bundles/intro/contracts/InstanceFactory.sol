// SPDX-License-Identifier: MIT

pragma solidity ^0.8.0;

import './Instance.sol';

interface ILevel {
  function createInstance(address _player) external payable returns (address);
  function validateInstance(address payable _instance, address _player) external returns (bool);
}

contract InstanceFactory is ILevel {

  function createInstance(address _player) override public payable returns (address) {
    _player;
    return address(new Instance('ethernaut0'));
  }

  function validateInstance(address payable _instance, address _player) override public view returns (bool) {
    _player;
    Instance instance = Instance(_instance);
    return instance.getCleared();
  }
}