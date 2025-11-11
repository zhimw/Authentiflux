const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const { ethers } = require("ethers");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// Contract ABI (minimal, will be loaded from artifacts)
const fs = require("fs");
const path = require("path");

let contract;
let provider;
let signer;

// Initialize blockchain connection
async function initializeBlockchain() {
  try {
    // Connect to network
    const rpcUrl = process.env.POLYGON_AMOY_RPC_URL || "http://127.0.0.1:8545";
    provider = new ethers.JsonRpcProvider(rpcUrl);

    // Get network info
    const network = await provider.getNetwork();
    console.log(`🌐 Connected to network: ${network.name} (Chain ID: ${network.chainId})`);

    // Setup signer
    if (process.env.PRIVATE_KEY) {
      signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
      console.log(`🔑 Using wallet: ${signer.address}`);
    } else {
      console.warn("⚠️  No PRIVATE_KEY in .env, read-only mode");
    }

    // Load contract
    const contractAddress = process.env.CONTRACT_ADDRESS;
    if (!contractAddress) {
      console.warn("⚠️  No CONTRACT_ADDRESS in .env. Deploy contract first.");
      return;
    }

    // Load ABI from artifacts
    const artifactPath = path.join(__dirname, "..", "artifacts", "contracts", "LuxuryGoodsNFT.sol", "LuxuryGoodsNFT.json");
    const artifact = JSON.parse(fs.readFileSync(artifactPath, "utf8"));

    contract = new ethers.Contract(contractAddress, artifact.abi, signer || provider);
    console.log(`📄 Contract loaded at: ${contractAddress}\n`);
  } catch (error) {
    console.error("❌ Failed to initialize blockchain:", error.message);
  }
}

// Health check endpoint
app.get("/", (req, res) => {
  res.json({
    service: "AuthentiFlux API",
    status: "running",
    version: "1.0.0",
    contractAddress: process.env.CONTRACT_ADDRESS || "Not configured"
  });
});

