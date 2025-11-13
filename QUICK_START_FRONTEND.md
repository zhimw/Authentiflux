# ⚡ Frontend Quick Start

**Get the frontend running in 5 minutes!**

## 🚀 One-Time Setup

### 1. Install Frontend Dependencies
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux/frontend
npm install --legacy-peer-deps
```

### 2. Configure MetaMask

**Add Localhost Network:**
- Network Name: `Localhost 8545`
- RPC URL: `http://127.0.0.1:8545`
- Chain ID: `1337`
- Currency Symbol: `ETH`

**Import Test Account:**
- Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

---

## 🎯 Every Time You Start

### Terminal 1: Hardhat Node
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run node
```
✅ Keep running

### Terminal 2: Deploy Contract
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run deploy:localhost
```
📋 Copy contract address

### Terminal 3: Backend API
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux
npm run backend
```
✅ Keep running

### Terminal 4: Frontend
```bash
cd /Users/kayla/Desktop/6998_Web3/Authentiflux/frontend
npm start
```
✅ Opens at http://localhost:3001

---

## 🎨 Using the Frontend

1. **Connect Wallet** → Click "Connect Wallet" → Select MetaMask
2. **Mint Item** → Click "Mint" → Fill form → Submit
3. **Verify Item** → Click "Verify" → Enter chip ID
4. **View Items** → Click "My Items"
5. **Transfer** → Open item → Click "Transfer Item"

---

## 🔧 If Contract Address Changes

Update `frontend/.env`:
```env
REACT_APP_CONTRACT_ADDRESS=0xYourNewAddress
```

Then restart frontend (Terminal 4).

---

## 🐛 Quick Fixes

**Wrong Network?**
→ Switch MetaMask to "Localhost 8545"

**No Items?**
→ Check all 4 terminals are running

**Transaction Failed?**
→ Reset MetaMask: Settings → Advanced → Clear activity tab data

---

## 📁 Key Files

- `frontend/src/App.jsx` - Main app
- `frontend/src/pages/` - All pages
- `frontend/src/components/` - UI components
- `frontend/.env` - Configuration
- `frontend/src/config/contract.js` - Contract setup

---

## ✅ Success Checklist

- [ ] 4 terminals running
- [ ] MetaMask on Localhost network
- [ ] Frontend loads at http://localhost:3001
- [ ] Wallet connects
- [ ] Can mint items
- [ ] Can verify items
- [ ] Can transfer items

---

**That's it! You're ready to go!** 🎉

For detailed instructions, see `FRONTEND_SETUP.md`

