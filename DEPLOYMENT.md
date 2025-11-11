# Deployment Guide

Complete guide for deploying AuthentiFlux to different environments.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development](#local-development)
3. [Testnet Deployment (Polygon Amoy)](#testnet-deployment)
4. [Mainnet Deployment (Future)](#mainnet-deployment)
5. [Backend Deployment](#backend-deployment)
6. [Troubleshooting](#troubleshooting)

---

## Prerequisites

### Required Tools

- Node.js v16+ and npm
- MetaMask wallet
- Git

### Required Accounts

- MetaMask wallet with private key
- Polygon Amoy testnet MATIC (from faucet)

---

## Local Development

Perfect for testing without spending test tokens.

### 1. Start Local Blockchain

In terminal 1:

```bash
npm run node
```

This starts a local Hardhat node at `http://127.0.0.1:8545` with:
- 20 pre-funded test accounts
- Instant block mining
- Console logging of all transactions

**Keep this terminal running.**

### 2. Deploy Contracts Locally

In terminal 2:

```bash
npm run deploy:localhost
```

Expected output:
```
🚀 Deploying LuxuryGoodsNFT contract...
✅ LuxuryGoodsNFT deployed to: 0x5FbDB2315678afecb367f032d93F642f64180aa3
```

**Note the contract address!**

### 3. Configure Environment

Update `.env`:

```env
POLYGON_AMOY_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
```

**Note**: The private key above is Hardhat's default account #0 (safe for local testing only).

### 4. Start Backend

In terminal 3:

```bash
npm run backend
```

### 5. Test the System

In terminal 4:

```bash
# Run automated tests
npm test

# Test minting
npx hardhat run scripts/mint-test.js --network localhost

# Verify an item
CHIP_ID=NFC-123456 npx hardhat run scripts/verify-item.js --network localhost
```

---

## Testnet Deployment

Deploy to Polygon Amoy testnet for public testing.

### 1. Prepare Wallet

#### Get Your Private Key from MetaMask

1. Open MetaMask
2. Click the 3 dots → Account Details
3. Click "Show private key"
4. Enter your password
5. Copy the private key

⚠️ **NEVER share this key or commit it to Git!**

#### Add Amoy Network to MetaMask

1. Network Name: `Polygon Amoy`
2. RPC URL: `https://rpc-amoy.polygon.technology/`
3. Chain ID: `80002`
4. Currency Symbol: `POL`
5. Block Explorer: `https://amoy.polygonscan.com/`

#### Get Test MATIC

1. Visit [Polygon Faucet](https://faucet.polygon.technology/)
2. Select "Amoy" network
3. Enter your wallet address
4. Request test MATIC
5. Wait 1-2 minutes

Verify balance in MetaMask (should show ~0.5-1 POL).

### 2. Configure Environment

Create/update `.env`:

```env
# Your MetaMask private key (starts with 0x)
PRIVATE_KEY=0x1234567890abcdef...

# Polygon Amoy RPC (use default or get from Alchemy/Infura)
POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology/

# Will be filled after deployment
CONTRACT_ADDRESS=

# Backend settings
PORT=3000
NODE_ENV=production
```

### 3. Deploy to Amoy

```bash
npm run deploy:amoy
```

Expected output:
```
🚀 Deploying LuxuryGoodsNFT contract...
📝 Deploying with account: 0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb
💰 Account balance: 0.8 POL
⏳ Deploying contract...
✅ LuxuryGoodsNFT deployed to: 0xABCDEF1234567890...
🌐 Network: amoy (Chain ID: 80002)
📄 Deployment info saved to: deployments/amoy-deployment.json
```

### 4. Update Configuration

Copy the contract address and update `.env`:

```env
CONTRACT_ADDRESS=0xABCDEF1234567890...
```

### 5. Verify Deployment

#### Check on Block Explorer

Visit: `https://amoy.polygonscan.com/address/YOUR_CONTRACT_ADDRESS`

You should see:
- Contract creation transaction
- Contract code (after verification)
- Balance and transactions

#### Test via Script

```bash
npx hardhat run scripts/mint-test.js --network amoy
```

### 6. Verify Contract on PolygonScan (Optional)

```bash
npx hardhat verify --network amoy YOUR_CONTRACT_ADDRESS
```

This makes the contract source code public and verifiable.

---

## Backend Deployment

Deploy the API server to a cloud provider.

### Option A: Heroku

#### 1. Install Heroku CLI

```bash
# macOS
brew install heroku/brew/heroku

# Windows
# Download from https://devcenter.heroku.com/articles/heroku-cli
```

#### 2. Create Heroku App

```bash
heroku login
heroku create authentiflux-api
```

#### 3. Set Environment Variables

```bash
heroku config:set PRIVATE_KEY=your_private_key
heroku config:set CONTRACT_ADDRESS=your_contract_address
heroku config:set POLYGON_AMOY_RPC_URL=https://rpc-amoy.polygon.technology/
heroku config:set NODE_ENV=production
```

#### 4. Create Procfile

Create `Procfile` in root:

```
web: node backend/server.js
```

#### 5. Deploy

```bash
git add .
git commit -m "Deploy to Heroku"
git push heroku main
```

#### 6. Test

```bash
curl https://authentiflux-api.herokuapp.com/
```

---

### Option B: DigitalOcean App Platform

#### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git remote add origin https://github.com/yourusername/authentiflux.git
git push -u origin main
```

#### 2. Create App on DigitalOcean

1. Go to [DigitalOcean](https://cloud.digitalocean.com/)
2. Create App → Connect GitHub repo
3. Select `authentiflux` repository
4. Configure:
   - Type: Web Service
   - Run Command: `node backend/server.js`
   - Environment Variables: Add PRIVATE_KEY, CONTRACT_ADDRESS, etc.

#### 3. Deploy

Click "Create Resources" - automatic deployment begins.

---

### Option C: AWS EC2

#### 1. Launch EC2 Instance

1. Choose Ubuntu 22.04 LTS
2. Instance type: t2.micro (free tier)
3. Configure security group:
   - Port 22 (SSH)
   - Port 3000 (API)
   - Port 80 (HTTP - optional)

#### 2. Connect via SSH

```bash
ssh -i your-key.pem ubuntu@your-ec2-ip
```

#### 3. Install Dependencies

```bash
# Update system
sudo apt update && sudo apt upgrade -y

# Install Node.js
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt install -y nodejs

# Install PM2 (process manager)
sudo npm install -g pm2

# Install Git
sudo apt install git
```

#### 4. Clone and Setup Project

```bash
git clone https://github.com/yourusername/authentiflux.git
cd authentiflux
npm install
```

#### 5. Configure Environment

```bash
nano .env
# Add your configuration
# Save: Ctrl+X, Y, Enter
```

#### 6. Start with PM2

```bash
pm2 start backend/server.js --name authentiflux-api
pm2 save
pm2 startup
```

#### 7. Configure Nginx (Optional)

```bash
sudo apt install nginx

sudo nano /etc/nginx/sites-available/authentiflux
```

Add:

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

Enable and restart:

```bash
sudo ln -s /etc/nginx/sites-available/authentiflux /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

---

## Mainnet Deployment (Future)

⚠️ **Only deploy to mainnet after thorough testing and security audits!**

### Polygon Mainnet Configuration

```env
POLYGON_MAINNET_RPC_URL=https://polygon-rpc.com/
PRIVATE_KEY=your_production_private_key
CONTRACT_ADDRESS=
NODE_ENV=production
```

### Deployment Steps

1. **Get Real MATIC**
   - Buy POL on exchange
   - Transfer to deployment wallet
   - Ensure sufficient balance (0.5-1 POL)

2. **Security Audit**
   - Hire professional auditors
   - Run Slither/Mythril analysis
   - Fix all vulnerabilities

3. **Deploy**
   ```bash
   npm run deploy:mainnet
   ```

4. **Verify Contract**
   ```bash
   npx hardhat verify --network polygon YOUR_CONTRACT_ADDRESS
   ```

5. **Monitor**
   - Set up monitoring (Tenderly, OpenZeppelin Defender)
   - Watch for unusual transactions
   - Have emergency pause mechanism

---

## Troubleshooting

### Issue: "Insufficient funds for gas"

**Solution:**
```bash
# Check balance
npx hardhat run scripts/check-balance.js --network amoy

# Get more test MATIC from faucet
# https://faucet.polygon.technology/
```

### Issue: "Invalid API Key" or "Network Error"

**Solution:**
- Verify RPC URL in `.env`
- Try alternative RPC:
  ```env
  POLYGON_AMOY_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/YOUR_KEY
  ```

### Issue: "Contract not deployed"

**Solution:**
```bash
# Check deployment records
cat deployments/amoy-deployment.json

# Redeploy if needed
npm run deploy:amoy
```

### Issue: Backend can't connect to contract

**Solution:**
1. Ensure CONTRACT_ADDRESS is set in `.env`
2. Restart backend: `npm run backend`
3. Check artifacts folder exists: `npm run compile`

### Issue: Transaction stuck/pending

**Solution:**
- Check transaction on block explorer
- Wait 2-5 minutes for confirmation
- If stuck for >10 minutes, increase gas price

### Issue: "Nonce too low" error

**Solution:**
```bash
# Reset MetaMask account
# Settings → Advanced → Clear activity tab data
```

---

## Health Checks

### After Deployment, Verify:

1. **Contract is deployed**
   ```bash
   curl https://amoy.polygonscan.com/api?module=contract&action=getabi&address=YOUR_ADDRESS
   ```

2. **Backend is running**
   ```bash
   curl http://your-api-url/
   ```

3. **Can mint NFT**
   ```bash
   curl -X POST http://your-api-url/api/items/mint \
     -H "Content-Type: application/json" \
     -d '{"owner":"0x...","brand":"Test","model":"Test","serialNumber":"T1","chipId":"TEST-1"}'
   ```

4. **Can verify item**
   ```bash
   curl http://your-api-url/api/items/verify/TEST-1
   ```

---

## Monitoring & Maintenance

### Monitoring Tools

- **Tenderly**: Smart contract monitoring
- **OpenZeppelin Defender**: Security monitoring
- **Sentry**: Error tracking
- **DataDog**: Infrastructure monitoring

### Regular Maintenance

- Monitor gas prices
- Check for failed transactions
- Update dependencies monthly
- Review access logs
- Backup deployment data

---

## Support

For deployment issues:
1. Check logs: `pm2 logs` or Heroku logs
2. Verify environment variables
3. Check network status
4. Review troubleshooting section
5. Open GitHub issue

---

**Next Steps**: After successful deployment, see `backend/api-examples.md` for API usage.

