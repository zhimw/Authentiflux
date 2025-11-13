# Transfer with Price Recording Feature

## Overview

The AuthentiFlux system now includes a comprehensive transfer tracking feature that records complete ownership history, including:
- Transfer timestamps
- Previous and new owners
- Optional sale prices
- Complete provenance trail

This feature enables full transparency in luxury goods resale markets.

## Smart Contract Changes

### New Data Structure

```solidity
struct TransferRecord {
    address from;
    address to;
    uint256 timestamp;
    uint256 price; // Price in wei (0 if not a sale)
}
```

### New Functions

#### `transferWithPrice(address from, address to, uint256 tokenId, uint256 price)`
Transfer an item from one owner to another with price recording.

**Parameters:**
- `from`: Current owner address
- `to`: New owner address
- `tokenId`: Token ID to transfer
- `price`: Sale price in wei (use 0 for gifts)

**Usage Example:**
```solidity
// Transfer with price (2.5 ETH)
contract.transferWithPrice(
    owner1Address,
    owner2Address,
    1,
    ethers.parseEther("2.5")
);

// Transfer as gift
contract.transferWithPrice(
    owner1Address,
    owner2Address,
    1,
    0
);
```

#### `getTransferHistory(uint256 tokenId)`
Get complete transfer history for a token.

**Returns:** Array of `TransferRecord` structs

**Usage Example:**
```solidity
TransferRecord[] memory history = contract.getTransferHistory(1);
```

#### `getCurrentOwnerAcquisitionTime(uint256 tokenId)`
Get the timestamp when the current owner acquired the item.

**Returns:** Unix timestamp

**Usage Example:**
```solidity
uint256 timestamp = contract.getCurrentOwnerAcquisitionTime(1);
```

### Events

#### `ItemTransferredWithPrice`
Emitted when an item is transferred using `transferWithPrice`.

```solidity
event ItemTransferredWithPrice(
    uint256 indexed tokenId,
    address indexed from,
    address indexed to,
    uint256 timestamp,
    uint256 price
);
```

## API Endpoints

### 1. Transfer Item

**POST /api/items/transfer**

Transfer an item from one owner to another, recording the transaction details.

**Request:**
```json
{
  "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "to": "0x1234567890123456789012345678901234567890",
  "tokenId": "1",
  "price": "2.5"  // Optional: in ETH, omit for gifts
}
```

**Response:**
```json
{
  "success": true,
  "message": "Item transferred successfully",
  "transactionHash": "0x...",
  "blockNumber": 12347,
  "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
  "to": "0x1234567890123456789012345678901234567890",
  "newOwner": "0x1234567890123456789012345678901234567890",
  "tokenId": "1",
  "price": "2.5",
  "timestamp": "2025-11-08T15:30:00.000Z"
}
```

**cURL Example:**
```bash
curl -X POST http://localhost:3000/api/items/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
    "to": "0x1234567890123456789012345678901234567890",
    "tokenId": "1",
    "price": "2.5"
  }'
```

### 2. Get Transfer History

**GET /api/items/:tokenId/history**

Retrieve the complete transfer history for an item.

**Response:**
```json
{
  "tokenId": "1",
  "totalTransfers": 3,
  "history": [
    {
      "transferNumber": 1,
      "from": "Minted",
      "to": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "timestamp": "2025-11-08T10:00:00.000Z",
      "price": "0.0",
      "priceWei": "0"
    },
    {
      "transferNumber": 2,
      "from": "0x742d35Cc6634C0532925a3b844Bc9e7595f0bEb",
      "to": "0x1234567890123456789012345678901234567890",
      "timestamp": "2025-11-08T15:30:00.000Z",
      "price": "2.5",
      "priceWei": "2500000000000000000"
    },
    {
      "transferNumber": 3,
      "from": "0x1234567890123456789012345678901234567890",
      "to": "0xABCDEF1234567890ABCDEF1234567890ABCDEF12",
      "timestamp": "2025-11-08T18:45:00.000Z",
      "price": "3.0",
      "priceWei": "3000000000000000000"
    }
  ]
}
```

**cURL Example:**
```bash
curl http://localhost:3000/api/items/1/history
```

## Use Cases

### 1. Sale Transaction
Record a luxury item sale with the exact price:

```bash
curl -X POST http://localhost:3000/api/items/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "from": "0xSellerAddress",
    "to": "0xBuyerAddress",
    "tokenId": "1",
    "price": "15000"
  }'
```

### 2. Gift Transfer
Transfer without a sale price (recorded as 0):

