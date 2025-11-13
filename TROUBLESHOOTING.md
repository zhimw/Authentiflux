# 🔧 Troubleshooting Guide

## Common Issues and Solutions

### ✅ FIXED: TailwindCSS v4 PostCSS Error

**Error:**
```
Error: It looks like you're trying to use `tailwindcss` directly as a PostCSS plugin.
The PostCSS plugin has moved to a separate package...
```

**Solution Applied:**
1. Installed `@tailwindcss/postcss` package
2. Updated `postcss.config.js` to use `@tailwindcss/postcss`
3. Updated `index.css` to use `@import "tailwindcss";`
4. Updated `tailwind.config.js` to use ES6 export syntax
5. Removed unused `App.css` file

**Files Modified:**
- `frontend/postcss.config.js`
- `frontend/src/index.css`
- `frontend/tailwind.config.js`
- Deleted: `frontend/src/App.css`

---

## Frontend Issues

### Issue: "Wrong Network" in MetaMask

**Symptoms:**
- MetaMask shows wrong network
- Transactions fail
- Can't see items

**Solution:**
1. Open MetaMask
2. Click network dropdown
3. Select "Localhost 8545"
4. Refresh the page

---

### Issue: "Contract Not Initialized"

**Symptoms:**
- Error message in console
- API calls fail
- Items don't load

**Solution:**
1. Check Hardhat node is running (Terminal 1)
2. Verify contract is deployed (Terminal 2)
3. Check contract address in `frontend/.env` matches deployment
4. Restart frontend:
   ```bash
   # In Terminal 4
   # Press Ctrl+C
   npm start
   ```

---

### Issue: Items Not Loading

**Symptoms:**
- "My Items" page is empty
- No items show up
- Loading spinner forever

**Solution:**
1. Check backend is running (Terminal 3)
2. Open browser console (F12) for errors
3. Verify API URL in `frontend/.env`:
   ```env
   REACT_APP_API_URL=http://localhost:3000
   ```
4. Check backend terminal for errors
5. Test API manually:
   ```bash
   curl http://localhost:3000/api/contract/info
   ```

---

### Issue: Transaction Failures

**Symptoms:**
- MetaMask transaction fails
- "Insufficient funds" error
- "Transaction reverted" error

**Solution:**
1. **Check ETH balance:**
   - Open MetaMask
   - Should see 10000 ETH (test account)
   - If not, import correct test account

2. **Check you're on correct network:**
   - Network should be "Localhost 8545"
   - Chain ID: 1337

3. **For transfers - verify ownership:**
   - You must be the current owner
   - Check item details page

4. **For minting - verify authorization:**
   - You must be an authorized verifier
   - Deployer account is auto-authorized

5. **Reset MetaMask if stuck:**
   - Settings → Advanced
   - "Clear activity tab data"
   - Refresh page

---

### Issue: "Insufficient Funds"

**Symptoms:**
- Can't send transactions
- MetaMask shows no ETH
- Transaction fails immediately

**Solution:**
1. Import Hardhat test account:
   - MetaMask → Import Account
   - Private Key: `0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80`
   - Should see 10000 ETH

2. Or use another Hardhat account:
   - Check Hardhat node terminal (Terminal 1)
   - Copy any private key from the list
   - Import into MetaMask

---

### Issue: Stale Data After Transaction

**Symptoms:**
- Transfer completed but UI shows old owner
- Item still in "My Items" after transfer
- History not updating

**Solution:**
1. **Quick fix:** Refresh the page (F5)
2. **Or wait:** Some data auto-refreshes after a few seconds
3. **Check transaction:** Verify it actually completed in MetaMask

---

## Backend Issues

### Issue: Backend Won't Start

**Symptoms:**
- `npm run backend` fails
- Port already in use
- Connection errors

