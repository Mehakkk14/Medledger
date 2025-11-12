# MedLedger Setup Guide

## Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- MetaMask browser extension (for blockchain interaction)

## Installation Steps

### 1. Install Dependencies

```powershell
# Install frontend dependencies
npm install

# Navigate to firebase-backend folder and install dependencies (if using backend server)
cd src/firebase-backend
npm install
cd ../..
```

### 2. Firebase Setup

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project or select existing project
3. Enable **Authentication** → **Email/Password** sign-in method
4. Enable **Firestore Database**
5. Get your Firebase configuration:
   - Go to Project Settings → General
   - Scroll to "Your apps" section
   - Copy the firebaseConfig object

### 3. Environment Variables

Create a `.env` file in the root directory:

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id

# Blockchain Configuration (Optional - for client-side blockchain interaction)
VITE_CONTRACT_ADDRESS=0x26DE39Fb7204a7581F87d4195134Fe77B25E4192
VITE_RPC_URL=https://polygon-amoy.g.alchemy.com/v2/your_key_here
```

### 4. Deploy Firestore Security Rules

```powershell
# Install Firebase CLI if not already installed
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase (if not already done)
firebase init firestore

# Deploy security rules
firebase deploy --only firestore:rules
```

### 5. Update Firebase Config

The Firebase configuration in `src/config/firebase.ts` will automatically use the environment variables. If you prefer hardcoding (not recommended for production), update the file directly.

### 6. Run the Application

```powershell
# Start the frontend development server
npm run dev

# The app will be available at http://localhost:8080
```

## Firestore Database Structure

The application uses the following Firestore collections:

### `hospitals` Collection
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,
  firstName: string,
  lastName: string,
  organization: string,
  hospitalName: string,
  role: 'admin' | 'user' | 'viewer',
  createdAt: timestamp
}
```

### `medicalRecords` Collection
```javascript
{
  recordId: string,         // Document ID
  patientName: string,
  patientContact: string,
  aadhaarNumber: string,
  hospitalName: string,
  hospitalUid: string,      // Links to hospital that created the record
  note: string,
  fileHash: string,         // SHA-256 hash of uploaded files
  txHash: string,           // Blockchain transaction hash
  status: 'verified' | 'pending' | 'invalid',
  uploadedAt: timestamp,
  uploadedBy: string,       // Email of uploader
  verifiedAt: timestamp,
  verifiedBy: string,
  files: [{
    name: string,
    type: string,
    size: number
  }]
}
```

## Blockchain Integration

### MetaMask Setup
1. Install MetaMask browser extension
2. Create or import a wallet
3. Connect to Polygon Amoy testnet (or your preferred network)
4. Get test tokens from faucet if using testnet

### Smart Contract
The contract at address `0x26DE39Fb7204a7581F87d4195134Fe77B25E4192` should have the following functions:
- `storeHash(bytes32 h)` - Store a file hash
- `isHashStored(bytes32 h) returns (bool)` - Check if hash exists
- `stored(bytes32) returns (bool)` - Mapping getter

## Testing the Application

### 1. Signup/Login Flow
1. Navigate to `/signup`
2. Create a new hospital account
3. Login with the credentials at `/login`
4. You'll be redirected to `/dashboard`

### 2. Upload Medical Records
1. Navigate to `/upload`
2. Fill in patient information
3. Upload medical files (PDF, PNG, JPG)
4. Connect MetaMask when prompted (optional)
5. Submit the record

### 3. View Dashboard
1. Navigate to `/dashboard`
2. View all your uploaded records
3. Use Verify/Reject buttons for pending records
4. Export data to CSV if needed

### 4. Verify Records
1. Navigate to `/verify`
2. Enter a Record ID
3. View verification status and blockchain details

## Troubleshooting

### Firebase Errors
- **"Firebase App not initialized"**: Check that `.env` file exists and variables are correct
- **"Permission denied"**: Deploy Firestore security rules using `firebase deploy --only firestore:rules`

### Authentication Errors
- **"Email already in use"**: Use a different email or reset the password
- **"Weak password"**: Password must be at least 8 characters

### Blockchain Errors
- **"MetaMask not found"**: Install MetaMask extension
- **"Transaction failed"**: Ensure you have enough gas and correct network

### Build Errors
- Run `npm install` to ensure all dependencies are installed
- Delete `node_modules` and run `npm install` again
- Check for TypeScript errors with `npm run lint`

## Production Deployment

### Vercel Deployment
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Firebase Hosting
```powershell
npm run build
firebase deploy --only hosting
```

## Security Notes

- Never commit `.env` file to version control
- Use Firebase security rules to restrict data access
- Validate all user input on both client and server
- Use HTTPS in production
- Regularly update dependencies for security patches

## Support

For issues or questions, please check:
- Firebase Documentation: https://firebase.google.com/docs
- Ethers.js Documentation: https://docs.ethers.org/
- React Documentation: https://react.dev/

---

**MedLedger** - Blockchain-based Medical Record Verification System
