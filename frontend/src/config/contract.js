// Contract ABI - Load from public folder or use fetch
// For now, we'll fetch it dynamically or define it inline
// You'll need to update this after deploying the contract

// Contract address - update this after deploying to localhost
export const CONTRACT_ADDRESS = process.env.REACT_APP_CONTRACT_ADDRESS || '0x5FbDB2315678afecb367f032d93F642f64180aa3';

// Backend API URL
export const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3000';

// Contract ABI - We'll load this from the artifacts
// This is a simplified version - the full ABI will be loaded when needed
export const CONTRACT_ABI = [
  {
    "inputs": [],
    "stateMutability": "nonpayable",
    "type": "constructor"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "name": "balanceOf",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "ownerOf",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "getItemDetails",
    "outputs": [
      {
        "components": [
          {"internalType": "string", "name": "brand", "type": "string"},
          {"internalType": "string", "name": "model", "type": "string"},
          {"internalType": "string", "name": "serialNumber", "type": "string"},
          {"internalType": "string", "name": "chipId", "type": "string"},
          {"internalType": "address", "name": "verifier", "type": "address"},
          {"internalType": "uint256", "name": "verificationDate", "type": "uint256"},
          {"internalType": "bool", "name": "isAuthenticated", "type": "bool"}
        ],
        "internalType": "struct LuxuryGoodsNFT.LuxuryItem",
        "name": "",
        "type": "tuple"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "string", "name": "chipId", "type": "string"}
    ],
    "name": "verifyItemByChipId",
    "outputs": [
      {"internalType": "bool", "name": "isValid", "type": "bool"},
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "address", "name": "owner", "type": "address"}
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "getTotalAuthenticatedItems",
    "outputs": [{"internalType": "uint256", "name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "getTransferHistory",
    "outputs": [
      {
        "components": [
          {"internalType": "address", "name": "from", "type": "address"},
          {"internalType": "address", "name": "to", "type": "address"},
          {"internalType": "uint256", "name": "timestamp", "type": "uint256"},
          {"internalType": "uint256", "name": "price", "type": "uint256"}
        ],
        "internalType": "struct LuxuryGoodsNFT.TransferRecord[]",
        "name": "",
        "type": "tuple[]"
      }
    ],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "", "type": "address"}
    ],
    "name": "authorizedVerifiers",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "tokenURI",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "name",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [],
    "name": "symbol",
    "outputs": [{"internalType": "string", "name": "", "type": "string"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "from", "type": "address"},
      {"internalType": "address", "name": "to", "type": "address"},
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"},
      {"internalType": "uint256", "name": "price", "type": "uint256"}
    ],
    "name": "transferWithPrice",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "uint256", "name": "tokenId", "type": "uint256"}
    ],
    "name": "getApproved",
    "outputs": [{"internalType": "address", "name": "", "type": "address"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [
      {"internalType": "address", "name": "owner", "type": "address"},
      {"internalType": "address", "name": "operator", "type": "address"}
    ],
    "name": "isApprovedForAll",
    "outputs": [{"internalType": "bool", "name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  }
];

