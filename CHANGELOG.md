# Changelog

All notable changes to the AuthentiFlux project will be documented in this file.

## [1.1.0] - 2025-11-13

### Added - Transfer with Price Recording Feature

#### Smart Contract Enhancements
- **New `TransferRecord` struct** to store transfer history with:
  - `from` address (previous owner)
  - `to` address (new owner)
  - `timestamp` (when transfer occurred)
  - `price` (sale price in wei, 0 for gifts)

- **New Functions**:
  - `transferWithPrice(address from, address to, uint256 tokenId, uint256 price)` - Transfer with price recording
  - `getTransferHistory(uint256 tokenId)` - Get complete transfer history
  - `getCurrentOwnerAcquisitionTime(uint256 tokenId)` - Get when current owner acquired item

- **New Event**:
  - `ItemTransferredWithPrice` - Emitted on transfers with price info

- **Automatic History Recording**:
  - Initial mint automatically creates first history entry
  - Each transfer adds new record to history
  - Timestamps automatically recorded via `block.timestamp`

#### Backend API Enhancements
- **POST /api/items/transfer** - Transfer items with optional price recording
  - Supports sale transactions with price in ETH
  - Supports gift transfers (price = 0 or omitted)
  - Returns transfer details including timestamp
  
- **GET /api/items/:tokenId/history** - Get complete transfer history
  - Shows all previous owners
  - Displays timestamps for each transfer
  - Shows price paid (if any) for each transfer
  - Formats data in human-readable format

#### Testing & Scripts
- **New Test Suite**: `test/LuxuryGoodsNFT.transfer.test.js`
  - 15+ comprehensive tests for transfer functionality
  - Tests for valid/invalid transfers
  - Tests for price recording (sale and gift)
  - Tests for transfer history
  - Tests for approved transfers with price
  - All tests passing ✅

- **New Demo Script**: `scripts/transfer-test.js`
  - Complete end-to-end transfer demonstration
  - Mints test item
  - Performs multiple transfers with different prices
  - Shows gift transfer (no price)
  - Displays complete history

- **NPM Scripts Added**:
  - `npm run test:transfer` - Run transfer tests only
  - `npm run demo:transfer` - Run transfer demonstration

#### Documentation
- **TRANSFER_FEATURE.md** - Complete feature documentation
  - Technical details
  - API usage examples
  - Use cases
  - Security considerations
  - FAQ

- **Updated README.md**:
  - Added transfer endpoints to API table
  - Added transfer examples
  - Updated workflow examples with resale scenario

- **Updated backend/api-examples.md**:
  - Transfer endpoint examples
  - History endpoint examples
  - Complete lifecycle workflows
  - Gift transfer examples

### Technical Details

**Contract Changes** (`contracts/LuxuryGoodsNFT.sol`):
- Added `transferHistory` mapping: `mapping(uint256 => TransferRecord[])`
- Modified `mintAuthenticatedItem` to record initial history entry
- Added 3 new public/external functions
- Added 1 new event
- Maintains full ERC-721 compatibility
- Gas optimized for transfer operations

**Backend Changes** (`backend/server.js`):
- Added 2 new API endpoints
- Price conversion (ETH ↔ Wei)
- History formatting for readability
- Comprehensive error handling
- Transaction logging

**Zero Breaking Changes**:
- Fully backward compatible
- Existing functionality unchanged
- Standard ERC-721 transfers still work
- No migration required for new deployments

### Use Cases

1. **Luxury Goods Resale**: Track complete price history for authentication
2. **Market Analytics**: Analyze pricing trends and value appreciation
3. **Inheritance/Gifts**: Record non-sale transfers with timestamps
4. **Regulatory Compliance**: Maintain audit trail of ownership
5. **Fraud Detection**: Identify suspicious pricing patterns

### Benefits

- **Transparency**: Full ownership and price history on-chain
- **Trust**: Immutable blockchain records
- **Market Insights**: Real pricing data for buyers and sellers
- **Reduced Friction**: Direct peer-to-peer transfers
- **Compliance**: Meet regulatory requirements

---

## [1.0.0] - 2025-11-08

### Initial Release

#### Smart Contract
- ERC-721 NFT implementation for luxury goods
- Verifier authorization system
- Item authentication and minting
- Chip ID to token ID mapping
- Basic transfer tracking
- OpenZeppelin security standards

#### Backend API
- Express.js REST API
- Ethers.js v6 blockchain integration
- Mint authenticated items
- Verify items by chip ID
- Get item details
- Authorize verifiers
- Health check endpoints

#### Testing
- Comprehensive test suite (20+ tests)
- Deployment automation
- Testing scripts
- Balance checking utility

#### Documentation
- Complete README with installation guide
- API examples documentation
- Deployment guide for multiple environments
- Quick start guide
- Project summary
- Contributing guidelines

#### Network Support
- Polygon Amoy testnet
- Local Hardhat network
- Mainnet ready (requires audit)

---

## Version History

- **1.1.0** - Transfer with price recording feature
- **1.0.0** - Initial release with authentication and minting

---

**Note**: For detailed migration guides and upgrade instructions, see `TRANSFER_FEATURE.md`.

