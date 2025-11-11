# 🚀 Quick Start Guide

Get AuthentiFlux up and running in 5 minutes!

## ⚡ Fastest Path to Testing

### 1. Install Dependencies (1 minute)

```bash
cd Authentiflux
npm install
```

### 2. Start Local Blockchain (30 seconds)

Open a new terminal and run:

```bash
npm run node
```

**Keep this terminal running!** You'll see a list of test accounts.

### 3. Deploy Contract (30 seconds)

In a new terminal:

```bash
npm run deploy:localhost
```

Copy the contract address from the output (e.g., `0x5FbDB2315678afecb367f032d93F642f64180aa3`)

### 4. Configure Environment (1 minute)

Create a `.env` file:

```bash
cat > .env << EOF
POLYGON_AMOY_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
PORT=3000
NODE_ENV=development
EOF
```


**Replace** `CONTRACT_ADDRESS` with your actual contract address from step 3.

### 5. Start Backend (30 seconds)

In a new terminal:

```bash
npm run backend
```

### 6. Test It! (1 minute)

In a new terminal:

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

### 7. Test the API

```bash
# Health check
curl http://localhost:3000/

# Verify the minted item (use the chip ID from the test output)
curl http://localhost:3000/api/items/verify/NFC-[timestamp]
```

## 🎉 Success!

You now have:
- ✅ Local blockchain running
- ✅ Smart contract deployed
- ✅ Backend API running
- ✅ First NFT minted
- ✅ Verification working

## 🧪 What to Try Next

### Mint Your Own Item

```bash
curl -X POST http://localhost:3000/api/items/mint \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "0xYourAddress",
    "brand": "Gucci",
    "model": "Dionysus",
    "serialNumber": "GD-2024-001",
    "chipId": "NFC-GUCCI-001"
  }'
```

### Verify Any Item

```bash
curl http://localhost:3000/api/items/verify/NFC-GUCCI-001
```

### Run Full Test Suite

```bash
npm test
```

## 🌐 Deploy to Testnet (Optional)

Want to deploy to Polygon Amoy testnet?

### 1. Get Test MATIC

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy" network
3. Request test tokens

### 2. Update .env

```env
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
PRIVATE_KEY=your_actual_private_key
CONTRACT_ADDRESS=
```

### 3. Deploy

```bash
npm run deploy:amoy
```

### 4. Update CONTRACT_ADDRESS in .env

Copy the deployed contract address and update your `.env` file.

### 5. Restart Backend

```bash
npm run backend
```

### 6. Test on Testnet

```bash
npx hardhat run scripts/mint-test.js --network amoy
```

## Learn More

- **Full Documentation**: `README.md`
- **API Examples**: `backend/api-examples.md`
- **Deployment Guide**: `DEPLOYMENT.md`
- **Project Details**: `PROJECT_SUMMARY.md`

## Common Issues

**Error: "Cannot find module"**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Error: "Contract not initialized"**
- Make sure CONTRACT_ADDRESS is set in .env
- Make sure you deployed the contract first

**Error: "Connection refused"**
- Make sure the Hardhat node is running (`npm run node`)
- Check that the RPC URL in .env matches (http://127.0.0.1:8545)

**Error: "Insufficient funds"**
- For local: You should have funds automatically
- For testnet: Get tokens from faucet

## 💡 Tips

1. **Keep three terminals open:**
   - Terminal 1: Hardhat node (`npm run node`)
   - Terminal 2: Backend server (`npm run backend`)
   - Terminal 3: Testing and commands

2. **Watch the Hardhat node terminal** - it shows all blockchain activity

3. **Use the scripts** - they're faster than manual API calls:
   - `scripts/mint-test.js` - Quick minting test
   - `scripts/verify-item.js` - Verify any item
   - `scripts/check-balance.js` - Check wallet balance

4. **Reset if stuck:**
   ```bash
   # Stop all (Ctrl+C in each terminal)
   # Restart Hardhat node
   npm run node
   # Redeploy
   npm run deploy:localhost
   # Update .env with new contract address
   # Restart backend
   npm run backend
   ```

## Next Steps

1. Explore the smart contract: `contracts/LuxuryGoodsNFT.sol`
2. Try all API endpoints: `backend/api-examples.md`
3. Modify and experiment with the code
4. Deploy to testnet for public access
5. Build a frontend application


