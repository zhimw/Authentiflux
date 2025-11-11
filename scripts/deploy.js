const { ethers } = require("hardhat");
const fs = require("fs");
const path = require("path");

async function main() {
  console.log("🚀 Deploying LuxuryGoodsNFT contract...\n");

  // Get the deployer account
  const [deployer] = await ethers.getSigners();
  console.log("📝 Deploying with account:", deployer.address);
  
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Account balance:", ethers.formatEther(balance), "POL\n");

  // Deploy the contract
  const LuxuryGoodsNFT = await ethers.getContractFactory("LuxuryGoodsNFT");
  console.log("⏳ Deploying contract...");
  
  const contract = await LuxuryGoodsNFT.deploy();
  await contract.waitForDeployment();
  
  const contractAddress = await contract.getAddress();
  console.log("✅ LuxuryGoodsNFT deployed to:", contractAddress);
  
  // Get network information
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, "(Chain ID:", network.chainId, ")\n");

  // Save deployment information
  const deploymentInfo = {
    network: network.name,
    chainId: Number(network.chainId),
    contractAddress: contractAddress,
    deployer: deployer.address,
    deploymentTime: new Date().toISOString(),
    blockNumber: await ethers.provider.getBlockNumber()
  };

  const deploymentsDir = path.join(__dirname, "..", "deployments");
  if (!fs.existsSync(deploymentsDir)) {
    fs.mkdirSync(deploymentsDir);
  }

  const deploymentFile = path.join(
    deploymentsDir,
    `${network.name}-deployment.json`
  );
  
  fs.writeFileSync(
    deploymentFile,
    JSON.stringify(deploymentInfo, null, 2)
  );
  
  console.log("📄 Deployment info saved to:", deploymentFile);

  // Authorize the deployer as a verifier for testing
  console.log("\n🔐 Authorizing deployer as verifier...");
  const tx = await contract.setVerifierAuthorization(deployer.address, true);
  await tx.wait();
  console.log("✅ Deployer authorized as verifier");

  console.log("\n📋 Deployment Summary:");
  console.log("========================");
  console.log("Contract Address:", contractAddress);
  console.log("Deployer:", deployer.address);
  console.log("Network:", network.name);
  console.log("========================\n");

  console.log("💡 Next steps:");
  console.log("1. Update your .env file with CONTRACT_ADDRESS=" + contractAddress);
  console.log("2. Start the backend: npm run backend");
  console.log("3. Test minting with scripts/mint-test.js\n");

  return contractAddress;
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });

