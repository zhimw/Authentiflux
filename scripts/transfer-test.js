const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("🔄 Testing Item Transfer with Price Recording...\n");

  const [owner1, owner2, owner3] = await ethers.getSigners();
  console.log("👤 Owner 1 (Initial):", owner1.address);
  console.log("👤 Owner 2 (Buyer 1):", owner2.address);
  console.log("👤 Owner 3 (Buyer 2):", owner3.address);

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
    owner: owner1.address,
    brand: "Rolex",
    model: "Submariner",
    serialNumber: "RS-2024-001",
    chipId: "NFC-ROLEX-" + Date.now(),
    tokenURI: "ipfs://QmTestRolex"
  };

  // Authorize owner1 as verifier if needed
  const isAuthorized = await contract.authorizedVerifiers(owner1.address);
  if (!isAuthorized) {
    console.log("🔐 Authorizing minter...");
    const authTx = await contract.setVerifierAuthorization(owner1.address, true);
    await authTx.wait();
  }

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

  // Step 2: Transfer from Owner1 to Owner2 with price
  console.log("💰 Step 2: Transferring from Owner1 to Owner2 (Sale for 2.5 ETH)...");
  const price1 = ethers.parseEther("2.5"); // 2.5 ETH
  
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

  // Step 3: Transfer from Owner2 to Owner3 with different price
  console.log("💰 Step 3: Transferring from Owner2 to Owner3 (Sale for 3.0 ETH)...");
  const price2 = ethers.parseEther("3.0"); // 3.0 ETH
  
  const transfer2Tx = await contract.connect(owner2).transferWithPrice(
    owner2.address,
    owner3.address,
    tokenId,
    price2
  );
  await transfer2Tx.wait();
  
  console.log("✅ Transfer 2 complete");
  console.log("   New owner:", await contract.ownerOf(tokenId));
  console.log("   Price:", ethers.formatEther(price2), "ETH");
  
  const acquisitionTime2 = await contract.getCurrentOwnerAcquisitionTime(tokenId);
  console.log("   Owner3 acquired at:", new Date(Number(acquisitionTime2) * 1000).toISOString());
  console.log("");

  // Step 4: Transfer from Owner3 back to Owner1 as gift (no price)
  console.log("🎁 Step 4: Transferring from Owner3 to Owner1 (Gift - No sale price)...");
  
  const transfer3Tx = await contract.connect(owner3).transferWithPrice(
    owner3.address,
    owner1.address,
    tokenId,
    0 // No price = gift
  );
  await transfer3Tx.wait();
  
  console.log("✅ Transfer 3 complete");
  console.log("   New owner:", await contract.ownerOf(tokenId));
  console.log("   Price: Gift (0 ETH)");
  console.log("");

  // Step 5: Get complete transfer history
  console.log("📊 Step 5: Complete Transfer History");
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

