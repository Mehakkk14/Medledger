import express from 'express';
import cors from 'cors';
import admin from 'firebase-admin';
import { registerHospital, verifyRecordId, logAction, addAnalytics } from './index';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/register-hospital', async (req, res) => {
  const { email, password, profile } = req.body;
  try {
    const user = await registerHospital(email, password, profile);
    res.json({ uid: user.uid });
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