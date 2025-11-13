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

## 🚀 Quick Start

Want to get started immediately? Check out our [Quick Start Guide](QUICKSTART.md) to get AuthentiFlux running locally in 5 minutes!

For detailed setup and deployment instructions, continue reading below.

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

| Method | Endpoint                    | Description                  |
| ------ | --------------------------- | ---------------------------- |
| GET    | `/`                         | Health check and API info    |
| GET    | `/api/contract/info`        | Get contract information     |
| POST   | `/api/items/mint`           | Mint new authenticated item  |
| GET    | `/api/items/verify/:chipId` | Verify item by chip ID       |
| GET    | `/api/items/:tokenId`       | Get item details by token ID |
| POST | `/api/items/transfer` | Transfer item with price recording |
| GET | `/api/items/:tokenId/history` | Get transfer history for item |
| POST   | `/api/verifiers/authorize`  | Authorize a verifier         |
| GET    | `/api/verifiers/:address`   | Check verifier authorization |

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

**Transfer Item (with price):**

```bash
curl -X POST http://localhost:3000/api/items/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "from": "0xCurrentOwnerAddress",
    "to": "0xNewOwnerAddress",
    "tokenId": "1",
    "price": "2.5"
  }'
```

**Get Transfer History:**

```bash
curl http://localhost:3000/api/items/1/history
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

**Keep this terminal running!** You'll see a list of test accounts. This starts a local blockchain at `http://127.0.0.1:8545`

### 2. Deploy to Local Network (in a new terminal)

```bash
npm run deploy:localhost
```

Copy the contract address from the output (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

### 3. Configure Backend for Local Network

Create or update `.env`:

```bash
cat > .env << EOF
POLYGON_AMOY_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
PORT=3000
NODE_ENV=development
EOF
```

**Replace** `CONTRACT_ADDRESS` with your actual contract address from step 2.

### 4. Start Backend (in a new terminal)

```bash
npm run backend
```

### 5. Test It!

```bash
# Test minting an item
npx hardhat run scripts/mint-test.js --network localhost
```

You should see:

```
✅ Transaction confirmed
🎫 Token ID: 1
✅ Test completed successfully!
```

### 6. Test the API

```bash
# Health check
curl http://localhost:3000/

# Verify the minted item (use the chip ID from the test output)
curl http://localhost:3000/api/items/verify/NFC-[timestamp]
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
   ```bash
   curl -X POST http://localhost:3000/api/items/transfer \
     -H "Content-Type: application/json" \
     -d '{
       "from": "0xSellerAddress",
       "to": "0xBuyerAddress",
       "tokenId": "1",
       "price": "15000"
     }'
   ```
   - Transfer NFT to buyer's wallet with price recorded
   - Physical item and digital passport move together
   - Blockchain automatically updates ownership with timestamp
   - Complete transparency and trust
   - Full price history maintained on-chain

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

- For local: You should have funds automatically
- For testnet: Get test MATIC from the faucet

**2. "Contract not initialized" in backend**

- Solution: Ensure CONTRACT_ADDRESS is set in .env
- Solution: Check that you've deployed the contract

**3. "Not authorized to mint" error**

- Solution: Authorize your address as a verifier
- Use the `/api/verifiers/authorize` endpoint

**4. "Network connection failed" / "Connection refused"**

- Solution: Check your RPC URL in .env
- Solution: Verify internet connection
- For local: Make sure the Hardhat node is running (`npm run node`)
- For local: Check that the RPC URL in .env matches (http://127.0.0.1:8545)
- Solution: Try a different RPC endpoint

**5. Contract compilation errors / "Cannot find module"**

- Solution: Run `npm install` again
- Solution: Clear cache: `npx hardhat clean`
- Solution: Delete `node_modules` and `package-lock.json`, then reinstall:

```bash
rm -rf node_modules package-lock.json
npm install
```

### Reset if Stuck

If you're stuck with local development:

```bash
# Stop all (Ctrl+C in each terminal)
# Restart Hardhat node
npm run node
# Redeploy (in new terminal)
npm run deploy:localhost
# Update .env with new contract address
# Restart backend
npm run backend
```

### 💡 Tips for Development

1. **Keep three terminals open:**

   - Terminal 1: Hardhat node (`npm run node`)
   - Terminal 2: Backend server (`npm run backend`)
   - Terminal 3: Testing and commands

2. **Watch the Hardhat node terminal** - it shows all blockchain activity

3. **Use the scripts** - they're faster than manual API calls:
   - `scripts/mint-test.js` - Quick minting test
   - `scripts/verify-item.js` - Verify any item
   - `scripts/check-balance.js` - Check wallet balance

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
