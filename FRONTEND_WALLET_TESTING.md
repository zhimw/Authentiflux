## 🔑 Frontend Wallet & Role Testing Guide

This guide explains **how to connect as the verifier account** and as **normal user accounts** so you can test **minting, transferring, and verifying** items in the UI on **localhost**.

---

## 1. Prerequisites

- Dependencies installed:

```bash
cd /Users/ziweiwang/CursorProject/Authentiflux
npm install
cd frontend
npm install
```

- Three terminals available:
  - **Terminal 1** – Hardhat node (local blockchain)
  - **Terminal 2** – Backend API
  - **Terminal 3** – Frontend

---

## 2. Start the Local Environment

### 2.1 Start Hardhat node (Terminal 1)

```bash
cd /Users/ziweiwang/CursorProject/Authentiflux
npm run node
```

Keep this running. It will print **20 test accounts** with addresses and private keys.

### 2.2 Deploy the contract (Terminal 2, one‑time per reset)

In a new terminal:

```bash
cd /Users/ziweiwang/CursorProject/Authentiflux
npm run deploy:localhost
```

This:
- Deploys `LuxuryGoodsNFT` to the local chain.
- Saves deployment info in `deployments/localhost-deployment.json`.
- **Authorizes the deployer as a verifier**.

Note the values from `deployments/localhost-deployment.json`:

- `contractAddress` – your NFT contract address (e.g. `0x5FbD...aa3`).
- `deployer` – the verifier/owner address (e.g. `0xf39F...2266`).

### 2.3 Configure backend `.env` (if not already)

Create or update `.env` in the project root:

```env
POLYGON_AMOY_RPC_URL=http://127.0.0.1:8545
CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
PORT=3000
NODE_ENV=development
```

- **CONTRACT_ADDRESS**: use the value from `deployments/localhost-deployment.json`.
- **PRIVATE_KEY**: the private key of the **deployer** (first Hardhat account).  
  The sample above matches Hardhat’s default `Account #0` for localhost.

### 2.4 Start the backend API (Terminal 2)

```bash
cd /Users/ziweiwang/CursorProject/Authentiflux
npm run backend
```

Backend runs on `http://localhost:3000`.

### 2.5 Start the frontend (Terminal 3)

```bash
cd /Users/ziweiwang/CursorProject/Authentiflux/frontend
npm start
```

Frontend runs on `http://localhost:3001`.

---

## 3. Configure MetaMask for Localhost

### 3.1 Add the Hardhat network

In MetaMask:
- Go to **Settings → Networks → Add network manually**.
- Use:
  - **Network name**: `Hardhat Localhost`
  - **RPC URL**: `http://127.0.0.1:8545`
  - **Chain ID**: `1337`
  - **Currency symbol**: `ETH` (or `POL`)

### 3.2 Import the **verifier (deployer) account**

From the Hardhat node terminal (`npm run node`), find **Account #0**.  
The default (and used in `.env`) is:

- Address: `0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266`
- Private key:  
  `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`

In MetaMask:
- Click your account icon → **Import account**.
- Paste the private key.

This imported account is:
- The **contract deployer / owner**.
- Already an **authorized verifier** (because `deploy.js` authorizes it).

---

## 4. Roles in the UI

- **Verifier**
  - Address is marked `authorizedVerifiers[address] == true` in the contract.
  - Can **mint** new authenticated items.
  - In the UI:
    - Sees the **Mint** tab in the navbar.
    - Home page shows role as *Verifier*.

- **Normal user (collector)**
  - Any other wallet address.
  - Can **own** and **transfer** items.
  - In the UI:
    - Sees **My Items**.
    - If they own an item, can use the **Transfer Item** form on the item detail page.

---

## 5. Connecting as the Verifier (to Mint)

1. In MetaMask, **select the imported deployer account** (verifier).
2. Make sure MetaMask is on the **Hardhat Localhost** network.
3. Open the frontend: `http://localhost:3001/`.
4. Click the **Connect** button (top‑right from RainbowKit).
5. Choose the deployer account.

