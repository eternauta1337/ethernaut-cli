import "hardhat/types/config";

interface InteractConfig {
  etherscanApiKey?: string;
}

declare module "hardhat/types/config" {
  export interface HardhatUserConfig {
    interact?: InteractConfig;
  }

  export interface HardhatConfig {
    interact: InteractConfig;
  }
}
