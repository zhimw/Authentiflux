const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🧪 Testing NFT Minting...\n");

  // Based on frontend/backend setup:
  // Account 0 = verifier (minter)
  // Account 1 = item owner
  const [verifier, owner1] = await ethers.getSigners();
  console.log("👤 Verifier (Account 0):", verifier.address);
  console.log("👤 Owner 1 (Account 1):", owner1.address);

  // Get contract address from environment or deployment file
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
      console.log("📄 Loaded contract address from deployment file");
    } else {
      console.error("❌ Contract address not found. Please deploy first or set CONTRACT_ADDRESS in .env");
      process.exit(1);
    }
  }

  console.log("📄 Contract address:", contractAddress, "\n");

  // Load contract
  const LuxuryGoodsNFT = await ethers.getContractFactory("LuxuryGoodsNFT");
  const contract = LuxuryGoodsNFT.attach(contractAddress);

  // Test data
  const testItem = {
    owner: owner1.address, // Mint to Owner 1
    brand: "Louis Vuitton",
    model: "Neverfull MM",
    serialNumber: "FL4198",
    chipId: "NFC-" + Date.now(),
    tokenURI: "ipfs://QmTest123456789"
  };

  console.log("🎯 Minting test item:");
  console.log("   Brand:", testItem.brand);
  console.log("   Model:", testItem.model);
  console.log("   Serial Number:", testItem.serialNumber);
  console.log("   Chip ID:", testItem.chipId);
  console.log("   Owner (Account 1):", testItem.owner);
  console.log("");

  // Check if verifier (account 0) is authorized
  const isAuthorized = await contract.authorizedVerifiers(verifier.address);
  console.log("🔐 Verifier (Account 0) authorized:", isAuthorized);

  if (!isAuthorized) {
    console.log("⚠️  Verifier not authorized. Attempting to authorize...");
    const authTx = await contract.setVerifierAuthorization(verifier.address, true);
    await authTx.wait();
    console.log("✅ Deployer authorized");
  }

  // Mint the NFT
  console.log("\n⏳ Minting NFT...");
  const tx = await contract.mintAuthenticatedItem(
    testItem.owner,
    testItem.brand,
    testItem.model,
    testItem.serialNumber,
    testItem.chipId,
    testItem.tokenURI
  );

  console.log("📝 Transaction hash:", tx.hash);
  const receipt = await tx.wait();
  console.log("✅ Transaction confirmed in block:", receipt.blockNumber);

  // Get token ID from event
  const event = receipt.logs.find(log => {
    try {
      return contract.interface.parseLog(log)?.name === "ItemAuthenticated";
    } catch {
      return false;
    }
  });

  let tokenId;
  if (event) {
    const parsed = contract.interface.parseLog(event);
    tokenId = parsed.args.tokenId.toString();
    console.log("🎫 Token ID:", tokenId);
  }

  // Verify the item
  console.log("\n🔍 Verifying item by chip ID...");
  const [isValid, verifiedTokenId, owner] = await contract.verifyItemByChipId(testItem.chipId);
  
  console.log("   Is Valid:", isValid);
  console.log("   Token ID:", verifiedTokenId.toString());
  console.log("   Owner:", owner);

  // Get item details
  console.log("\n📋 Fetching item details...");
  const itemDetails = await contract.getItemDetails(verifiedTokenId);
  console.log("   Brand:", itemDetails.brand);
  console.log("   Model:", itemDetails.model);
  console.log("   Serial Number:", itemDetails.serialNumber);
  console.log("   Chip ID:", itemDetails.chipId);
  console.log("   Verifier:", itemDetails.verifier);
  console.log("   Verification Date:", new Date(Number(itemDetails.verificationDate) * 1000).toISOString());
  console.log("   Is Authenticated:", itemDetails.isAuthenticated);

  // Get total items
  const totalItems = await contract.getTotalAuthenticatedItems();
  console.log("\n📊 Total authenticated items:", totalItems.toString());

  console.log("\n✅ Test completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });

