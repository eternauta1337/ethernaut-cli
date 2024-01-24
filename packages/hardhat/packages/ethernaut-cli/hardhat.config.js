"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
require("@ethernaut-cli/ethernaut-interactive");
require("@ethernaut-cli/ethernaut-toolkit");
require("@ethernaut-cli/ethernaut-play");
const config = {
    solidity: '0.8.19',
    defaultNetwork: 'hardhat',
    networks: {
        hardhat: {
            forking: {
                url: `https://eth-mainnet.alchemyapi.io/v2/${process.env.ALCHEMY_API_KEY}`,
                blockNumber: 13000000,
            },
        },
    },
};
exports.default = config;
