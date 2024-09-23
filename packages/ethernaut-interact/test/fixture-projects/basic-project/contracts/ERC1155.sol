// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './ERC165.sol';

/// @title ERC1155 Interface
interface IERC1155 is IERC165 {
    event TransferSingle(
        address indexed operator,
        address indexed from,
        address indexed to,
        uint256 id,
        uint256 value
    );

    function balanceOf(
        address account,
        uint256 id
    ) external view returns (uint256);

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) external;
}

contract ERC1155 is ERC165, IERC1155 {
    mapping(uint256 => mapping(address => uint256)) private _balances;

    constructor() {
        _registerInterface(0xd9b67a26); // ERC-1155 Interface ID
    }

    function balanceOf(
        address account,
        uint256 id
    ) public view override returns (uint256) {
        return _balances[id][account];
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount
    ) external override {
        require(to != address(0), 'ERC1155: transfer to the zero address');
        require(_balances[id][from] >= amount, 'ERC1155: insufficient balance');

        _balances[id][from] -= amount;
        _balances[id][to] += amount;

        emit TransferSingle(msg.sender, from, to, id, amount);
    }

    function _mint(address to, uint256 id, uint256 amount) internal {
        require(to != address(0), 'ERC1155: mint to the zero address');
        _balances[id][to] += amount;

        emit TransferSingle(msg.sender, address(0), to, id, amount);
    }
}
