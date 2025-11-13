# AuthentiFlux Frontend

Modern React frontend for the AuthentiFlux luxury goods authentication system.

## Features

- 🔐 **Wallet Connection** - Connect with MetaMask using RainbowKit
- ✅ **Item Verification** - Verify luxury items by chip ID
- 🎨 **My Items** - View and manage your authenticated NFTs
- 📊 **Transfer History** - Complete provenance tracking with prices
- 🔄 **Transfer Items** - Transfer ownership with price recording
- 🏭 **Mint NFTs** - Authorized verifiers can mint new items
- 📱 **Responsive Design** - Beautiful UI with TailwindCSS

## Tech Stack

- **React** - UI framework
- **wagmi** - React hooks for Ethereum
- **RainbowKit** - Wallet connection UI
- **viem** - Ethereum library
- **React Router** - Navigation
- **TailwindCSS** - Styling
- **Axios** - API calls

## Prerequisites

Before running the frontend, ensure you have:

1. **Node.js** v16+ installed
2. **MetaMask** browser extension
3. **Hardhat node** running (in main project)
4. **Backend API** running (in main project)
5. **Smart contract** deployed to localhost

## Installation

```bash
# Install dependencies
npm install --legacy-peer-deps
```

## Configuration

1. Copy the example environment file:
```bash
cp .env.example .env
```

2. Update `.env` with your contract address:
```env
REACT_APP_CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
REACT_APP_API_URL=http://localhost:3000
```

3. The contract address should match the one from your deployment.

## Running the Frontend

```bash
npm start
```

The app will open at `http://localhost:3001` (or 3000 if available).

## MetaMask Setup for Localhost

1. **Add Localhost Network to MetaMask:**
   - Network Name: `Localhost 8545`
   - RPC URL: `http://127.0.0.1:8545`
   - Chain ID: `1337`
   - Currency Symbol: `ETH`

2. **Import Test Account:**
   - Get a private key from the Hardhat node output
   - Import into MetaMask
   - You should see test ETH balance

## Complete Development Setup

You need 4 terminals running:

### Terminal 1: Hardhat Node
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run node
```

### Terminal 2: Backend API
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run backend
```

### Terminal 3: Frontend
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux/frontend
npm start
```

### Terminal 4: Testing/Commands
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
# Run scripts, tests, etc.
```

## Usage

### 1. Connect Wallet
- Click "Connect Wallet" in the navbar
- Select MetaMask
- Approve the connection
- Make sure you're on Localhost network

### 2. Verify Items
- Go to "Verify" page
- Enter a chip ID (e.g., from a minted item)
- View authentication details

### 3. View Your Items
- Go to "My Items" page
- See all NFTs you own
- Click on any item for details

### 4. Transfer Items
- Open an item detail page
- Click "Transfer Item"
- Enter recipient address and optional price
- Confirm the transaction in MetaMask

### 5. Mint Items (Verifiers Only)
- Go to "Mint" page (only visible if you're a verifier)
- Fill in item details
- Submit to create new NFT

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── components/
│   │   ├── Navbar.jsx
│   │   ├── ItemCard.jsx
│   │   ├── LoadingSpinner.jsx
│   │   └── Alert.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Verify.jsx
│   │   ├── MyItems.jsx
│   │   ├── ItemDetail.jsx
│   │   └── Mint.jsx
│   ├── hooks/
│   │   ├── useContract.js
│   │   └── useAPI.js
│   ├── config/
│   │   ├── chains.js
│   │   ├── contract.js
│   │   └── wagmi.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── index.js
│   └── index.css
├── package.json
├── tailwind.config.js
└── README.md
```

## Troubleshooting

### "Wrong Network" Error
- Make sure MetaMask is connected to Localhost (Chain ID 1337)
- Click the network dropdown in MetaMask and select "Localhost 8545"

### "Contract Not Initialized" Error
- Ensure the contract address in `.env` is correct
- Make sure the Hardhat node is running
- Verify the contract is deployed

### Items Not Loading
- Check that the backend API is running on port 3000
- Verify the API_URL in `.env` is correct
- Check browser console for errors

### Transaction Failures
- Ensure you have enough ETH for gas
- Check that you're the owner of the item (for transfers)
- Verify you're authorized (for minting)

## Building for Production

```bash
npm run build
```

This creates an optimized build in the `build/` directory.

## Available Scripts

- `npm start` - Start development server
- `npm run build` - Build for production
- `npm test` - Run tests
- `npm run eject` - Eject from Create React App (irreversible)

## Features by Page

### Home
- Overview of the system
- Statistics (total items, etc.)
- Feature highlights
- Call-to-action buttons

### Verify
- Search by chip ID
- Display authentication status
- Show item details
- Link to full details page

### My Items
- Grid of user's NFTs
- Quick stats
- Click to view details
- Empty state handling

### Item Detail
- Complete item information
- Ownership details
- Transfer functionality
- Full transfer history with prices

### Mint (Verifiers Only)
- Form to create new NFTs
- Authorization check
- Transaction feedback
- Success/error handling

## Contributing

This frontend is part of the AuthentiFlux project. See the main README for contribution guidelines.

## License

MIT