**Solution:**
1. **Port in use:**
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   # Then restart
   npm run backend
   ```

2. **Contract not found:**
   - Make sure contract is deployed
   - Check `CONTRACT_ADDRESS` in root `.env`
   - Verify artifacts folder exists

3. **Missing dependencies:**
   ```bash
   npm install
   npm run backend
   ```

---

### Issue: API Returns Errors

**Symptoms:**
- 500 errors
- "Contract not initialized"
- Transaction failures

**Solution:**
1. Check backend terminal for error messages
2. Verify `.env` configuration:
   ```env
   POLYGON_AMOY_RPC_URL=http://127.0.0.1:8545
   CONTRACT_ADDRESS=0x5FbDB2315678afecb367f032d93F642f64180aa3
   PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80
   ```
3. Ensure Hardhat node is running
4. Restart backend

---

## Blockchain Issues

### Issue: Hardhat Node Crashes

**Symptoms:**
- Terminal 1 shows error
- Connection refused
- Network errors

**Solution:**
1. Restart Hardhat node:
   ```bash
   # Terminal 1
   npm run node
   ```

2. Redeploy contract:
   ```bash
   # Terminal 2
   npm run deploy:localhost
   # Copy new contract address
   ```

3. Update contract address in `frontend/.env`

4. Restart backend and frontend

---

### Issue: Contract Address Changed

**Symptoms:**
- Everything was working, now it's not
- After restarting Hardhat node
- Contract not found errors

**Solution:**
Every time you restart the Hardhat node, you need to:

1. **Redeploy contract:**
   ```bash
   npm run deploy:localhost
   ```

2. **Copy new contract address** from output

3. **Update `frontend/.env`:**
   ```env
   REACT_APP_CONTRACT_ADDRESS=0xNewAddressHere
   ```

4. **Restart frontend:**
   ```bash
   # Terminal 4
   # Press Ctrl+C
   npm start
   ```

5. **Reset MetaMask:**
   - Settings → Advanced
   - Clear activity tab data

---

## Installation Issues

### Issue: npm install Fails

**Symptoms:**
- Dependency conflicts
- ERESOLVE errors
- Installation hangs

**Solution:**
1. **Use legacy peer deps:**
   ```bash
   cd frontend
   npm install --legacy-peer-deps
   ```

2. **Clear cache and reinstall:**
   ```bash
   cd frontend
   rm -rf node_modules package-lock.json
   npm install --legacy-peer-deps
   ```

3. **Check Node version:**
   ```bash
   node --version
   # Should be v16 or higher
   ```

---

### Issue: Permission Errors (macOS)

**Symptoms:**
- EPERM errors
- Operation not permitted
- Can't write files

**Solution:**
1. **Don't use sudo** - it causes more problems
2. **Fix npm permissions:**
   ```bash
   mkdir ~/.npm-global
   npm config set prefix '~/.npm-global'
   # Add to ~/.zshrc or ~/.bash_profile:
   # export PATH=~/.npm-global/bin:$PATH
   ```

---

## Complete Reset Procedure

If everything is broken and you want to start fresh:

### 1. Stop Everything
```bash
# Press Ctrl+C in all 4 terminals
```

### 2. Clean Frontend
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### 3. Restart Hardhat Node
```bash
# Terminal 1
npm run node
```

### 4. Redeploy Contract
```bash
# Terminal 2
npm run deploy:localhost
# COPY THE NEW CONTRACT ADDRESS!
```

### 5. Update Configuration
```bash
# Edit frontend/.env
# Update REACT_APP_CONTRACT_ADDRESS with new address
```

### 6. Restart Backend
```bash
# Terminal 3
npm run backend
```

### 7. Restart Frontend
```bash
# Terminal 4
cd frontend
npm start
```

### 8. Reset MetaMask
1. MetaMask → Settings → Advanced
2. "Clear activity tab data"
3. Refresh browser

---

## Debugging Tips

### Check Browser Console
1. Open browser (Chrome/Firefox)
2. Press F12
3. Go to "Console" tab
4. Look for red errors
5. Check "Network" tab for failed requests

### Check Terminal Outputs
- **Terminal 1 (Hardhat):** Shows all blockchain transactions
- **Terminal 2 (Deploy):** Shows deployment info
- **Terminal 3 (Backend):** Shows API requests and errors
- **Terminal 4 (Frontend):** Shows compilation errors

### Test API Manually
```bash
# Test backend is running
curl http://localhost:3000/

# Test contract info
curl http://localhost:3000/api/contract/info

# Test verification (use actual chip ID)
curl http://localhost:3000/api/items/verify/NFC-TEST-001
```

### Test Contract Directly
```bash
# Run test script
npx hardhat run scripts/mint-test.js --network localhost

# Check balance
npx hardhat run scripts/check-balance.js --network localhost
```

---

## Still Having Issues?

### Checklist
- [ ] All 4 terminals running?
- [ ] Hardhat node shows no errors?
- [ ] Contract deployed successfully?
- [ ] Contract address updated in frontend/.env?
- [ ] Backend shows "Contract loaded"?
- [ ] Frontend compiled without errors?
- [ ] MetaMask on Localhost network?
- [ ] MetaMask shows ETH balance?
- [ ] Browser console clear of errors?

### Get More Help
1. Check the documentation:
   - `FRONTEND_SETUP.md`
   - `QUICK_START_FRONTEND.md`
   - `COMPLETE_PROJECT_GUIDE.md`

2. Review error messages carefully
3. Check all configuration files
4. Try the complete reset procedure above

---

## Quick Reference

### Important Files
- `frontend/.env` - Frontend configuration
- `.env` - Backend configuration
- `frontend/src/config/contract.js` - Contract address
- `hardhat.config.js` - Network settings

### Important Commands
```bash
# Start Hardhat node
npm run node

# Deploy contract
npm run deploy:localhost

# Start backend
npm run backend

# Start frontend
cd frontend && npm start

# Run tests
npm test
```

### Important URLs
- Frontend: http://localhost:3001
- Backend API: http://localhost:3000
- Hardhat RPC: http://127.0.0.1:8545

### MetaMask Settings
- Network Name: Localhost 8545
- RPC URL: http://127.0.0.1:8545
- Chain ID: 1337
- Currency: ETH

---

**Remember:** Most issues can be solved by restarting everything and updating the contract address! 🔄

