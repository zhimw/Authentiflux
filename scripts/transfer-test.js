const { ethers } = require("hardhat");
require("dotenv").config();

// Helper: advance on-chain time by a few seconds so block timestamps differ
async function waitSeconds(seconds) {
  console.log(`⏱  Waiting ${seconds} seconds (advancing blockchain time)...`);
  await ethers.provider.send("evm_increaseTime", [seconds]);
  await ethers.provider.send("evm_mine");
}

async function main() {
  console.log("🔄 Testing Item Transfer with Price Recording...\n");

  // Based on frontend setup:
  // Account 0 = verifier
  // Account 1 = Owner 1 (initial owner)
  // Account 2 = Owner 2 (buyer)
  const [verifier, owner1, owner2] = await ethers.getSigners();
  console.log("👤 Verifier (Account 0):", verifier.address);
  console.log("👤 Owner 1 (Account 1):", owner1.address);
  console.log("👤 Owner 2 (Account 2):", owner2.address);

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

  console.log("📄 Contract address:", contractAddress, "\n");

  // Load contract
  const LuxuryGoodsNFT = await ethers.getContractFactory("LuxuryGoodsNFT");
  const contract = LuxuryGoodsNFT.attach(contractAddress);

  // Step 1: Mint an item
  console.log("📦 Step 1: Minting new item...");
  const testItem = {
    owner: owner1.address, // Mint to Owner 1
    brand: "Rolex",
    model: "Submariner",
    serialNumber: "RS-2024-001",
    chipId: "NFC-ROLEX-" + Date.now(),
    tokenURI: "ipfs://QmTestRolex"
  };

  // Authorize verifier (account 0) if needed
  const isAuthorized = await contract.authorizedVerifiers(verifier.address);
  if (!isAuthorized) {
    console.log("🔐 Authorizing verifier (account 0)...");
    const authTx = await contract.setVerifierAuthorization(verifier.address, true);
    await authTx.wait();
  }

  // Mint is performed by the verifier for Owner 1
  const mintTx = await contract.mintAuthenticatedItem(
    testItem.owner,
    testItem.brand,
    testItem.model,
    testItem.serialNumber,
    testItem.chipId,
    testItem.tokenURI
  );
  const mintReceipt = await mintTx.wait();
  
  // Get token ID from event
  const event = mintReceipt.logs.find(log => {
    try {
      return contract.interface.parseLog(log)?.name === "ItemAuthenticated";
    } catch {
      return false;
    }
  });
  
  const tokenId = contract.interface.parseLog(event).args.tokenId;
  console.log("✅ Item minted with Token ID:", tokenId.toString());
  console.log("   Owner:", await contract.ownerOf(tokenId));
  
  // Check initial history
  let history = await contract.getTransferHistory(tokenId);
  console.log("   Transfer history entries:", history.length);
  console.log("");

  // Step 2: Transfer from Owner 1 to Owner 2 with price
  console.log("💰 Step 2: Transferring from Owner 1 (Account 1) to Owner 2 (Account 2) (Sale for 2.5 ETH)...");
  const price1 = ethers.parseEther("2.5"); // 2.5 ETH

  // Advance on-chain time by 2 minutes so timestamps clearly differ
  await waitSeconds(120);
  const transfer1Tx = await contract.connect(owner1).transferWithPrice(
    owner1.address,
    owner2.address,
    tokenId,
    price1
  );
  await transfer1Tx.wait();
  
  console.log("✅ Transfer 1 complete");
  console.log("   New owner:", await contract.ownerOf(tokenId));
  console.log("   Price:", ethers.formatEther(price1), "ETH");
  
  const acquisitionTime1 = await contract.getCurrentOwnerAcquisitionTime(tokenId);
  console.log("   Owner2 acquired at:", new Date(Number(acquisitionTime1) * 1000).toISOString());
  console.log("");
  
  // Step 3: Get complete transfer history
  console.log("📊 Step 3: Complete Transfer History");
  console.log("=====================================");
  
  history = await contract.getTransferHistory(tokenId);
  console.log(`Total transfers: ${history.length}\n`);
  
  history.forEach((record, index) => {
    const fromAddr = record.from === ethers.ZeroAddress ? "Minted" : record.from;
    const toAddr = record.to;
    const timestamp = new Date(Number(record.timestamp) * 1000).toISOString();
    const price = ethers.formatEther(record.price);
    
    console.log(`Transfer ${index + 1}:`);
    console.log(`  From: ${fromAddr}`);
    console.log(`  To: ${toAddr}`);
    console.log(`  Time: ${timestamp}`);
    console.log(`  Price: ${price} ETH ${record.price === 0n ? "(Gift/Mint)" : ""}`);
    console.log("");
  });

  // Summary
  console.log("📋 Summary");
  console.log("==========");
  console.log("Item:", `${testItem.brand} ${testItem.model}`);
  console.log("Chip ID:", testItem.chipId);
  console.log("Token ID:", tokenId.toString());
  console.log("Current Owner:", await contract.ownerOf(tokenId));
  console.log("Total Transfers:", history.length);
  console.log("Total Value Exchanged:", 
    ethers.formatEther(history.reduce((sum, record) => sum + record.price, 0n)), "ETH");
  
  console.log("\n✅ Transfer test completed successfully!");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Test failed:", error);
    process.exit(1);
  });

