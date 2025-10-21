import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
const multer = require('multer');
import crypto from 'crypto';
import path from 'path';
import fs from 'fs';
import { registerHospital, verifyRecordId, logAction, addAnalytics } from './index';
import { submitFileHashToChain } from './blockchain';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register-hospital', async (req, res) => {
  const { email, password, profile } = req.body;
  try {
    // Create the user and save profile with required fields for login
    const profileData = {
      ...profile,
      email: email,
      password: password, // In production, this should be hashed
      hospitalName: profile.organization || profile.hospitalName || profile.firstName + " " + profile.lastName
    };
    const user = await registerHospital(email, password, profileData);
    res.json({ uid: user.uid });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

// Accept multipart/form-data uploads, save to temp, compute file hash, submit to blockchain
const upload = multer({ dest: path.join(__dirname, '../../tmp_uploads') });

app.post('/upload-record', upload.array('files'), async (req, res) => {
  try {
  const { patientName, patientContact, aadhaarNumber, recordId, hospitalName, note, clientFileHash, clientTxHash } = req.body;
  const files = (req.files as any[]) || [];

    if (!recordId) return res.status(400).json({ error: 'recordId is required' });

    // compute combined hash (sha256) of concatenated file buffers for a single fileHash
    const hash = crypto.createHash('sha256');
    for (const f of files) {
      const buffer = fs.readFileSync(f.path);
      hash.update(buffer);
    }
    const fileHash = '0x' + hash.digest('hex');

    // create payload to log
    const payload: any = {
      recordId,
      patientName,
      patientContact,
      aadhaarNumber,
      hospitalName,
      note,
      files: files.map(f => ({ originalname: f.originalname, mimetype: f.mimetype, size: f.size })),
      fileHash,
      uploadedAt: new Date().toISOString(),
      status: 'pending'
    };

    // If client provided a txHash and clientFileHash that matches our computed fileHash, trust it
    let txHash = '';
    if (clientTxHash && clientFileHash && clientFileHash === fileHash) {
      txHash = clientTxHash;
      payload.txHash = txHash;
      payload.status = 'verified';
    } else {
      // submit fileHash to blockchain (returns txHash)
      try {
        txHash = await submitFileHashToChain(fileHash);
        payload.txHash = txHash;
        payload.status = 'verified';
      } catch (err: any) {
        console.error('Blockchain submit failed', err?.message || err);
        payload.status = 'pending';
      }
    }

    await logAction('upload-record', payload);

    // cleanup temp files
    for (const f of files) {
      try { fs.unlinkSync(f.path); } catch (e) { /* ignore */ }
    }

    res.json({ status: 'ok', txHash, fileHash });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.get('/verified-records', async (req, res) => {
  try {
    const hospitalName = req.query.hospitalName;
    if (!hospitalName) {
      return res.status(400).json({ error: "hospitalName is required" });
    }
    const snapshot = await admin.firestore()
      .collection('medicalRecords')
      .where('hospitalName', '==', hospitalName)
      .where('status', '==', 'verified')
      .get();
    const records = snapshot.docs.map(doc => doc.data());
    res.json({ records });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Get all records for a hospital (verified, pending, invalid)
app.get('/all-records', async (req, res) => {
  try {
    const hospitalName = req.query.hospitalName;
    if (!hospitalName) {
      return res.status(400).json({ error: "hospitalName is required" });
    }
    const snapshot = await admin.firestore()
      .collection('medicalRecords')
      .where('hospitalName', '==', hospitalName)
      .get();
    
    // Sort by uploadedAt in memory instead of using Firestore orderBy to avoid index requirement
    const records = snapshot.docs
      .map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
      .sort((a: any, b: any) => {
        const dateA = new Date(a.uploadedAt || 0).getTime();
        const dateB = new Date(b.uploadedAt || 0).getTime();
        return dateB - dateA; // Descending order (newest first)
      });
    
    res.json({ records });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

// Admin endpoint to verify a pending record
app.post('/admin-verify-record', async (req, res) => {
  try {
    const { recordId, action } = req.body; // action: 'verify' or 'reject'
    
    if (!recordId || !action) {
      return res.status(400).json({ error: "recordId and action are required" });
    }

    if (!['verify', 'reject'].includes(action)) {
      return res.status(400).json({ error: "action must be 'verify' or 'reject'" });
    }

    // Find the record
    const recordRef = admin.firestore().collection('medicalRecords').doc(recordId);
    const recordDoc = await recordRef.get();
    
    if (!recordDoc.exists) {
      return res.status(404).json({ error: "Record not found" });
    }

    const recordData = recordDoc.data();
    
    if (recordData?.status !== 'pending') {
      return res.status(400).json({ error: "Only pending records can be verified" });
    }

    // Update status
    const newStatus = action === 'verify' ? 'verified' : 'invalid';
    await recordRef.update({
      status: newStatus,
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'admin'
    });

    res.json({ 
      status: 'ok', 
      message: `Record ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
      newStatus 
    });
  } catch (error) {
    res.status(400).json({ error: (error as Error).message });
  }
});

app.get('/verify-record/:id', async (req, res) => {
  try {
    const record = await verifyRecordId(req.params.id);
    if (!record) {
      return res.status(404).json({ error: "Record not found" });
    }
    res.json({ record });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Find hospital by email
    const hospitalsRef = admin.firestore().collection('hospitals');
    const snapshot = await hospitalsRef.where('email', '==', email).get();

    if (snapshot.empty) {
      return res.status(401).json({ error: "Hospital not found" });
    }

    const hospitalDoc = snapshot.docs[0];
    const hospitalData = hospitalDoc.data();

    // Simple password check (for demo; use proper auth in production)
    if (hospitalData.password !== password) {
      return res.status(401).json({ error: "Invalid password" });
    }

    // Return hospital name
    res.json({ hospitalName: hospitalData.hospitalName });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/log-action', async (req, res) => {
  const { action, details } = req.body;
  try {
    await logAction(action, details);
    res.json({ status: 'logged' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.post('/add-analytics', async (req, res) => {
  try {
    await addAnalytics(req.body);
    res.json({ status: 'analytics added' });
  } catch (error: any) {
    res.status(400).json({ error: error.message });
  }
});

app.listen(3001, () => {
  console.log('Backend server running on port 3001');
});