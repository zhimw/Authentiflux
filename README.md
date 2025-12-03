# AuthentiFlux 🔐

**Blockchain-Based Luxury Goods Authentication System**

AuthentiFlux is a decentralized platform that uses NFT technology to create digital passports for luxury goods, providing immutable proof of authenticity and ownership history on the blockchain.

## 🎯 What It Does

- Creates NFT "passports" for verified luxury items
- Provides immutable proof of authenticity on the blockchain
- Tracks ownership history through transparent transfers
- Enables trustless peer-to-peer luxury goods transactions
- Links physical items to digital certificates via NFC/QR chips

## 🏗️ Tech Stack

- **Smart Contracts**: Solidity 0.8.20
- **Development Framework**: Hardhat
- **NFT Standard**: OpenZeppelin ERC-721
- **Backend**: Node.js with Express
- **Frontend**: React with RainbowKit & Wagmi
- **Blockchain Library**: Ethers.js v6
- **Styling**: Tailwind CSS

## 📁 Project Structure

```
Authentiflux/
├── contracts/              # Solidity smart contracts
│   └── LuxuryGoodsNFT.sol
├── scripts/                # Deployment and utility scripts
│   ├── deploy.js
│   ├── mint-test.js
│   ├── verify-item.js
│   ├── transfer-test.js
│   └── check-balance.js
├── backend/                # Node.js API server
│   ├── server.js
│   └── api-examples.md
├── frontend/               # React web application
│   ├── src/
│   │   ├── pages/         # Home, Mint, Verify, MyItems, ItemDetail
│   │   ├── components/    # Navbar, ItemCard, Alert, LoadingSpinner
│   │   ├── hooks/         # useContract, useAPI
│   │   ├── config/        # wagmi, chains, contract
│   │   └── utils/         # helpers
│   └── public/
├── test/                   # Contract tests
├── .env                    # Environment variables (create this)
└── README.md               # This file
```

## 🚀 Quick Start

### Prerequisites

- **Node.js** (v16 or higher) - [Download](https://nodejs.org/)
- **MetaMask** wallet - [Install](https://metamask.io/)

### Installation

```bash
# 1. Install root dependencies
npm install

# 2. Install frontend dependencies
cd frontend
npm install --legacy-peer-deps
cd ..
```

### Running the Project

You'll need **3 terminals** open:

#### Terminal 1: Start Local Blockchain

```bash
npm run node
```

Keep this running! You'll see 20 test accounts with 10,000 ETH each.

#### Terminal 2: Deploy Contract & Start Backend

```bash
# Deploy the contract
npm run deploy:localhost

# Copy the contract address from the output
# Create .env file
cat > .env << 'EOF'
POLYGON_AMOY_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=YOUR_CONTRACT_ADDRESS_HERE
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
PORT=3000
NODE_ENV=development
EOF

# Replace YOUR_CONTRACT_ADDRESS_HERE with the actual address from deploy output

# Start the backend
npm run backend
```

#### Terminal 3: Start Frontend

```bash
cd frontend
PORT=3001 npm start
```

### 🌐 Access Your Application

- **Frontend Website**: http://localhost:3001
- **Backend API**: http://localhost:3000
- **Blockchain**: http://127.0.0.1:8545

## 🎮 Using the Application

### 1. Setup MetaMask

**Add Local Network:**

- Network Name: `Localhost 8545`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `1337`
- Currency Symbol: `ETH`

**Import Test Account:**

- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
- ⚠️ **Only for testing! Never use on real networks!**

### 2. Connect Wallet

1. Open http://localhost:3001
2. Click "Connect Wallet"
3. Select MetaMask
4. Approve the connection

### 3. Mint an Item

1. Go to "Mint" page
2. Fill in item details:
   - Owner Address
   - Brand (e.g., "Louis Vuitton")
   - Model (e.g., "Neverfull MM")
   - Serial Number (e.g., "FL4198")
   - Chip ID (e.g., "NFC-12345")
3. Click "Mint Item"
4. Confirm transaction in MetaMask

### 4. Verify an Item

1. Go to "Verify" page
2. Enter the Chip ID (e.g., `NFC-1764800957719`)
3. Click "Verify"
4. View authentication details

### 5. View Your Items

1. Go to "My Items" page
2. See all NFTs you own
3. Click on any item for details

### 6. Transfer an Item

1. Go to item details page
2. Enter recipient address and price
3. Click "Transfer"
4. Confirm in MetaMask

## 🧪 Testing

### Run Automated Tests

```bash
npm test
```

### Test Minting via Script

```bash
npx hardhat run scripts/mint-test.js --network localhost
```

### Test via API

```bash
# Health check
curl http://localhost:3000/

# Mint an item
curl -X POST http://localhost:3000/api/items/mint \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "0xYourAddress",
    "brand": "Gucci",
    "model": "Dionysus",
    "serialNumber": "GD-001",
    "chipId": "NFC-GUCCI-001"
  }'

# Verify an item
curl http://localhost:3000/api/items/verify/NFC-GUCCI-001

# Get item details
curl http://localhost:3000/api/items/1
```

## 📡 API Endpoints

| Method | Endpoint                      | Description                 |
| ------ | ----------------------------- | --------------------------- |
| GET    | `/`                           | Health check                |
| GET    | `/api/contract/info`          | Contract information        |
| POST   | `/api/items/mint`             | Mint new authenticated item |
| GET    | `/api/items/verify/:chipId`   | Verify item by chip ID      |
| GET    | `/api/items/:tokenId`         | Get item details            |
| POST   | `/api/items/transfer`         | Transfer item with price    |
| GET    | `/api/items/:tokenId/history` | Get transfer history        |
| POST   | `/api/verifiers/authorize`    | Authorize a verifier        |
| GET    | `/api/verifiers/:address`     | Check verifier status       |

See `backend/api-examples.md` for detailed API usage examples.

## 🤖 AI Usage

Used **Cursor** to assist with the project.
