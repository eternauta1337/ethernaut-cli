// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import './ERC165.sol';

/// @title ERC721 Interface
interface IERC721 is IERC165 {
    event Transfer(
        address indexed from,
        address indexed to,
        uint256 indexed tokenId
    );
    event Approval(
        address indexed owner,
        address indexed approved,
        uint256 indexed tokenId
    );

    function balanceOf(address owner) external view returns (uint256 balance);

    function ownerOf(uint256 tokenId) external view returns (address owner);

    function transferFrom(address from, address to, uint256 tokenId) external;
}

contract ERC721 is ERC165, IERC721 {
    mapping(uint256 => address) private _owners;
    mapping(address => uint256) private _balances;
    mapping(uint256 => address) private _tokenApprovals;

    constructor() {
        _registerInterface(0x80ac58cd); // ERC-721 Interface ID
    }

    function balanceOf(
        address owner
    ) external view override returns (uint256 balance) {
        require(
            owner != address(0),
            'ERC721: address zero is not a valid owner'
        );
        return _balances[owner];
    }

    function ownerOf(
        uint256 tokenId
    ) external view override returns (address owner) {
        owner = _owners[tokenId];
        require(owner != address(0), 'ERC721: invalid token ID');
    }

    function transferFrom(
        address from,
        address to,
        uint256 tokenId
    ) external override {
        require(
            from == _owners[tokenId],
            'ERC721: transfer of token that is not own'
        );
        require(to != address(0), 'ERC721: transfer to the zero address');

        _balances[from] -= 1;
        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(from, to, tokenId);
    }

    function _mint(address to, uint256 tokenId) internal {
        require(to != address(0), 'ERC721: mint to the zero address');
        require(_owners[tokenId] == address(0), 'ERC721: token already minted');

        _balances[to] += 1;
        _owners[tokenId] = to;

        emit Transfer(address(0), to, tokenId);
    }
}
