# MedLedger

MedLedger — a blockchain-based medical record verification system.

This repository contains a React + Vite frontend and a small Firebase/Express backend. The app lets hospitals upload medical records, persist metadata to Firestore, and verify records using a blockchain-backed integrity check.

Backend: `src/firebase-backend`
Frontend: `src/pages`, `src/components`

Quick dev:
- Start backend (configure `serviceAccountKey.json` or env vars, set RPC_URL and PRIVATE_KEY for blockchain):

```powershell
cd src\firebase-backend
npm install
npm run dev
```

- Start frontend:

```powershell
# from repo root
npm install
npm run dev
```

<<<<<<< HEAD
# MedLedger

**MedLedger** — A blockchain-based medical record verification system.

This repository contains a React + Vite frontend with Firebase backend integration. The app lets hospitals upload medical records, persist metadata to Firestore, and verify records using blockchain-backed integrity checks.

## 🚀 Quick Start

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn
- Firebase account
- MetaMask browser extension (optional, for blockchain features)

### Installation

```powershell
# 1. Install dependencies
npm install

# 2. Copy environment file and configure
cp .env.example .env
# Edit .env and add your Firebase credentials

# 3. Deploy Firestore security rules (after Firebase setup)
firebase login
firebase deploy --only firestore:rules

# 4. Start development server
npm run dev
```

Visit http://localhost:8080

### Quick Setup Script (Windows PowerShell)
```powershell
.\quick-start.ps1
```

## 📁 Project Structure

```
├── src/
│   ├── components/        # UI components (Layout, Navigation, etc.)
│   ├── config/           # Firebase and contract configuration
│   ├── hooks/            # Custom React hooks (useAuth)
│   ├── pages/            # Page components (Home, Upload, Verify, Dashboard)
│   ├── services/         # Blockchain service
│   └── firebase-backend/ # Legacy backend (optional)
├── firestore.rules       # Firestore security rules
├── .env.example         # Environment variables template
├── SETUP.md             # Detailed setup guide
├── FIXES_SUMMARY.md     # Summary of all fixes
└── package.json         # Dependencies
```

## 🔥 Firebase Setup

### 1. Create Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create a new project
3. Enable **Authentication** → **Email/Password** method
4. Enable **Firestore Database**

### 2. Get Firebase Config
1. Go to Project Settings → General
2. Scroll to "Your apps" section
3. Copy the firebaseConfig object

### 3. Configure Environment Variables
Create `.env` file in the root directory:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Deploy Security Rules
```powershell
firebase deploy --only firestore:rules
```

## 🎯 Features

### ✅ User Authentication
- Firebase Authentication with Email/Password
- Secure signup and login
- Session management
- User profile storage in Firestore

### ✅ Medical Record Upload
- Upload medical records with patient information
- File hash generation (SHA-256)
- Optional blockchain storage via MetaMask
- Automatic linking to logged-in hospital
- Status tracking (pending, verified, invalid)

### ✅ Dashboard
- View hospital's own uploaded records
- Filter and search records
- Verify/Reject pending records
- Statistics and analytics
- Export to CSV

### ✅ Record Verification
- Public verification by Record ID
- Blockchain hash verification
- Display complete record details
- On-chain verification status

### ✅ Security
- Firestore security rules
- User data isolation
- Protected write operations
- Public read for verification

## 🔗 Blockchain Integration

### Smart Contract
- **Address**: `0x26DE39Fb7204a7581F87d4195134Fe77B25E4192`
- **Network**: Polygon Amoy Testnet (or configure your own)
- **Functions**:
  - `storeHash(bytes32 h)` - Store file hash
  - `isHashStored(bytes32 h)` - Check if hash exists

### MetaMask Setup
1. Install MetaMask extension
2. Connect to your preferred network
3. Get test tokens (if using testnet)
4. Connect wallet when uploading records

## 📊 Database Structure

### Firestore Collections

#### `hospitals`
```javascript
{
  uid: string,              // Firebase Auth UID
  email: string,
  firstName: string,
  lastName: string,
  organization: string,
  hospitalName: string,
  role: string,
  createdAt: timestamp
}
```

#### `medicalRecords`
```javascript
{
  recordId: string,         // Document ID
  patientName: string,
  hospitalUid: string,      // Links to hospital
  fileHash: string,         // SHA-256 hash
  txHash: string,           // Blockchain transaction hash
  status: 'verified' | 'pending' | 'invalid',
  uploadedAt: timestamp,
  // ... other fields
}
```

## 🧪 Testing

### Test Flow
1. **Signup** at `/signup`
2. **Login** at `/login`
3. **Upload** medical record at `/upload`
4. **View Dashboard** at `/dashboard`
5. **Verify** record at `/verify`

### Sample Test Data
- Email: `test@hospital.com`
- Password: `Test1234!`
- Organization: `Test Hospital`

## 🛠️ Development

### Available Scripts

```powershell
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## 📚 Documentation

- **[SETUP.md](./SETUP.md)** - Complete setup guide with troubleshooting
- **[FIXES_SUMMARY.md](./FIXES_SUMMARY.md)** - Summary of all fixes and improvements
- **[firestore.rules](./firestore.rules)** - Firestore security rules

## 🔧 Troubleshooting

### Firebase Errors
- **"Firebase App not initialized"**: Check `.env` file configuration
- **"Permission denied"**: Deploy Firestore security rules

### Authentication Errors
- **"Email already in use"**: Use different email or reset password
- **"Weak password"**: Password must be at least 8 characters

### Build Errors
- Delete `node_modules` and run `npm install` again
- Check for TypeScript errors with `npm run lint`

## 🚀 Deployment

### Vercel
1. Push code to GitHub
2. Import repository in Vercel
3. Add environment variables
4. Deploy

### Firebase Hosting
```powershell
npm run build
firebase deploy --only hosting
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.

## 📞 Support

For detailed documentation and guides:
- See [SETUP.md](./SETUP.md) for installation
- See [FIXES_SUMMARY.md](./FIXES_SUMMARY.md) for technical details
- Check Firebase docs: https://firebase.google.com/docs
- Check Ethers.js docs: https://docs.ethers.org/

---

**MedLedger** - Blockchain-based Medical Record Verification System
=======
# MedLedger
Blockchain based medical verification system.
>>>>>>> e1d1926ed3546e4c5a2810728f6ccff1be4c6408
