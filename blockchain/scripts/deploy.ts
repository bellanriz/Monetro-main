import { ethers } from "hardhat";

async function main() {
  console.log("Deploying MonetroToken to network...");

  const [deployer] = await ethers.getSigners();
  console.log("Deploying with account:", deployer.address);

  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("Account balance:", ethers.formatEther(balance), "ETH");

  const MonetroToken = await ethers.getContractFactory("MonetroToken");
  const token = await MonetroToken.deploy();

  await token.waitForDeployment();

  const address = await token.getAddress();
  console.log("\n✅ MonetroToken deployed successfully!");
  console.log("Contract address:", address);
  console.log("\nSave this address — you'll need it in your backend .env file.");
  console.log(`\nView on Etherscan: https://sepolia.etherscan.io/address/${address}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
