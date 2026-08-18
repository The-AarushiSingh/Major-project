const hre = require("hardhat");

async function main() {
  const BlockLance = await hre.ethers.getContractFactory("BlockLance");
  const blockLance = await BlockLance.deploy();

  await blockLance.waitForDeployment();

  console.log("BlockLance deployed to:", await blockLance.getAddress());
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});