You should now see:
- On the Home page:  
  “You are logged in as: **Verifier (can mint new authenticated items)**”
- In the navbar: a **Mint** link.

### 5.1 Mint an item from the UI

1. Go to `/mint` (click **Mint** in the navbar).
2. Fill the form:
   - **Owner Address**: a user wallet address (not the contract address).  
     - For simple testing, you can use **another Hardhat account** (e.g. `Account #1`) or even the verifier address itself.
   - **Brand**
   - **Model**
   - **Serial Number**
   - **Chip ID** (e.g. `NFC-1234567890`; must be unique).
3. Click **Mint NFT**.

If successful, you’ll see:
- A success alert with **Token ID**.
- Transaction hash details.

---

## 6. Connecting as a Normal User (to Hold & Transfer)

### 6.1 Create/import a user account in MetaMask

You have two options:

- **Option A – Use another Hardhat test account**
  - From the Hardhat node terminal, pick e.g. **Account #1**.
  - In MetaMask → **Import account** → paste its private key.

- **Option B – Use a fresh MetaMask account**
  - In MetaMask, click account icon → **Create account**.
  - This address will not have test ETH on a real network, but on localhost it’s fine if you fund it from the deployer account, or just mint NFTs to it (no gas cost for it directly, since the backend signs TXs).

### 6.2 Connect as the normal user

1. In MetaMask, select the **user account**.
2. Ensure the network is **Hardhat Localhost**.
3. In the dApp (`http://localhost:3001`), click **Connect** and choose this user account.

The Home page will show:
- “You are logged in as: **Collector (can hold and transfer items)**”

If you previously minted an NFT with **Owner Address = this user’s address**, then:
- Go to **My Items** → you should see the item(s).

---

## 7. Testing Transfers in the UI

1. Connect as the **current owner** of an item (normal user account).
2. Go to **My Items** and click an item card to open its **detail page**.
3. On the item detail page:
   - You’ll see **Current Owner** marked with “(You)” if you are the owner.
   - A **Transfer Item** button appears.
4. Click **Transfer Item**:
   - **Recipient Address**: paste another user address (e.g. a second MetaMask account or another Hardhat account).
   - **Sale Price (ETH)**: optional; leave blank for a gift.
5. Click **Confirm Transfer**.

If successful:
- You’ll see a success message.
- After a short delay, the page refreshes and ownership changes.
- The **Transfer History** section shows the new transfer with timestamp and optional price.

To verify the new owner:
- Connect with the **recipient account** and open **My Items** – the item should now appear there.

---

## 8. Testing Verification in the UI

There are two ways to get the **Chip ID** to verify:

1. From the mint form – you chose a chip ID (e.g. `NFC-1234567890`).
2. From the UI:
   - Open an item detail page.
   - The **Chip ID** is shown and can be copied via the 📋 button.

### Steps to verify

1. Open `http://localhost:3001/verify`.
2. Paste the **Chip ID** into the input (e.g. `NFC-1234567890`).
3. Click **Verify**.

You should see:
- If the item exists and is authenticated: a detailed **Authenticated Item** card.
- If not: a warning saying the item is not found or not authenticated.

Verification works **for anyone**, no wallet connection is required.

---

## 9. Common Gotchas

- **Minting reverts with “unknown custom error”**
  - Usually happens when **Owner Address = contract address**.
  - Fix: set **Owner Address** to a **wallet address (EOA)**, e.g. a MetaMask account, not `CONTRACT_ADDRESS`.

- **Mint page not visible**
  - Only **authorized verifiers** see the Mint tab.
  - Ensure:
    - You’re connected as the **deployer/verifier** account.
    - Backend `.env` has the correct `PRIVATE_KEY` and `CONTRACT_ADDRESS`.

- **“Contract not initialized” in API**
  - Check:
    - Hardhat node is running (`npm run node`).
    - Contract deployed (`npm run deploy:localhost`).
    - `.env` has the correct `CONTRACT_ADDRESS`.
    - Backend restarted after `.env` changes.

With these steps, you can fully test **minting**, **transfers**, and **verification** using different accounts directly in the UI.


