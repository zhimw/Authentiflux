# 🏗️ AuthentiFlux Complete Architecture

## System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                         USER INTERFACE                          │
│                    (React Frontend - Port 3001)                 │
│                                                                 │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐      │
│  │   Home   │  │  Verify  │  │ My Items │  │   Mint   │      │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘      │
│                                                                 │
│  Components: Navbar, ItemCard, LoadingSpinner, Alert          │
└─────────────────────────────────────────────────────────────────┘
                          │                    │
                          │                    │
                ┌─────────▼────────┐  ┌────────▼─────────┐
                │   RainbowKit     │  │   Backend API    │
                │   + wagmi        │  │   (Express)      │
                │   (Web3 Layer)   │  │   Port 3000      │
                └─────────┬────────┘  └────────┬─────────┘
                          │                    │
                          │                    │
                          ▼                    ▼
                ┌─────────────────────────────────────┐
                │      Smart Contract (Solidity)      │
                │      LuxuryGoodsNFT.sol             │
                │      ERC-721 + Custom Logic         │
                └─────────────────────────────────────┘
                                 │
                                 ▼
                ┌─────────────────────────────────────┐
                │         Blockchain Layer            │
                │    Hardhat Local Node (Port 8545)   │
                │    or Polygon Amoy Testnet          │
                └─────────────────────────────────────┘
```

---

## Component Interactions

### 1. Wallet Connection Flow

```
User clicks "Connect Wallet"
         │
         ▼
RainbowKit Modal Opens
         │
         ▼
User selects MetaMask
         │
         ▼
MetaMask prompts for approval
         │
         ▼
Connection established
         │
         ▼
wagmi provides address & chain info
         │
         ▼
Frontend updates UI (shows address, enables features)
```

### 2. Item Verification Flow

```
User enters Chip ID
         │
         ▼
Frontend calls Backend API
GET /api/items/verify/:chipId
         │
         ▼
Backend queries Smart Contract
verifyItemByChipId(chipId)
         │
         ▼
Smart Contract returns:
- isValid (bool)
- tokenId (uint256)
- owner (address)
         │
         ▼
Backend fetches additional details
getItemDetails(tokenId)
         │
         ▼
Backend returns formatted response
         │
         ▼
Frontend displays results
```

### 3. Minting Flow

```
Verifier fills mint form
         │
         ▼
Frontend calls Backend API
POST /api/items/mint
         │
         ▼
Backend validates input
         │
         ▼
Backend calls Smart Contract
mintAuthenticatedItem(...)
         │
         ▼
Transaction sent to blockchain
         │
         ▼
User approves in MetaMask
         │
         ▼
Transaction mined (~2 seconds)
         │
         ▼
Event emitted: ItemAuthenticated
         │
         ▼
Backend returns tokenId & txHash
         │
         ▼
Frontend shows success message
```

### 4. Transfer Flow

```
Owner clicks "Transfer Item"
         │
         ▼
Owner fills transfer form
(recipient address, optional price)
         │
         ▼
Frontend calls Backend API
POST /api/items/transfer
         │
         ▼
Backend calls Smart Contract
transferWithPrice(from, to, tokenId, price)
         │
         ▼
Transaction sent to blockchain
         │
         ▼
User approves in MetaMask
         │
         ▼
Transaction mined
         │
         ▼
Transfer recorded in history
         │
         ▼
Event emitted: ItemTransferredWithPrice
         │
         ▼
Frontend refreshes item details
```

---

## Data Flow Diagram

### Read Operations (Fast)

```
Frontend ──wagmi──> Smart Contract ──> Blockchain
   │                                        │
   └────────────── Data returned ──────────┘
```

### Write Operations (Requires Transaction)

```
Frontend ──API──> Backend ──ethers.js──> Smart Contract
                                              │
                                              ▼
                                         Blockchain
                                              │
                                              ▼
                                    Transaction Mined
                                              │
                                              ▼
                                      Event Emitted
                                              │
                                              ▼
                            Backend ──Response──> Frontend
