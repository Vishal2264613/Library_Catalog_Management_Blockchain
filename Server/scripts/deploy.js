const main = async () => {
  const ContractFactory = await hre.ethers.getContractFactory("Library");
  const Contract = await ContractFactory.deploy();
  await Contract.deployed();
  console.log("Contract deployed to:", Contract.address);
};
//0xB394d790Caa7131f04DB4337c4C417CAE0cC942a
const runMain = async () => {
  try {
    await main();
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

runMain();
