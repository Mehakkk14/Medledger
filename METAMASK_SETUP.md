# 🦊 MetaMask Setup Guide for MedLedger

## Why MetaMask is Needed?
MedLedger stores medical record hashes on the blockchain for immutable verification. To upload records to the blockchain, you need a crypto wallet like MetaMask.

---

## Step 1: Install MetaMask

1. **Go to**: https://metamask.io/download/
2. **Click**: "Install MetaMask for Chrome" (or your browser)
3. **Add Extension**: Click "Add to Chrome" → "Add Extension"
4. **Create Wallet**: 
   - Click "Get Started"
   - Click "Create a New Wallet"
   - Create a strong password
   - **IMPORTANT**: Save your Secret Recovery Phrase securely (never share it!)

---

## Step 2: Connect to the Correct Network

The smart contract is deployed on **Polygon Amoy Testnet** (or specify your network).

### Add Network to MetaMask:

1. Open MetaMask
2. Click the network dropdown (top of MetaMask, usually says "Ethereum Mainnet")
3. Click "Add Network" → "Add a network manually"
4. Fill in these details:

```
Network Name: Polygon Amoy Testnet
RPC URL: https://rpc-amoy.polygon.technology/
Chain ID: 80002
Currency Symbol: MATIC
Block Explorer: https://amoy.polygonscan.com/
```

5. Click "Save"
6. Switch to "Polygon Amoy Testnet" network

---

## Step 3: Get Test MATIC (for gas fees)

To upload records to blockchain, you need MATIC tokens for gas fees.

### Get Free Test MATIC:

1. **Copy your wallet address**:
   - Open MetaMask
   - Click on your account name to copy address
   
2. **Go to Polygon Faucet**:
   - Visit: https://faucet.polygon.technology/
   - Select "Polygon Amoy"
   - Paste your wallet address
   - Click "Submit"
   - Wait 1-2 minutes for tokens to arrive

---

## Step 4: Test the Connection

1. Open MedLedger application: http://localhost:8080
2. Login to your account
3. Go to **Upload** page
4. Fill in patient details and upload a test file
5. Click "Upload to Blockchain"
6. **MetaMask popup will appear** asking to:
   - Connect your wallet (first time)
   - Confirm the transaction (with gas fees)
7. Click "Confirm" in MetaMask
8. Wait for transaction to complete (10-30 seconds)
9. You'll see: "✅ Hash stored on blockchain successfully!"

---

## Troubleshooting

### ❌ "MetaMask not detected"
- **Solution**: Install MetaMask extension and refresh the page

### ❌ "Wrong network"
- **Solution**: Switch MetaMask to Polygon Amoy Testnet (Step 2)

### ❌ "Insufficient funds"
- **Solution**: Get test MATIC from faucet (Step 3)

### ❌ "Transaction failed"
- **Solution**: Check if:
  - You're on the correct network
  - You have enough MATIC for gas fees
  - Contract address is correct in `.env` file

### ❌ "User rejected transaction"
- **Solution**: This happens when you click "Reject" in MetaMask. Try uploading again and click "Confirm"

---

## Contract Information

- **Contract Address**: `0x26DE39Fb7204a7581F87d4195134Fe77B25E4192`
- **Network**: Polygon Amoy Testnet
- **Chain ID**: 80002

---

## Security Notes

⚠️ **NEVER share your Secret Recovery Phrase**
⚠️ **This is TESTNET** - Don't send real money
⚠️ **Always verify contract address** before transactions

---

## Need Help?

If you're still facing issues:
1. Check browser console (F12) for errors
2. Ensure MetaMask is unlocked
3. Clear cache and try again
4. Restart browser

---

**Happy Blockchain Recording! 🚀**