```

---

## Technology Stack by Layer

### Frontend Layer
```
┌─────────────────────────────────────┐
│ React 19.2                          │
│ ├── wagmi 2.19 (Ethereum hooks)    │
│ ├── viem 2.39 (Ethereum library)   │
│ ├── RainbowKit 2.2 (Wallet UI)     │
│ ├── React Router 7.9 (Routing)     │
│ ├── TailwindCSS 4.1 (Styling)      │
│ ├── Axios 1.13 (HTTP client)       │
│ └── React Query 5.90 (Data cache)  │
└─────────────────────────────────────┘
```

### Backend Layer
```
┌─────────────────────────────────────┐
│ Node.js + Express 4.18              │
│ ├── ethers.js 6.9 (Blockchain)     │
│ ├── CORS (Cross-origin)            │
│ ├── Body-Parser (JSON parsing)     │
│ └── dotenv (Environment vars)      │
└─────────────────────────────────────┘
```

### Smart Contract Layer
```
┌─────────────────────────────────────┐
│ Solidity 0.8.20                     │
│ ├── OpenZeppelin ERC-721            │
│ ├── OpenZeppelin Ownable            │
│ └── Custom Transfer Logic           │
└─────────────────────────────────────┘
```

### Blockchain Layer
```
┌─────────────────────────────────────┐
│ Hardhat 2.19 (Development)          │
│ ├── Local Network (Chain ID: 1337) │
│ └── Polygon Amoy (Chain ID: 80002) │
└─────────────────────────────────────┘
```

---

## File Structure Overview

```
Authentiflux/
│
├── frontend/                    # React Frontend
│   ├── src/
│   │   ├── components/         # UI Components
│   │   ├── pages/              # Page Components
│   │   ├── hooks/              # Custom Hooks
│   │   ├── config/             # Configuration
│   │   ├── utils/              # Utilities
│   │   ├── App.jsx             # Main App
│   │   └── index.js            # Entry Point
│   ├── public/                 # Static Assets
│   └── package.json            # Dependencies
│
├── backend/                     # Express Backend
│   ├── server.js               # API Server
│   └── api-examples.md         # API Docs
│
├── contracts/                   # Smart Contracts
│   └── LuxuryGoodsNFT.sol     # Main Contract
│
├── scripts/                     # Deployment Scripts
│   ├── deploy.js               # Deploy Contract
│   ├── mint-test.js            # Test Minting
│   ├── verify-item.js          # Test Verification
│   └── transfer-test.js        # Test Transfer
│
├── test/                        # Contract Tests
│   ├── LuxuryGoodsNFT.test.js
│   └── LuxuryGoodsNFT.transfer.test.js
│
├── artifacts/                   # Compiled Contracts
├── deployments/                 # Deployment Records
├── hardhat.config.js           # Hardhat Config
├── package.json                # Root Dependencies
│
└── Documentation/
    ├── README.md               # Main Docs
    ├── FRONTEND_SETUP.md       # Frontend Setup
    ├── QUICK_START_FRONTEND.md # Quick Start
    ├── FRONTEND_SUMMARY.md     # Implementation Summary
    └── ARCHITECTURE.md         # This File
```

---

## Network Architecture

### Localhost Development

```
┌──────────────────────────────────────────────────────────┐
│                    Your Computer                         │
│                                                          │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐    │
│  │  Frontend   │  │  Backend    │  │  Hardhat    │    │
│  │  :3001      │  │  :3000      │  │  :8545      │    │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘    │
│         │                 │                 │           │
│         └─────────────────┴─────────────────┘           │
│                      localhost                          │
└──────────────────────────────────────────────────────────┘
                           │
                           ▼
                    ┌──────────────┐
                    │  MetaMask    │
                    │  (Browser)   │
                    └──────────────┘
```

### Testnet/Production

```
┌──────────────┐         ┌──────────────────┐
│   Frontend   │         │   Backend API    │
│   (Vercel)   │────────▶│   (Heroku/AWS)   │
└──────┬───────┘         └────────┬─────────┘
       │                          │
       │                          │
       └──────────┬───────────────┘
                  │
                  ▼
         ┌────────────────┐
         │   MetaMask     │
         └────────┬───────┘
                  │
                  ▼
         ┌────────────────┐
         │ Polygon Amoy   │
         │   Testnet      │
         └────────────────┘
