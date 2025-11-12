# 🔍 Smart Contract Verification

## Current Configuration
- **Network**: Sepolia Testnet
- **Chain ID**: 11155111
- **Contract Address**: `0x26DE39Fb7204a7581F87d4195134Fe77B25E4192`

---

## ⚠️ IMPORTANT: Check if Contract is Deployed on Sepolia

### Step 1: Verify Contract Exists

**Go to Sepolia Etherscan**:
👉 https://sepolia.etherscan.io/address/0x26DE39Fb7204a7581F87d4195134Fe77B25E4192

**What to check**:
- ✅ If page shows "Contract" tab → Contract is deployed ✅
- ❌ If shows "This address is not a contract" → Need to deploy ❌

---

## If Contract is NOT Deployed on Sepolia

### Option 1: Deploy Your Contract to Sepolia (Recommended)

You need to deploy the smart contract to Sepolia. Here's the contract code:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract MedicalRecordStorage {
    mapping(bytes32 => bool) public stored;
    
    event HashStored(bytes32 indexed h, address indexed submitter);
    
    function storeHash(bytes32 h) external {
        stored[h] = true;
        emit HashStored(h, msg.sender);
    }
    
    function isHashStored(bytes32 h) external view returns (bool) {
        return stored[h];
    }
}
```

**Deploy using Remix**:
1. Go to: https://remix.ethereum.org/
2. Create new file: `MedicalRecordStorage.sol`
3. Paste the contract code above
4. Compile (Ctrl+S)
5. Deploy:
   - Click "Deploy & Run Transactions" tab
   - Environment: "Injected Provider - MetaMask"
   - Make sure MetaMask is on **Sepolia Testnet**
   - Click "Deploy"
   - Confirm in MetaMask
6. **Copy the deployed contract address**
7. Update `.env` file with new address

---

### Option 2: Use Existing Contract from Another Network

If your contract is already deployed on another network (like Polygon, Goerli, etc.), you can:

1. Switch back to that network in code
2. OR deploy a new contract on Sepolia

---

## If Contract IS Deployed on Sepolia ✅

Great! You're all set. Just follow these steps:

### 1. Make Sure MetaMask is on Sepolia
- Open MetaMask
- Click network dropdown
- Select "Sepolia Testnet"
- If not visible, click "Show/hide test networks" in MetaMask settings

### 2. Check Your Sepolia ETH Balance
- You should have some Sepolia ETH for gas fees
- If balance is 0, get free test ETH from faucets:
  - https://sepoliafaucet.com/
  - https://www.infura.io/faucet/sepolia
  - https://faucet.quicknode.com/ethereum/sepolia

### 3. Test Upload
1. Refresh your app: http://localhost:8080
2. Login
3. Go to Upload page
4. Fill patient details with **NEW Record ID** (e.g., MR3)
5. Upload a test file
6. Click "Upload to Blockchain"
7. **MetaMask will popup** → Confirm transaction
8. Wait for success!

---

## Quick Contract Check Command

Run this in browser console (F12) when on your app:

```javascript
// Check if contract exists
fetch('https://sepolia.etherscan.io/api?module=contract&action=getabi&address=0x26DE39Fb7204a7581F87d4195134Fe77B25E4192')
  .then(r => r.json())
  .then(data => console.log('Contract status:', data.status === '1' ? '✅ Deployed' : '❌ Not found'));
```

---

## After Deployment (if you deployed new contract)

Update the contract address in `.env`:

```env
VITE_CONTRACT_ADDRESS=<your_new_sepolia_contract_address>
```

Then restart your dev server:
```bash
npm run dev
```

---

## What to Tell Me

Please check and tell me:
1. ✅ Is the contract deployed on Sepolia? (Check Etherscan link above)
2. ✅ Do you have Sepolia ETH in MetaMask?
3. ✅ Is MetaMask switched to Sepolia network?

If contract is not deployed, I can help you deploy it! 🚀
