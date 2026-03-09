# MedLedger

Blockchain-based medical record verification system for hospitals and healthcare providers.

## About

MedLedger is a decentralized application that enables hospitals to upload medical records and verify their authenticity using blockchain technology. The system combines Web3 wallet integration with Firebase backend to provide secure, tamper-proof medical record management.

## Features

**Authentication & Authorization**
- Hospital registration and login system
- Secure user authentication via Firebase
- Role-based access control

**Medical Record Management**
- Upload medical records with patient information
- Automatic SHA-256 file hash generation
- Blockchain storage via MetaMask wallet integration
- Record status tracking (verified/pending/invalid)

**Verification System**
- Public record verification by unique Record ID
- On-chain hash verification for authenticity
- Complete record details with verification history

**Hospital Dashboard**
- View all uploaded records
- Search and filter functionality
- Record statistics and analytics
- Verify or reject pending records

## Tech Stack

**Frontend**
- React 18 with TypeScript
- Vite for build tooling
- TailwindCSS for styling
- Shadcn/ui component library

**Backend & Database**
- Firebase Authentication
- Firestore NoSQL database
- Firebase security rules

**Blockchain**
- Ethers.js for Web3 integration
- MetaMask wallet support
- Smart contract on Polygon Amoy Testnet
- Contract Address: `0x26DE39Fb7204a7581F87d4195134Fe77B25E4192`

**Additional Libraries**
- React Router for navigation
- Lucide React for icons
- Recharts for data visualization

## Project Structure

```
src/
├── components/       # Reusable UI components
├── pages/           # Page components (Home, Upload, Verify, Dashboard)
├── config/          # Firebase and contract configuration
├── services/        # Blockchain service layer
├── hooks/           # Custom React hooks (useAuth)
└── contexts/        # React context providers
```

## Database Schema

**hospitals collection**
```typescript
{
  uid: string
  email: string
  firstName: string
  lastName: string
  organization: string
  hospitalName: string
  createdAt: timestamp
}
```

**medicalRecords collection**
```typescript
{
  recordId: string
  patientName: string
  hospitalUid: string
  fileHash: string
  txHash: string
  status: 'verified' | 'pending' | 'invalid'
  uploadedAt: timestamp
}
```

## Smart Contract Functions

- `storeHash(bytes32 hash)` - Store medical record hash on blockchain
- `isHashStored(bytes32 hash)` - Verify if hash exists on chain

## License

Proprietary - All Rights Reserved. See [LICENSE](LICENSE) for details.

---

**Developed by Mahak Rastogi**
