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
MedLedger - A Blockchain Based Medical Verification System
=======
# MedLedger
Blockchain based medical verification system.
>>>>>>> e1d1926ed3546e4c5a2810728f6ccff1be4c6408
