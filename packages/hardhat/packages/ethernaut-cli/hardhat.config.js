"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("@ethernaut-cli-hardhat/ethernaut-interactive");
require("@ethernaut-cli-hardhat/ethernaut-toolkit");
require("@ethernaut-cli-hardhat/ethernaut-play");
require("@ethernaut-cli-hardhat/ethernaut-interact");
const config = {
    solidity: '0.8.19',
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            chainId: 11155111,
            forking: {
                url: `https://eth-sepolia.g.alchemy.com/v2/${process.env.ALCHEMY_API_KEY}`,
            },
        },
    },
    interact: {
        etherscanApiKey: process.env.ETHERSCAN_API_KEY,
    },
};
exports.default = config;
