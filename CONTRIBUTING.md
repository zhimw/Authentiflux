# Contributing to AuthentiFlux

Thank you for your interest in contributing to AuthentiFlux! This document provides guidelines and instructions for contributing.

## Code of Conduct

Be respectful and inclusive. We're all here to build something great together.

## How to Contribute

### Reporting Bugs

If you find a bug, please create an issue with:
- Clear description of the problem
- Steps to reproduce
- Expected vs actual behavior
- Environment details (Node version, network, etc.)
- Screenshots if applicable

### Suggesting Features

For new features:
1. Check if it's already been suggested
2. Create an issue describing:
   - The problem it solves
   - Proposed solution
   - Alternative approaches considered
   - Impact on existing functionality

### Pull Requests

1. **Fork the repository**
   ```bash
   git clone https://github.com/yourusername/authentiflux.git
   cd authentiflux
   ```

2. **Create a branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make your changes**
   - Follow the code style (see below)
   - Add tests if applicable
   - Update documentation

4. **Test your changes**
   ```bash
   npm test
   npm run compile
   ```

5. **Commit with clear messages**
   ```bash
   git commit -m "feat: add new verification endpoint"
   ```

   Use conventional commits:
   - `feat:` - New feature
   - `fix:` - Bug fix
   - `docs:` - Documentation
   - `test:` - Tests
   - `refactor:` - Code refactoring
   - `chore:` - Maintenance

6. **Push and create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

## Code Style

### Solidity

- Use Solidity 0.8.20+
- Follow OpenZeppelin style guide
- Add NatSpec comments for all public functions
- Use descriptive variable names

Example:
```solidity
/**
 * @dev Mint a new NFT for an authenticated luxury item
 * @param owner Address of the item owner
 * @param brand Brand name of the luxury item
 * @return tokenId The ID of the newly minted token
 */
function mintAuthenticatedItem(
    address owner,
    string memory brand
) external returns (uint256) {
    // Implementation
}
```

### JavaScript/Node.js

- Use ES6+ features
- Async/await over callbacks
- Meaningful variable names
- Add JSDoc comments for functions

Example:
```javascript
/**
 * Mint a new authenticated item NFT
 * @param {Object} itemData - Item details
 * @param {string} itemData.owner - Owner address
 * @param {string} itemData.brand - Brand name
 * @returns {Promise<Object>} Transaction receipt
 */
async function mintItem(itemData) {
    // Implementation
}
```

## Testing

- Write tests for new features
- Ensure all tests pass before submitting PR
- Aim for >80% code coverage

```bash
# Run tests
npm test

# Run specific test
npx hardhat test test/LuxuryGoodsNFT.test.js
```

## Documentation

Update relevant documentation:
- README.md for user-facing changes
- DEPLOYMENT.md for deployment-related changes
- api-examples.md for new API endpoints
- Inline code comments for complex logic

## Development Setup

See README.md for complete setup instructions.

Quick start:
```bash
npm install
cp env.example .env
# Edit .env with your configuration
npm run compile
npm test
```

## Questions?

- Open an issue for questions
- Join our community discussions
- Check existing issues and PRs

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

---

Thank you for contributing to AuthentiFlux! 🚀