// Get contract information
app.get("/api/contract/info", async (req, res) => {
  try {
    if (!contract) {
      return res.status(503).json({ error: "Contract not initialized" });
    }

    const totalItems = await contract.getTotalAuthenticatedItems();
    const name = await contract.name();
    const symbol = await contract.symbol();

    res.json({
      name,
      symbol,
      address: await contract.getAddress(),
      totalAuthenticatedItems: totalItems.toString()
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Mint a new authenticated item
app.post("/api/items/mint", async (req, res) => {
  try {
    if (!contract || !signer) {
      return res.status(503).json({ error: "Contract or signer not initialized" });
    }

    const { owner, brand, model, serialNumber, chipId, metadata } = req.body;

    // Validate required fields
    if (!owner || !brand || !model || !serialNumber || !chipId) {
      return res.status(400).json({
        error: "Missing required fields: owner, brand, model, serialNumber, chipId"
      });
    }

    // Create metadata JSON (in production, this would be uploaded to IPFS)
    const tokenMetadata = {
      name: `${brand} ${model}`,
      description: `Authenticated luxury item: ${brand} ${model}`,
      image: metadata?.image || "",
      attributes: [
        { trait_type: "Brand", value: brand },
        { trait_type: "Model", value: model },
        { trait_type: "Serial Number", value: serialNumber },
        { trait_type: "Chip ID", value: chipId },
        { trait_type: "Verification Date", value: new Date().toISOString() }
      ]
    };

    // For now, use a mock URI (in production, upload to IPFS)
    const tokenURI = metadata?.uri || `data:application/json;base64,${Buffer.from(JSON.stringify(tokenMetadata)).toString('base64')}`;

    console.log(`🔨 Minting item for ${owner}...`);
    const tx = await contract.mintAuthenticatedItem(
      owner,
      brand,
      model,
      serialNumber,
      chipId,
      tokenURI
    );

    console.log(`⏳ Transaction submitted: ${tx.hash}`);
    const receipt = await tx.wait();
    console.log(`✅ Transaction confirmed in block ${receipt.blockNumber}`);

    // Extract token ID from events
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
    }

    res.json({
      success: true,
      message: "Item authenticated and minted successfully",
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber,
      tokenId,
      metadata: tokenMetadata
    });
  } catch (error) {
    console.error("❌ Minting error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Verify an item by chip ID
app.get("/api/items/verify/:chipId", async (req, res) => {
  try {
    if (!contract) {
      return res.status(503).json({ error: "Contract not initialized" });
    }

    const { chipId } = req.params;

    const [isValid, tokenId, owner] = await contract.verifyItemByChipId(chipId);

    if (!isValid || tokenId === 0n) {
      return res.status(404).json({
        authenticated: false,
        message: "Item not found or not authenticated"
      });
    }

    // Get item details
    const itemDetails = await contract.getItemDetails(tokenId);

    res.json({
      authenticated: true,
      tokenId: tokenId.toString(),
      owner,
      details: {
        brand: itemDetails.brand,
        model: itemDetails.model,
        serialNumber: itemDetails.serialNumber,
        chipId: itemDetails.chipId,
        verifier: itemDetails.verifier,
        verificationDate: new Date(Number(itemDetails.verificationDate) * 1000).toISOString()
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get item details by token ID
app.get("/api/items/:tokenId", async (req, res) => {
  try {
    if (!contract) {
      return res.status(503).json({ error: "Contract not initialized" });
    }

    const { tokenId } = req.params;

    const itemDetails = await contract.getItemDetails(tokenId);
    const owner = await contract.ownerOf(tokenId);
    const tokenURI = await contract.tokenURI(tokenId);

    res.json({
      tokenId,
      owner,
      tokenURI,
      details: {
        brand: itemDetails.brand,
        model: itemDetails.model,
        serialNumber: itemDetails.serialNumber,
        chipId: itemDetails.chipId,
        verifier: itemDetails.verifier,
        verificationDate: new Date(Number(itemDetails.verificationDate) * 1000).toISOString(),
        isAuthenticated: itemDetails.isAuthenticated
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authorize a verifier
app.post("/api/verifiers/authorize", async (req, res) => {
  try {
    if (!contract || !signer) {
      return res.status(503).json({ error: "Contract or signer not initialized" });
    }

    const { verifierAddress, status } = req.body;

    if (!verifierAddress) {
      return res.status(400).json({ error: "Missing verifierAddress" });
    }

    console.log(`🔐 Authorizing verifier: ${verifierAddress} (${status ? 'enabled' : 'disabled'})`);
    const tx = await contract.setVerifierAuthorization(verifierAddress, status !== false);
    const receipt = await tx.wait();

    res.json({
      success: true,
      message: `Verifier ${status !== false ? 'authorized' : 'revoked'}`,
      transactionHash: tx.hash,
      blockNumber: receipt.blockNumber
    });
  } catch (error) {
    console.error("❌ Authorization error:", error);
    res.status(500).json({ error: error.message });
  }
});

// Check if address is authorized verifier
app.get("/api/verifiers/:address", async (req, res) => {
  try {
    if (!contract) {
      return res.status(503).json({ error: "Contract not initialized" });
    }

    const { address } = req.params;
    const isAuthorized = await contract.authorizedVerifiers(address);

    res.json({
      address,
      isAuthorized
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal server error" });
});

// Start server
async function startServer() {
  await initializeBlockchain();
  
  app.listen(PORT, () => {
    console.log(`🚀 AuthentiFlux API server running on http://localhost:${PORT}`);
    console.log(`📚 API Documentation:`);
    console.log(`   GET  /                          - Health check`);
    console.log(`   GET  /api/contract/info         - Contract information`);
    console.log(`   POST /api/items/mint            - Mint new authenticated item`);
    console.log(`   GET  /api/items/verify/:chipId  - Verify item by chip ID`);
    console.log(`   GET  /api/items/:tokenId        - Get item details by token ID`);
    console.log(`   POST /api/verifiers/authorize   - Authorize a verifier`);
    console.log(`   GET  /api/verifiers/:address    - Check verifier status\n`);
  });
}

startServer();

