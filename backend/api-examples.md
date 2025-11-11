# API Examples

This document provides practical examples for interacting with the AuthentiFlux API.

## Base URL

```
http://localhost:3000
```

## Authentication

Currently, the API uses the private key configured in the `.env` file for transactions. In production, you would implement proper authentication/authorization.

---

## Endpoints

### 1. Health Check

**GET /**

```bash
curl http://localhost:3000/
```

**Response:**
```json
{
  "service": "AuthentiFlux API",
  "status": "running",
  "version": "1.0.0",
  "contractAddress": "0x..."
}
```

---

### 2. Get Contract Information

**GET /api/contract/info**

```bash
curl http://localhost:3000/api/contract/info
```

**Response:**
```json
{
  "name": "LuxuryGoodsPassport",
  "symbol": "LGP",
  "address": "0x...",
  "totalAuthenticatedItems": "5"
}
```

---

### 3. Mint New Authenticated Item

**POST /api/items/mint**

```bash
curl -X POST http://localhost:3000/api/items/mint \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "brand": "Louis Vuitton",
    "model": "Neverfull MM",
    "serialNumber": "FL4198",
    "chipId": "NFC-LV-123456789"
  }'
```

**Request Body:**
```json
{
  "owner": "0x...",           // Wallet address of the item owner
  "brand": "Louis Vuitton",   // Brand name
  "model": "Neverfull MM",    // Model/product name
  "serialNumber": "FL4198",   // Serial number
  "chipId": "NFC-LV-123456789", // Unique chip ID
  "metadata": {               // Optional metadata
    "image": "https://...",
    "uri": "ipfs://..."
  }
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item authenticated and minted successfully",
  "transactionHash": "0x...",
  "blockNumber": 12345,
  "tokenId": "1",
  "metadata": {
    "name": "Louis Vuitton Neverfull MM",
    "description": "Authenticated luxury item: Louis Vuitton Neverfull MM",
    "image": "",
    "attributes": [
      { "trait_type": "Brand", "value": "Louis Vuitton" },
      { "trait_type": "Model", "value": "Neverfull MM" },
      { "trait_type": "Serial Number", "value": "FL4198" },
      { "trait_type": "Chip ID", "value": "NFC-LV-123456789" },
      { "trait_type": "Verification Date", "value": "2025-11-08T..." }
    ]
  }
}
```

---

### 4. Verify Item by Chip ID

**GET /api/items/verify/:chipId**

```bash
curl http://localhost:3000/api/items/verify/NFC-LV-123456789
```

**Response (Authenticated):**
```json
{
  "authenticated": true,
  "tokenId": "1",
  "owner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "details": {
    "brand": "Louis Vuitton",
    "model": "Neverfull MM",
    "serialNumber": "FL4198",
    "chipId": "NFC-LV-123456789",
    "verifier": "0x...",
    "verificationDate": "2025-11-08T10:30:00.000Z"
  }
}
```

**Response (Not Found):**
```json
{
  "authenticated": false,
  "message": "Item not found or not authenticated"
}
```

---

### 5. Get Item Details by Token ID

**GET /api/items/:tokenId**

```bash
curl http://localhost:3000/api/items/1
```

**Response:**
```json
{
  "tokenId": "1",
  "owner": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "tokenURI": "data:application/json;base64,...",
  "details": {
    "brand": "Louis Vuitton",
    "model": "Neverfull MM",
    "serialNumber": "FL4198",
    "chipId": "NFC-LV-123456789",
    "verifier": "0x...",
    "verificationDate": "2025-11-08T10:30:00.000Z",
    "isAuthenticated": true
  }
}
```

---

### 6. Authorize Verifier

**POST /api/verifiers/authorize**

```bash
curl -X POST http://localhost:3000/api/verifiers/authorize \
  -H "Content-Type: application/json" \
  -d '{
    "verifierAddress": "0x1234567890123456789012345678901234567890",
    "status": true
  }'
```

**Request Body:**
```json
{
  "verifierAddress": "0x...",  // Address to authorize
  "status": true                // true to authorize, false to revoke
}
```

**Response:**
```json
{
  "success": true,
  "message": "Verifier authorized",
  "transactionHash": "0x...",
  "blockNumber": 12346
}
```

---

### 7. Check Verifier Authorization

**GET /api/verifiers/:address**

```bash
curl http://localhost:3000/api/verifiers/0x1234567890123456789012345678901234567890
```

**Response:**
```json
{
  "address": "0x1234567890123456789012345678901234567890",
  "isAuthorized": true
}
```

---

## Complete Workflow Example

### Scenario: Authentication Partner Verifies a Hermès Bag

#### Step 1: Authorize the Authentication Partner

```bash
curl -X POST http://localhost:3000/api/verifiers/authorize \
  -H "Content-Type: application/json" \
  -d '{
    "verifierAddress": "0xAuthPartnerAddress",
    "status": true
  }'
```

#### Step 2: Mint NFT for Verified Item

```bash
curl -X POST http://localhost:3000/api/items/mint \
  -H "Content-Type: application/json" \
  -d '{
    "owner": "0xCustomerAddress",
    "brand": "Hermès",
    "model": "Birkin 35",
    "serialNumber": "B35-2024-001",
    "chipId": "NFC-HERMES-20241108-001"
  }'
```

#### Step 3: Customer Receives Item and Verifies

```bash
# Scan NFC chip and verify
curl http://localhost:3000/api/items/verify/NFC-HERMES-20241108-001
```

#### Step 4: Later, Buyer Wants to Verify Before Purchase

```bash
# Scan chip during inspection
curl http://localhost:3000/api/items/verify/NFC-HERMES-20241108-001

# Check full details
curl http://localhost:3000/api/items/1
```

---

## Error Responses

### 400 Bad Request
```json
{
  "error": "Missing required fields: owner, brand, model, serialNumber, chipId"
}
```

### 404 Not Found
```json
{
  "authenticated": false,
  "message": "Item not found or not authenticated"
}
```

### 500 Internal Server Error
```json
{
  "error": "Transaction failed: insufficient funds"
}
```

### 503 Service Unavailable
```json
{
  "error": "Contract not initialized"
}
```

---

## Testing with Postman

1. Import these examples as a Postman collection
2. Set base URL as environment variable: `{{baseUrl}} = http://localhost:3000`
3. Test each endpoint sequentially

## Testing with JavaScript/Node.js

```javascript
const axios = require('axios');

const API_BASE_URL = 'http://localhost:3000';

async function mintItem() {
  try {
    const response = await axios.post(`${API_BASE_URL}/api/items/mint`, {
      owner: '0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb',
      brand: 'Chanel',
      model: 'Classic Flap',
      serialNumber: 'CH-CF-2024',
      chipId: 'NFC-CHANEL-' + Date.now()
    });
    
    console.log('✅ Minted:', response.data);
    return response.data.tokenId;
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

async function verifyItem(chipId) {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/api/items/verify/${chipId}`
    );
    
    console.log('🔍 Verification:', response.data);
  } catch (error) {
    console.error('❌ Error:', error.response?.data || error.message);
  }
}

// Run tests
(async () => {
  await mintItem();
  await verifyItem('NFC-CHANEL-1699459200000');
})();
```

---

## Rate Limiting & Best Practices

- Minting operations require blockchain transactions and take 2-5 seconds
- Read operations (verify, get details) are instant
- Ensure proper error handling in production
- Consider implementing caching for frequently queried items
- Use WebSocket connections for real-time transaction updates

---

## Production Considerations

For production deployment, consider:

1. **Authentication**: Implement JWT or OAuth for API access
2. **Rate Limiting**: Add rate limiting middleware
3. **IPFS**: Upload metadata to IPFS instead of base64 encoding
4. **Database**: Cache blockchain data in a database for faster queries
5. **Queue**: Implement job queue for minting operations
6. **Monitoring**: Add logging and monitoring (e.g., Sentry)
7. **HTTPS**: Use SSL certificates for secure connections

