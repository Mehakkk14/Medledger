const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();

// Enable CORS for all origins
app.use(cors({
  origin: true,
  credentials: true
}));

// Parse JSON bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for handling file uploads
const upload = multer({ dest: '/tmp/uploads/' });

// Add request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body);
  next();
});

// In-memory storage for demo
const hospitals = [
  {
    id: 1,
    email: 'rastogimehak3845@gmail.com',
    password: 'mehak1234',
    hospitalName: 'Test Hospital'
  }
];

const records = [
  {
    id: 'MR0005',
    recordId: 'MR0005',
    patientName: 'Pari',
    hospitalName: 'Test Hospital',
    status: 'verified',
    uploadedAt: new Date().toISOString(),
    files: [{mimetype: 'application/pdf', size: 1024000}],
    fileHash: '0x1d7c41610db21c691e8288161c4bac1b3980db0a8acae9cd840a4f0b7e1383',
    txHash: '0x8f7e6d5c4b3a29f8e7d6c5b4a3928f7e6d5c4b3a29f8e7d6c5b4a3928f7e6d5c',
    verifiedAt: new Date().toISOString(),
    verifiedBy: 'admin'
  },
  {
    id: 'MR0006',
    recordId: 'MR0006',
    patientName: 'John Doe',
    hospitalName: 'Test Hospital',
    status: 'pending',
    uploadedAt: new Date().toISOString(),
    files: [{mimetype: 'application/pdf', size: 2048000}],
    fileHash: '0x2e8d52721ec32d792f9399272e5cac2c4091ec43f9bdf9fd951b5e2394c492',
    txHash: '',
    note: 'Blood test report'
  }
];

// Login endpoint
app.post('/api/login', (req, res) => {
  console.log('Login request received:', req.body);
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const hospital = hospitals.find(h => h.email === email && h.password === password);
  console.log('Hospital found:', hospital);
  
  if (hospital) {
    console.log('Login successful for:', email);
    res.json({ hospitalName: hospital.hospitalName });
  } else {
    console.log('Login failed for:', email);
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Registration endpoint
app.post('/api/register-hospital', (req, res) => {
  const { email, password, profile } = req.body;
  console.log('Registration attempt:', email, profile);
  
  hospitals.push({
    id: hospitals.length + 1,
    email,
    password,
    hospitalName: profile.organization
  });
  
  res.json({ uid: 'test-uid-' + hospitals.length });
});

// Get all records
app.get('/api/all-records', (req, res) => {
  const hospitalName = req.query.hospitalName;
  console.log('Fetching records for:', hospitalName);
  
  const hospitalRecords = records.filter(r => r.hospitalName === hospitalName);
  res.json({ records: hospitalRecords });
});

// Verify record
app.get('/api/verify-record/:id', (req, res) => {
  const recordId = req.params.id;
  console.log('Verifying record:', recordId);
  
  const record = records.find(r => r.recordId === recordId);
  if (record) {
    res.json({ record });
  } else {
    res.status(404).json({ error: 'Record not found' });
  }
});

// Admin verify record
app.post('/api/admin-verify-record', (req, res) => {
  const { recordId, action } = req.body;
  console.log('Admin action:', action, 'for record:', recordId);
  
  const record = records.find(r => r.recordId === recordId);
  if (record) {
    record.status = action === 'verify' ? 'verified' : 'invalid';
    record.verifiedAt = new Date().toISOString();
    record.verifiedBy = 'admin';
    
    // Add blockchain hashes if verifying and not already present
    if (action === 'verify' && !record.txHash) {
      record.fileHash = '0x' + Math.random().toString(16).substr(2, 64);
      record.txHash = '0x' + Math.random().toString(16).substr(2, 64);
    }
    
    res.json({ status: 'ok', newStatus: record.status });
  } else {
    res.status(404).json({ error: 'Record not found' });
  }
});

// Upload record - handle multipart form data
app.post('/api/upload-record', upload.array('files'), (req, res) => {
  const { recordId, patientName, hospitalName, note, patientContact, aadhaarNumber, clientFileHash, clientTxHash } = req.body;
  const files = req.files || [];
  
  console.log('Upload record:', recordId, patientName, hospitalName);
  console.log('Files uploaded:', files.length);
  
  // Use client hash if provided, otherwise generate one
  const fileHash = clientFileHash || ('0x' + Math.random().toString(16).substr(2, 64));
  const txHash = clientTxHash || ('0x' + Math.random().toString(16).substr(2, 64));
  
  const newRecord = {
    id: recordId,
    recordId,
    patientName,
    patientContact,
    aadhaarNumber,
    hospitalName,
    note,
    status: clientTxHash ? 'verified' : 'pending', // If client provided txHash, mark as verified
    uploadedAt: new Date().toISOString(),
    files: files.map(f => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size
    })),
    fileHash,
    txHash: clientTxHash || '', // Only set txHash if client provided it
    ...(clientTxHash && {
      verifiedAt: new Date().toISOString(),
      verifiedBy: 'blockchain'
    })
  };
  
  records.push(newRecord);
  console.log('Record added:', recordId, 'Status:', newRecord.status);
  
  res.json({ status: 'ok', fileHash, txHash });
});

// Health check
app.get('/api', (req, res) => {
  res.json({ 
    message: 'MedLedger API is running!', 
    timestamp: new Date().toISOString(),
    endpoints: ['/api/login', '/api/register-hospital', '/api/all-records', '/api/verify-record', '/api/upload-record']
  });
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'API is healthy' });
});

// Export for Vercel
module.exports = app;