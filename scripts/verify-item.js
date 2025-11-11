const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  // Get chipId from environment variable or command line
  let chipId = process.env.CHIP_ID;
  
  // If not in env, try to get from command line (for older usage)
  if (!chipId) {
    const args = process.argv.slice(2).filter(arg => 
      !arg.startsWith('--') && 
      arg !== 'scripts/verify-item.js' &&
      !arg.includes('/')
    );
    chipId = args[0];
  }
  
  if (!chipId) {
    console.log("Usage: CHIP_ID=<chipId> npx hardhat run scripts/verify-item.js --network <network>");
    console.log("Example: CHIP_ID=NFC-1234567890 npx hardhat run scripts/verify-item.js --network amoy");
    console.log("\nAlternatively, set CHIP_ID in your .env file");
    process.exit(1);
  }

  console.log("🔍 Verifying item with chip ID:", chipId, "\n");

  // Get contract address
  let contractAddress = process.env.CONTRACT_ADDRESS;
  
  if (!contractAddress) {
    const fs = require("fs");
    const path = require("path");
    const network = await ethers.provider.getNetwork();
    const deploymentFile = path.join(
      __dirname,
      "..",
      "deployments",
      `${network.name}-deployment.json`
    );
    
    if (fs.existsSync(deploymentFile)) {
      const deployment = JSON.parse(fs.readFileSync(deploymentFile, "utf8"));
      contractAddress = deployment.contractAddress;
    } else {
      console.error("❌ Contract address not found");
      process.exit(1);
    }
  }

  // Load contract
  const LuxuryGoodsNFT = await ethers.getContractFactory("LuxuryGoodsNFT");
  const contract = LuxuryGoodsNFT.attach(contractAddress);

  // Verify the item
  const [isValid, tokenId, owner] = await contract.verifyItemByChipId(chipId);

  if (!isValid || tokenId === 0n) {
    console.log("❌ Item not found or not authenticated");
    console.log("   This chip ID has not been registered in the system");
    process.exit(0);
  }

  console.log("✅ Item is authenticated!");
  console.log("========================");
  console.log("Token ID:", tokenId.toString());
  console.log("Current Owner:", owner);

  // Get detailed information
  const itemDetails = await contract.getItemDetails(tokenId);
  console.log("\n📋 Item Details:");
  console.log("========================");
  console.log("Brand:", itemDetails.brand);
  console.log("Model:", itemDetails.model);
  console.log("Serial Number:", itemDetails.serialNumber);
  console.log("Chip ID:", itemDetails.chipId);
  console.log("Verifier:", itemDetails.verifier);
  console.log("Verification Date:", new Date(Number(itemDetails.verificationDate) * 1000).toISOString());
  console.log("Status:", itemDetails.isAuthenticated ? "✅ Authenticated" : "❌ Not Authenticated");

  // Get token URI
  try {
    const tokenURI = await contract.tokenURI(tokenId);
    console.log("\n🌐 Token URI:");
    console.log(tokenURI);
  } catch (error) {
    console.log("\n⚠️  Could not fetch token URI");
  }
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error.message);
    process.exit(1);
  });