```bash
curl -X POST http://localhost:3000/api/items/transfer \
  -H "Content-Type: application/json" \
  -d '{
    "from": "0xOwnerAddress",
    "to": "0xRecipientAddress",
    "tokenId": "1"
  }'
```

### 3. Price History Analysis
Track value appreciation/depreciation:

```bash
# Get full history
curl http://localhost:3000/api/items/1/history
```

The response shows:
- Initial mint date
- All ownership changes
- Price paid at each transfer
- Time each owner held the item

## Testing

### Run Transfer Tests

```bash
# Run all tests including transfer tests
npm test

# Run only transfer tests
npx hardhat test test/LuxuryGoodsNFT.transfer.test.js

# Run integration test script
npx hardhat run scripts/transfer-test.js --network localhost
```

### Test Script Example

The `scripts/transfer-test.js` demonstrates:
1. Minting an item
2. Multiple transfers with different prices
3. Gift transfer (no price)
4. Viewing complete history

```bash
npx hardhat run scripts/transfer-test.js --network localhost
```

Expected output:
```
🔄 Testing Item Transfer with Price Recording...
📦 Step 1: Minting new item...
✅ Item minted with Token ID: 1

💰 Step 2: Transferring from Owner1 to Owner2 (Sale for 2.5 ETH)...
✅ Transfer 1 complete
   Price: 2.5 ETH

💰 Step 3: Transferring from Owner2 to Owner3 (Sale for 3.0 ETH)...
✅ Transfer 2 complete
   Price: 3.0 ETH

🎁 Step 4: Transferring from Owner3 to Owner1 (Gift - No sale price)...
✅ Transfer 3 complete
   Price: Gift (0 ETH)

📊 Complete Transfer History
Total transfers: 4
Total Value Exchanged: 5.5 ETH
```

## Benefits

### For Buyers
- **Transparency**: See complete ownership history before purchase
- **Price History**: Make informed decisions based on past sales
- **Authenticity**: Verify unbroken chain of custody
- **Trust**: Immutable blockchain records

### For Sellers
- **Provenance**: Prove ownership history
- **Value Documentation**: Show appreciation over time
- **Quick Transfers**: Instant ownership updates
- **Reduced Friction**: No intermediary fees

### For Platforms
- **Market Data**: Analyze pricing trends
- **Compliance**: Meet regulatory requirements
- **Fraud Prevention**: Detect suspicious patterns
- **User Trust**: Build confidence in marketplace

## Security Considerations

### Authorization
- Only current owner or approved operators can transfer
- Validates `from` address matches actual owner
- Prevents unauthorized transfers

### Data Integrity
- All data stored on-chain (immutable)
- Timestamps provided by blockchain
- No centralized data manipulation possible

### Privacy
- Wallet addresses are public (blockchain standard)
- Prices are public (transparency feature)
- Consider privacy implications for high-value items

## Future Enhancements

### Potential Additions
1. **Multi-currency Support**: Record prices in different currencies
2. **Exchange Rate Integration**: Convert historical prices
3. **Private Transfers**: Optional private sale prices
4. **Escrow Integration**: Automated payment handling
5. **Marketplace Integration**: Direct buy/sell functionality
6. **Analytics Dashboard**: Visualize price trends
7. **Alerts**: Notify on suspicious price changes
8. **Batch Transfers**: Transfer multiple items at once

## Migration Notes

### Existing Deployments
If you have an existing deployment without this feature:

1. **Deploy new contract** with transfer functionality
2. **Migrate data** if necessary (contact users to re-mint)
3. **Update backend** to use new ABI
4. **Test thoroughly** before production use

### Backward Compatibility
- Standard ERC-721 transfers still work
- Old transfer methods don't record price (shows as 0)
- Initial mints automatically create first history entry

## FAQ

**Q: What if I don't want to disclose the sale price?**
A: Set price to 0 (treated as gift/non-sale transfer)

**Q: Can I edit transfer history?**
A: No, all data is immutable on blockchain

**Q: What happens to history if I use regular `transferFrom`?**
A: Regular transfers don't add to price history. Use `transferWithPrice` for tracking.

**Q: Is the price field required?**
A: No, it's optional. Omit it or set to 0 for gifts.

**Q: Can I see who the previous previous owner was?**
A: Yes, `getTransferHistory()` shows complete chain of ownership.

**Q: What currency is the price in?**
A: Prices are in wei (1 ETH = 10^18 wei). The API converts to ETH for convenience.

## Support

For questions about the transfer feature:
- See `backend/api-examples.md` for more API examples
- Review test files for usage patterns
- Check contract source for technical details

---

**Version**: 1.1.0  
**Last Updated**: November 2025  
**Feature Status**: ✅ Production Ready

