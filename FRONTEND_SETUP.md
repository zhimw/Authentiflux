# 🎨 Frontend Setup Guide

Complete guide to running the AuthentiFlux frontend with your blockchain backend.

## 📋 Prerequisites Checklist

Before starting, ensure you have:

- [x] Node.js v16+ installed
- [x] MetaMask browser extension installed
- [x] Main project dependencies installed (`npm install` in root)
- [x] Frontend dependencies installed (`cd frontend && npm install --legacy-peer-deps`)

## 🚀 Quick Start (4 Terminals)

### Terminal 1: Start Hardhat Node

```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run node
```

**Expected Output:**
```
Started HTTP and WebSocket JSON-RPC server at http://127.0.0.1:8545/

Accounts
========
Account #0: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266 (10000 ETH)
Private Key: 0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
...
```

**Keep this terminal running!** ✅

---

### Terminal 2: Deploy Smart Contract

```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run deploy:localhost
```

**Expected Output:**
```
✅ LuxuryGoodsNFT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Copy the contract address!** 📋

---

### Terminal 3: Start Backend API

```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run backend
```

**Expected Output:**
```
🌐 Connected to network: localhost (Chain ID: 1337)
🔑 Using wallet: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
📄 Contract loaded at: 0x5FbDB2315678afecb367f032d93F642f64180aa3
🚀 AuthentiFlux API server running on http://localhost:3000
```

**Keep this terminal running!** ✅

---

### Terminal 4: Start Frontend

```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux/frontend
npm start
```

**Expected Output:**
```
Compiled successfully!

You can now view frontend in the browser.

  Local:            http://localhost:3001
  On Your Network:  http://192.168.x.x:3001
```

**Keep this terminal running!** ✅

---

## 🦊 MetaMask Configuration

### Step 1: Add Localhost Network

1. Open MetaMask
2. Click the network dropdown (top center)
3. Click "Add Network" → "Add a network manually"
4. Enter the following:

```
Network Name: Localhost 8545
RPC URL: http://127.0.0.1:8545
Chain ID: 1337
Currency Symbol: ETH
```

5. Click "Save"

### Step 2: Import Test Account

1. In MetaMask, click the account icon → "Import Account"
2. Paste this private key (from Hardhat Account #0):
```
0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```
3. Click "Import"
4. You should see **10000 ETH** balance ✅

### Step 3: Switch to Localhost Network

1. Click the network dropdown in MetaMask
2. Select "Localhost 8545"
3. Confirm you see your ETH balance

---

## 🎯 Testing the Frontend

### 1. Open the App

Navigate to: `http://localhost:3001`

You should see the AuthentiFlux home page with:
- Logo and navigation
- "Connect Wallet" button
- Feature descriptions

### 2. Connect Wallet

1. Click "Connect Wallet" in the top right
2. Select "MetaMask" from the modal
3. Approve the connection in MetaMask
4. Your address should appear in the navbar

### 3. Mint a Test Item (You're a Verifier!)

The deployer account is automatically authorized as a verifier.

1. Click "Mint" in the navbar
2. Fill in the form:
   ```
   Owner Address: 0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266
   Brand: Louis Vuitton
   Model: Neverfull MM
   Serial Number: LV-2024-001
   Chip ID: NFC-TEST-001
   ```
3. Click "Mint NFT"
4. Approve the transaction in MetaMask
5. Wait for confirmation (~2 seconds)
6. You should see "Successfully minted! Token ID: 1"

### 4. Verify the Item

1. Click "Verify" in the navbar
2. Enter chip ID: `NFC-TEST-001`
3. Click "Verify"
4. You should see:
   - ✓ Authenticated Item
   - Brand: Louis Vuitton
   - Model: Neverfull MM
   - Current owner and verification details

### 5. View Your Items

1. Click "My Items" in the navbar
2. You should see your minted item in a card
3. Click on the card to view details

### 6. Transfer the Item

1. On the item detail page, click "Transfer Item"
2. Enter recipient address (use another Hardhat account):
   ```
   0x70997970C51812dc3A010C7d01b50e0d17dc79C8
   ```
3. Optionally enter a price: `2.5`
4. Click "Confirm Transfer"
5. Approve in MetaMask
6. Wait for confirmation
7. The item should now show the new owner

### 7. View Transfer History

1. On the item detail page, scroll down
2. You should see the transfer history:
   - Transfer #1: Minted → Your Address
   - Transfer #2: Your Address → New Address (2.5 ETH)

---

## 🔧 Configuration

### Update Contract Address

If you redeploy the contract, update the address in:

**File:** `frontend/.env`
```env
REACT_APP_CONTRACT_ADDRESS=0xYourNewContractAddress
```

Then restart the frontend (Terminal 4):
```bash
# Press Ctrl+C to stop
npm start
```

### Update Backend URL

If your backend runs on a different port:

**File:** `frontend/.env`
```env
REACT_APP_API_URL=http://localhost:3000
```

---

