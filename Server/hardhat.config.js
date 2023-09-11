require("@nomicfoundation/hardhat-toolbox");
require("dotenv").config();

module.exports = {
  solidity: "0.8.17",
  networks: {
    fuji: {
      url: "https://api.avax-test.network/ext/bc/C/rpc",
      gasPrice: 225000000000,
      chainId: 43113,
      accounts: [
        "0d139c904419d9f8d34490c1cbd0dfcad352acc12a153753610a75bdc2034456",
      ],
    },
  },
};
