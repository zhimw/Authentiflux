const { ethers } = require("hardhat");
require("dotenv").config();

async function main() {
  console.log("💰 Checking Account Balance\n");

  // Get signer
  const [signer] = await ethers.getSigners();
  console.log("📝 Account:", signer.address);

  // Get network info
  const network = await ethers.provider.getNetwork();
  console.log("🌐 Network:", network.name, `(Chain ID: ${network.chainId})`);

  // Get balance
  const balance = await ethers.provider.getBalance(signer.address);
  const balanceInEth = ethers.formatEther(balance);

  console.log("\n💵 Balance:");
  console.log("   Wei:", balance.toString());
  console.log("   POL:", balanceInEth);

  // Check if sufficient for deployment
  const minRequired = ethers.parseEther("0.01"); // Minimum 0.01 POL recommended
  
  if (balance < minRequired) {
    console.log("\n⚠️  WARNING: Balance is low!");
    console.log("   You may not have enough for deployment or transactions.");
    console.log("   Get test MATIC from: https://faucet.polygon.technology/");
  } else {
    console.log("\n✅ Balance is sufficient for deployment and transactions");
  }

  // If contract is deployed, show contract info
  if (process.env.CONTRACT_ADDRESS) {
    console.log("\n📄 Contract Info:");
    console.log("   Address:", process.env.CONTRACT_ADDRESS);
    
    try {
      const contractBalance = await ethers.provider.getBalance(
        process.env.CONTRACT_ADDRESS
      );
      console.log("   Balance:", ethers.formatEther(contractBalance), "POL");
    } catch (error) {
      console.log("   ⚠️  Could not fetch contract balance");
    }
  }

  console.log("");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Error:", error);
    process.exit(1);
  });