## 📁 Frontend File Structure

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   ├── Navbar.jsx       # Navigation with wallet connect
│   │   ├── ItemCard.jsx     # NFT display card
│   │   ├── LoadingSpinner.jsx
│   │   └── Alert.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx         # Landing page
│   │   ├── Verify.jsx       # Verify items by chip ID
│   │   ├── MyItems.jsx      # User's NFT collection
│   │   ├── ItemDetail.jsx   # Individual item details
│   │   └── Mint.jsx         # Mint new items (verifiers)
│   ├── hooks/               # Custom React hooks
│   │   ├── useContract.js   # Smart contract interactions
│   │   └── useAPI.js        # Backend API calls
│   ├── config/              # Configuration files
│   │   ├── chains.js        # Network configurations
│   │   ├── contract.js      # Contract address & ABI
│   │   └── wagmi.js         # Wagmi/RainbowKit config
│   ├── utils/               # Utility functions
│   │   └── helpers.js       # Helper functions
│   ├── App.jsx              # Main app with routing
│   ├── index.js             # Entry point
│   └── index.css            # Global styles (Tailwind)
├── public/
├── .env                     # Environment variables
├── package.json
├── tailwind.config.js
└── README.md
```

---

## 🎨 Features Overview

### ✅ Implemented Features

1. **Wallet Connection** (RainbowKit)
   - Connect/disconnect wallet
   - Network switching
   - Account display

2. **Home Page**
   - Overview and statistics
   - Feature highlights
   - Call-to-action buttons

3. **Verification Page**
   - Search by chip ID
   - Display authentication status
   - Show item details
   - Link to full details

4. **My Items Page**
   - Grid of user's NFTs
   - Stats dashboard
   - Click to view details
   - Empty state handling

5. **Item Detail Page**
   - Complete item information
   - Ownership details
   - Transfer functionality
   - Full transfer history with prices

6. **Mint Page** (Verifiers Only)
   - Authorization check
   - Form validation
   - Transaction feedback
   - Success/error handling

7. **Transfer Functionality**
   - Transfer form with price
   - Transaction confirmation
   - Real-time updates
   - History tracking

---

## 🐛 Troubleshooting

### Issue: "Wrong Network" in MetaMask

**Solution:**
- Click the network dropdown in MetaMask
- Select "Localhost 8545"
- Refresh the page

### Issue: "Contract Not Initialized"

**Solution:**
1. Check that Hardhat node is running (Terminal 1)
2. Verify contract is deployed (Terminal 2)
3. Confirm contract address in `frontend/.env` matches deployment
4. Restart frontend (Terminal 4)

### Issue: Items Not Loading

**Solution:**
1. Check backend is running (Terminal 3)
2. Open browser console (F12) for errors
3. Verify API URL in `frontend/.env` is correct
4. Check backend logs for errors

### Issue: Transaction Failures

**Solution:**
1. Ensure you have ETH for gas (check MetaMask balance)
2. Confirm you're on Localhost network (Chain ID 1337)
3. Check you're the owner (for transfers)
4. Verify you're authorized (for minting)

### Issue: "Insufficient Funds"

**Solution:**
- Import a Hardhat account with ETH (see MetaMask setup)
- Each Hardhat account starts with 10000 ETH

### Issue: Stale Data After Transaction

**Solution:**
- Refresh the page (F5)
- Or wait a few seconds for auto-refresh

---

## 🔄 Resetting Everything

If things get messed up, here's how to reset:

### 1. Stop All Terminals
Press `Ctrl+C` in each terminal

### 2. Restart Hardhat Node
```bash
# Terminal 1
npm run node
```

### 3. Redeploy Contract
```bash
# Terminal 2
npm run deploy:localhost
# Copy the new contract address
```

### 4. Update Frontend Config
```bash
# Update frontend/.env with new contract address
nano frontend/.env
```

### 5. Restart Backend
```bash
# Terminal 3
npm run backend
```

### 6. Restart Frontend
```bash
# Terminal 4
cd frontend
npm start
```

### 7. Reset MetaMask
1. MetaMask → Settings → Advanced
2. "Clear activity tab data"
3. Refresh the page

---

## 📊 Testing Checklist

Use this checklist to verify everything works:

- [ ] Hardhat node running
- [ ] Contract deployed successfully
- [ ] Backend API running
- [ ] Frontend loads at http://localhost:3001
- [ ] MetaMask connected to Localhost network
- [ ] Wallet connects successfully
- [ ] Can mint a test item
- [ ] Item appears in "My Items"
- [ ] Can verify item by chip ID
- [ ] Can view item details
- [ ] Can transfer item
- [ ] Transfer history shows correctly
- [ ] Can view transfer history with prices

---

## 🎓 Next Steps

Now that your frontend is running:

1. **Experiment with the UI**
   - Mint multiple items
   - Transfer between accounts
   - Check verification

2. **Customize the Design**
   - Edit TailwindCSS classes
   - Modify colors in `tailwind.config.js`
   - Add your own components

3. **Add Features**
   - Image uploads
   - Search/filter functionality
   - Analytics dashboard
   - Mobile app

4. **Deploy to Production**
   - Build: `npm run build`
   - Deploy to Vercel/Netlify
   - Connect to testnet/mainnet

---

## 📚 Resources

- **Wagmi Docs**: https://wagmi.sh/
- **RainbowKit Docs**: https://www.rainbowkit.com/
- **Viem Docs**: https://viem.sh/
- **TailwindCSS Docs**: https://tailwindcss.com/
- **React Router Docs**: https://reactrouter.com/

---

## 🎉 Success!

If you've completed all the steps, you now have a fully functional Web3 frontend for luxury goods authentication! 

**Your frontend includes:**
- ✅ Beautiful, modern UI
- ✅ MetaMask integration
- ✅ Smart contract interactions
- ✅ Backend API integration
- ✅ Complete NFT management
- ✅ Transfer history tracking
- ✅ Responsive design

**Congratulations!** 🎊

---

**Need Help?** Check the troubleshooting section or review the console logs in your browser (F12).

