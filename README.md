# AuthentiFlux 🔐

**Blockchain-Based Luxury Goods Authentication System**

AuthentiFlux is a decentralized platform that uses NFT technology to create digital passports for luxury goods, providing immutable proof of authenticity and ownership history on the blockchain.

## Overview

AuthentiFlux bridges the physical and digital worlds by:
- Creating NFT "passports" for verified luxury items
- Providing immutable proof of authenticity on the blockchain
- Tracking ownership history through transparent transfers
- Enabling trustless peer-to-peer luxury goods transactions
- Linking physical items to digital certificates via NFC/QR chips

## System Architecture

```
User/Verifier → Backend API (Node.js + Ethers.js)
                     ↓
            Smart Contract (Solidity on Polygon)
                     ↓
            Blockchain Ledger / NFT Provenance
```

### Components

1. **Smart Contract (Solidity)**
   - ERC-721 NFT standard for luxury goods
   - Minting and transfer logic
   - On-chain authentication proof and ownership history
   - Verifier authorization system

2. **Backend API (Node.js + Ethers.js)**
   - RESTful API for blockchain interactions
   - Minting interface for verified items
   - Item verification and query endpoints
   - Middleware between physical verification and blockchain

3. **Blockchain (Polygon Amoy Testnet)**
   - Fast, low-cost transactions
   - Ethereum-compatible smart contracts
   - Immutable record of provenance

## Tech Stack

