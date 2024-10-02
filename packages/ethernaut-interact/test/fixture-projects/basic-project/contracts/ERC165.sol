// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

/// @title ERC165 Interface
interface IERC165 {
    function supportsInterface(bytes4 interfaceId) external view returns (bool);
}

contract ERC165 is IERC165 {
    mapping(bytes4 => bool) private _supportedInterfaces;

    constructor() {
        // Register ERC165 itself
        _registerInterface(0x01ffc9a7);
    }

    function supportsInterface(
        bytes4 interfaceId
    ) external view override returns (bool) {
        return _supportedInterfaces[interfaceId];
    }

    function _registerInterface(bytes4 interfaceId) internal {
        _supportedInterfaces[interfaceId] = true;
    }
}