```

---

## Security Architecture

### Frontend Security
```
┌─────────────────────────────────────┐
│ Client-Side Validation              │
│ ├── Form validation                 │
│ ├── Input sanitization              │
│ └── Owner/verifier checks           │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Wallet Security (MetaMask)          │
│ ├── Transaction approval required   │
│ ├── Private key never exposed       │
│ └── Network confirmation            │
└─────────────────────────────────────┘
```

### Backend Security
```
┌─────────────────────────────────────┐
│ API Layer                           │
│ ├── CORS configuration              │
│ ├── Input validation                │
│ ├── Error handling                  │
│ └── Environment variables           │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Private Key Management              │
│ ├── Stored in .env                  │
│ ├── Never committed to git          │
│ └── Server-side only                │
└─────────────────────────────────────┘
```

### Smart Contract Security
```
┌─────────────────────────────────────┐
│ Access Control                      │
│ ├── Owner-only functions            │
│ ├── Verifier authorization          │
│ └── Owner checks on transfers       │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Data Validation                     │
│ ├── Non-empty chip IDs              │
│ ├── Duplicate prevention            │
│ ├── Valid addresses                 │
│ └── Token existence checks          │
└─────────────────────────────────────┘
         │
         ▼
┌─────────────────────────────────────┐
│ Immutability                        │
│ ├── Permanent blockchain records    │
│ ├── Audit trail                     │
│ └── Event emissions                 │
└─────────────────────────────────────┘
```

---

## State Management

### Frontend State
```
┌─────────────────────────────────────┐
│ wagmi State (Blockchain)            │
│ ├── Connected address               │
│ ├── Chain ID                        │
│ ├── Contract data (cached)          │
│ └── Transaction status              │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ React Query State (API)             │
│ ├── API responses (cached)          │
│ ├── Loading states                  │
│ └── Error states                    │
└─────────────────────────────────────┘

┌─────────────────────────────────────┐
│ Component State (Local)             │
│ ├── Form inputs                     │
│ ├── UI toggles                      │
│ └── Temporary data                  │
└─────────────────────────────────────┘
```

### Smart Contract State
```
┌─────────────────────────────────────┐
│ Storage Variables                   │
│ ├── _tokenIds (counter)             │
│ ├── luxuryItems (mapping)           │
│ ├── transferHistory (mapping)       │
│ ├── chipIdToTokenId (mapping)       │
│ └── authorizedVerifiers (mapping)   │
└─────────────────────────────────────┘
```

---

## Event Flow

### Contract Events
```
ItemAuthenticated(tokenId, chipId, verifier, owner)
         │
         ▼
ItemTransferred(tokenId, from, to, timestamp)
         │
         ▼
ItemTransferredWithPrice(tokenId, from, to, timestamp, price)
         │
         ▼
VerifierAuthorized(verifier, status)
```

### Frontend Event Handling
```
User Action
    │
    ▼
Component Handler
    │
    ▼
API Call / Contract Call
    │
    ▼
Loading State
    │
    ▼
Transaction / Response
    │
    ▼
Success / Error State
    │
    ▼
UI Update
```

---

## Performance Optimization

### Frontend
- React Query caching
- wagmi automatic caching
- Lazy loading (potential)
- Code splitting (potential)
- Optimized re-renders

### Backend
- Connection pooling
- Response caching (potential)
- Efficient contract calls
- Error handling

### Blockchain
- Gas optimization in contract
- Batch operations (potential)
- Event indexing (The Graph - potential)

---

## Deployment Architecture

### Development
```
Local Machine
├── Hardhat Node (localhost:8545)
├── Backend API (localhost:3000)
└── Frontend Dev Server (localhost:3001)
```

### Production
```
Cloud Infrastructure
├── Smart Contract → Polygon Mainnet
├── Backend API → Heroku/AWS/DigitalOcean
└── Frontend → Vercel/Netlify/S3
```

---

## Summary

This architecture provides:
- ✅ **Separation of Concerns** - Frontend, Backend, Smart Contract
- ✅ **Scalability** - Each layer can scale independently
- ✅ **Security** - Multiple layers of validation
- ✅ **Flexibility** - Easy to modify or extend
- ✅ **Performance** - Caching and optimization at each layer
- ✅ **Maintainability** - Clear structure and documentation

**Result:** A professional, production-ready Web3 application! 🎉