- **Smart Contracts**: Solidity 0.8.20
- **Development Framework**: Hardhat
- **NFT Standard**: OpenZeppelin ERC-721
- **Backend**: Node.js with Express
- **Blockchain Library**: Ethers.js v6
- **Network**: Polygon Amoy Testnet
- **Testing**: Hardhat + Chai

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** package manager
- **MetaMask** wallet - [Install](https://metamask.io/)
- **Git** - [Download](https://git-scm.com/)

## Installation

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Authentiflux
```

### 2. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Hardhat and plugins
- OpenZeppelin contracts
- Ethers.js
- Express and backend dependencies

### 3. Environment Configuration

Create a `.env` file in the root directory:

```bash
# Copy the example file
cp .env.example .env
```

Edit the `.env` file with your configuration:

```env
# Your MetaMask wallet private key (NEVER share this!)
PRIVATE_KEY=your_private_key_here

# Polygon Amoy RPC URL (default is public RPC)
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology/

# Contract address (will be filled after deployment)
CONTRACT_ADDRESS=

# Backend server port
PORT=3000
NODE_ENV=development
```

⚠️ **Security Warning**: Never commit the `.env` file or share the private key!

### 4. Get Test MATIC

To deploy and interact with the contract on Polygon Amoy testnet, you need test MATIC:

1. Copy your wallet address from MetaMask
2. Visit [Polygon Faucet](https://faucet.polygon.technology/)
3. Select "Amoy" network
4. Request test MATIC tokens

## Usage Guide

### Step 1: Compile Smart Contracts

```bash
npm run compile
```

This compiles the Solidity contracts and generates artifacts.

### Step 2: Deploy to Polygon Amoy Testnet

```bash
npm run deploy:amoy
```

Expected output:
```
🚀 Deploying LuxuryGoodsNFT contract...
📝 Deploying with account: 0x...
💰 Account balance: 1.5 POL
⏳ Deploying contract...
✅ LuxuryGoodsNFT deployed to: 0x...
🌐 Network: amoy (Chain ID: 80002)
📄 Deployment info saved to: deployments/amoy-deployment.json
```

**Important**: Copy the contract address and add it to your `.env` file:
```env
CONTRACT_ADDRESS=0x...
```

### Step 3: Start the Backend API

```bash
npm run backend
```

The API server will start on `http://localhost:3000` with the following endpoints:

#### API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check and API info |
| GET | `/api/contract/info` | Get contract information |
| POST | `/api/items/mint` | Mint new authenticated item |
| GET | `/api/items/verify/:chipId` | Verify item by chip ID |
| GET | `/api/items/:tokenId` | Get item details by token ID |
| POST | `/api/verifiers/authorize` | Authorize a verifier |
| GET | `/api/verifiers/:address` | Check verifier authorization |

### Step 4: Test the System

#### A. Run Automated Tests

```bash
npm test
```

This runs the full test suite covering:
- Contract deployment
- Verifier authorization
- NFT minting
- Item verification
- Ownership transfers

#### B. Test Minting via Script

```bash
npx hardhat run scripts/mint-test.js --network amoy
```

This will:
1. Mint a test luxury item (Louis Vuitton bag)
2. Verify the item by chip ID
3. Display all item details

#### C. Test via API

**Mint an Item:**

```bash
curl -X POST http://localhost:3000/api/items/mint \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "0xYourWalletAddress",
    "brand": "Louis Vuitton",
    "model": "Speedy 30",
    "serialNumber": "SP3042",
    "chipId": "NFC-1234567890"
  }'
```

**Verify an Item:**

```bash
curl http://localhost:3000/api/items/verify/NFC-1234567890
```

**Get Item Details:**

```bash
curl http://localhost:3000/api/items/1
```

## Verifying Items

Use the verification script to check if an item is authenticated:

```bash
npx hardhat run scripts/verify-item.js --network amoy NFC-1234567890
```

Expected output:
```
✅ Item is authenticated!
========================
Token ID: 1
Current Owner: 0x...

📋 Item Details:
========================
Brand: Louis Vuitton
Model: Speedy 30
Serial Number: SP3042
Chip ID: NFC-1234567890
Verifier: 0x...
Verification Date: 2025-11-08T...
Status: ✅ Authenticated
```

## Authorization System

The system uses an authorization mechanism for verifiers:

### Authorize a Verifier

```bash
curl -X POST http://localhost:3000/api/verifiers/authorize \
  -H "Content-Type: application/json" \
  -d '{
    "verifierAddress": "0xVerifierAddress",
    "status": true
  }'
```

### Check Verifier Status

```bash
curl http://localhost:3000/api/verifiers/0xVerifierAddress
```

Only authorized verifiers or the contract owner can mint new NFTs.

## Local Development

For local testing without deploying to testnet:

### 1. Start Local Hardhat Node

```bash
npm run node
```

This starts a local blockchain at `http://127.0.0.1:8545`

### 2. Deploy to Local Network (in a new terminal)

```bash
npm run deploy:localhost
```

### 3. Configure Backend for Local Network

Update `.env`:
```env
POLYGON_AMOY_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=<local_contract_address>
```

### 4. Start Backend

```bash
npm run backend
```

## Project Structure

```
Authentiflux/
├── contracts/              # Solidity smart contracts
│   └── LuxuryGoodsNFT.sol
├── scripts/                # Deployment and utility scripts
│   ├── deploy.js
│   ├── mint-test.js
│   └── verify-item.js
├── backend/                # Node.js API server
│   └── server.js
├── test/                   # Contract tests
│   └── LuxuryGoodsNFT.test.js
├── deployments/            # Deployment records (generated)
├── artifacts/              # Compiled contracts (generated)
├── cache/                  # Hardhat cache (generated)
├── hardhat.config.js       # Hardhat configuration
├── package.json            # Dependencies and scripts
├── .env                    # Environment variables (create this)
├── .env.example            # Environment template
└── README.md               # This file
```

## Workflow Example

### Complete Authentication Flow

1. **Authentication Partner Verifies Item**
   - Physical inspection of luxury item
   - Confirms authenticity
   - Attaches NFC/QR chip to item

2. **Mint NFT Passport**
   ```bash
   curl -X POST http://localhost:3000/api/items/mint \
     -H "Content-Type: application/json" \
     -d '{
       "owner": "0xOwnerAddress",
       "brand": "Hermès",
       "model": "Birkin 35",
       "serialNumber": "B35-2024-001",
       "chipId": "NFC-HERMES-001"
     }'
   ```

3. **Customer Receives Item**
   - Item has physical chip attached
   - NFT is in customer's wallet
   - Digital and physical linked

4. **Verification by Anyone**
   ```bash
   curl http://localhost:3000/api/items/verify/NFC-HERMES-001
   ```
   - Scan chip with phone
   - Instant verification from blockchain
   - View full provenance history

5. **Resale Transaction**
   - Transfer NFT to buyer's wallet
   - Physical item and digital passport move together
   - Blockchain automatically updates ownership
   - Complete transparency and trust

## Network Information

### Polygon Amoy Testnet

- **Chain ID**: 80002
- **RPC URL**: https://rpc-amoy.polygon.technology/
- **Block Explorer**: https://amoy.polygonscan.com/
- **Faucet**: https://faucet.polygon.technology/

### Adding Amoy to MetaMask

1. Open MetaMask
2. Click network dropdown → "Add Network"
3. Enter the following:
   - Network Name: Polygon Amoy
   - RPC URL: https://rpc-amoy.polygon.technology/
   - Chain ID: 80002
   - Currency Symbol: POL
   - Block Explorer: https://amoy.polygonscan.com/

## Troubleshooting

### Common Issues

**1. "Insufficient funds" error**
- Solution: Get test MATIC from the faucet

**2. "Contract not initialized" in backend**
- Solution: Ensure CONTRACT_ADDRESS is set in .env
- Solution: Check that you've deployed the contract

**3. "Not authorized to mint" error**
- Solution: Authorize your address as a verifier
- Use the `/api/verifiers/authorize` endpoint

**4. "Network connection failed"**
- Solution: Check your RPC URL in .env
- Solution: Verify internet connection
- Solution: Try a different RPC endpoint

**5. Contract compilation errors**
- Solution: Run `npm install` again
- Solution: Clear cache: `npx hardhat clean`
- Solution: Delete `node_modules` and reinstall

## Additional Resources

- [Hardhat Documentation](https://hardhat.org/docs)
- [OpenZeppelin Contracts](https://docs.openzeppelin.com/contracts)
- [Ethers.js Documentation](https://docs.ethers.org/)
- [Polygon Documentation](https://docs.polygon.technology/)
- [ERC-721 Standard](https://eips.ethereum.org/EIPS/eip-721)

## Future Enhancements

- **IPFS Integration**: Decentralized metadata storage
- **Frontend Application**: User-friendly web interface
- **Mobile App**: NFC scanning capability
- **Multi-chain Support**: Deploy to multiple blockchains
- **Marketplace Integration**: Built-in resale platform
- **AI Authentication**: Computer vision for automated verification
- **Insurance Integration**: Blockchain-verified coverage
- **Fractional Ownership**: NFT fractionalization for high-value items


## Important Notes

### Security Considerations
- This is a testnet implementation for educational purposes
- Never use testnet private keys for mainnet
- Always use environment variables for sensitive data
- Consider implementing additional access controls for production
- Audit smart contracts before mainnet deployment

## Support

For questions or issues, please open an issue in the GitHub repository.

---

Built with ❤️ for secure luxury goods authentication on the blockchain.

