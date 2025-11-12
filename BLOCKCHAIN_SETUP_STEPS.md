# 🔗 Blockchain Integration - Complete Setup Steps

## Current Status ✅
- ✅ Firebase authentication working
- ✅ Database storage working  
- ✅ File upload working
- ✅ Dashboard filtering working
- ⚠️ **Blockchain integration pending** - Needs MetaMask setup

---

## What You Need to Do (Step by Step)

### Step 1: Install MetaMask 🦊

1. **Open Chrome/Brave Browser**
2. **Go to**: https://metamask.io/download/
3. **Click** "Install MetaMask for Chrome"
4. **Follow the setup wizard**:
   - Click "Create a New Wallet"
   - Create a strong password
   - **SAVE YOUR SECRET RECOVERY PHRASE** (12 words) - Write it down securely!
5. **Done!** MetaMask icon will appear in your browser toolbar

---

### Step 2: Add Polygon Amoy Testnet Network

Your smart contract is deployed on **Polygon Amoy Testnet**.

**Option A: Automatic (Recommended)**
1. Just try uploading a record on MedLedger
2. MetaMask will automatically prompt you to add the network
3. Click "Approve" → "Switch Network"

**Option B: Manual**
1. Open MetaMask
2. Click network dropdown (top, says "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Fill in:
   ```
   Network Name: Polygon Amoy Testnet
   RPC URL: https://rpc-amoy.polygon.technology/
   Chain ID: 80002
   Currency Symbol: MATIC
   Block Explorer: https://amoy.polygonscan.com/
   ```
5. Click "Save"
6. **Switch to Polygon Amoy Testnet**

---

### Step 3: Get Test MATIC Tokens (Free!) 💰

You need MATIC tokens to pay gas fees for blockchain transactions.

1. **Copy your wallet address**:
   - Open MetaMask
   - Click on account name at top
   - Address will be copied

2. **Get free test MATIC**:
   - Visit: https://faucet.polygon.technology/
   - Select "Polygon Amoy" from dropdown
   - Paste your wallet address
   - Click "Submit"
   - Wait 1-2 minutes
   - Check MetaMask - you should see MATIC balance

**Alternative Faucets** (if first doesn't work):
- https://www.alchemy.com/faucets/polygon-amoy
- https://amoy-faucet.polygon.technology/

---

### Step 4: Test Blockchain Upload 🚀

1. **Open your app**: http://localhost:8080
2. **Login** with your account
3. **Go to Upload page**
4. **Fill in all patient details**:
   - Patient Name: Test Patient
   - Patient Contact: +91 9999999999
   - Aadhaar: 123456789012
   - Record ID: MR1 (or any unique ID)
   - Hospital Name: Your Hospital
   - Upload a test file (any image/PDF)

5. **Click "Upload to Blockchain"**
6. **MetaMask will popup**:
   - First time: Click "Connect" to connect your wallet
   - Then: Click "Confirm" to approve the transaction
   - Wait 10-30 seconds
   
7. **Success Messages**:
   - ✅ "Wallet connected: 0x1234...5678"
   - ✅ "Hash stored on blockchain successfully!"
   - You'll see the **Transaction Hash** on success page

---

### Step 5: Verify Your Record 🔍

1. **Go to Verify page**
2. **Enter the Record ID** (e.g., MR1)
3. **Click "Verify Record"**
4. **You should see**:
   - ✅ Record Verified
   - ✅ File Hash displayed
   - ✅ Transaction Hash displayed
   - ✅ On-chain verification: **Found** (green)

---

## Troubleshooting Common Issues

### ❌ Issue: "MetaMask not detected"
**Solution**: 
- Install MetaMask extension
- Refresh the page
- Check if MetaMask icon is in browser toolbar

---

### ❌ Issue: "Please switch to Polygon Amoy Testnet"
**Solution**:
- Open MetaMask
- Click network dropdown at top
- Select "Polygon Amoy Testnet"
- If not listed, follow Step 2 above

---

### ❌ Issue: "Insufficient funds for gas"
**Solution**:
- You need test MATIC tokens (free!)
- Follow Step 3 to get test MATIC
- Check MetaMask balance shows MATIC > 0

---

### ❌ Issue: "Transaction failed" or "User rejected transaction"
**Solution**:
- Click "Confirm" in MetaMask popup (don't click Reject)
- Make sure you have test MATIC balance
- Try uploading again

---

### ❌ Issue: "On-chain verification: Not found"
**Solution**:
- This means blockchain transaction didn't complete
- Check if you confirmed the MetaMask transaction
- Check if you have MATIC balance
- Try uploading a new record with blockchain enabled

---

## How to Know It's Working? ✅

**Blockchain is working if you see**:
1. ✅ MetaMask popup appears when clicking "Upload to Blockchain"
2. ✅ Toast notification: "Wallet connected: 0x..."
3. ✅ Toast notification: "Storing hash on blockchain... Please confirm in MetaMask"
4. ✅ Transaction Hash shown on success page (not empty)
5. ✅ On verify page, "On-chain verification: Found" shows in GREEN

**Blockchain is NOT working if**:
1. ❌ No MetaMask popup
2. ❌ Transaction Hash empty or missing
3. ❌ "On-chain verification: Not found" shows in RED
4. ❌ Error: "MetaMask not detected"

---

## What's Happening Behind the Scenes?

When you upload a record:

1. **File is hashed** using SHA-256 (creates unique fingerprint)
2. **MetaMask opens** asking you to sign transaction
3. **Hash is sent to blockchain** smart contract at: `0x26DE39Fb7204a7581F87d4195134Fe77B25E4192`
4. **Transaction is mined** on Polygon Amoy Testnet (10-30 seconds)
5. **Transaction hash returned** - This is proof the hash is on blockchain
6. **Record saved to Firestore** with transaction hash
7. **Verification page** can now check if hash exists on blockchain

---

## Network Details

- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002
- **Contract Address**: `0x26DE39Fb7204a7581F87d4195134Fe77B25E4192`
- **Currency**: MATIC (test tokens, no real value)
- **Block Explorer**: https://amoy.polygonscan.com/

---

## Important Notes 📝

⚠️ **This is a TESTNET** - No real money involved!
⚠️ Test MATIC has no real value - it's just for testing
⚠️ Never share your Secret Recovery Phrase with anyone
⚠️ Each blockchain transaction costs small gas fees (paid in MATIC)

---

## Need More Help?

If you're still stuck:
1. **Check browser console** (Press F12, go to Console tab)
2. **Check MetaMask** is unlocked and on correct network
3. **Check MATIC balance** is greater than 0
4. **Try a different browser** (Chrome/Brave recommended)
5. **Restart browser** after installing MetaMask

---

## What to Tell Me

When you test, please share:
1. ✅ Did MetaMask popup appear?
2. ✅ Did transaction confirm in MetaMask?
3. ✅ Can you see Transaction Hash on success page?
4. ✅ Does "On-chain verification" show "Found" when verifying?

**Once blockchain is working, your MedLedger app is 100% complete! 🎉**
