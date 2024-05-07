require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("dotenv").config();
require("@nomiclabs/hardhat-ethers")
/** @type import('hardhat/config').HardhatUserConfig */

// require('./tasks/block-number');
const SEPOLIA_URL = process.env.RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;



module.exports = {
  defaultNetwork:"hardhat",
  networks: {
    sepolia: {
      url:SEPOLIA_URL,
      accounts: [PRIVATE_KEY],
      chainId: 11155111,
      
    },  
    
    localhost: {
      url:"HTTP://127.0.0.1:8545",
      accounts:["0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80"],
      // chainId:1337
    },
    ganache: {
      url: "HTTP://127.0.0.1:7545",
      accounts: ['0x27f446f1ebc19d91da75b9cac7e664bac854e077800ab949bdad35d2bad60fca'],
      chainId: 1337
    }
    
    
  },
  namedAccounts: {
    deployer: {
        default: 0, // here this will by default take the first account as deployer
         // similarly on mainnet it will take the first account as deployer. Note though that depending on how hardhat network are configured, the account 0 on one network can be different than on another
    },
    player:{default:1},
},
  solidity: {
    compilers : [{version: "0.8.4"},{version: "0.6.6"}],
  },
  
};
