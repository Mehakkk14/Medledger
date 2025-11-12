const express = require('express');
const cors = require('cors');
const multer = require('multer');

const app = express();
app.use(cors({
  origin: ['http://localhost:8080', 'http://127.0.0.1:8080'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Setup multer for handling file uploads
const upload = multer({ dest: 'uploads/' });

// Request logging
app.use((req, res, next) => {
  console.log(`${req.method} ${req.path}`, req.body ? 'Body present' : 'No body');
  next();
});

// In-memory storage for demo - this will persist during server session
let hospitals = [
  {
    id: 1,
    email: 'rastogimehak3845@gmail.com',
    password: 'mehak1234',
    hospitalName: 'Test Hospital'
  }
];

let hospitalIdCounter = 2;

// In-memory records storage - will persist during server session
let records = [
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
app.post('/login', (req, res) => {
  const { email, password } = req.body;
  console.log('Login attempt:', email, password);
  
  const hospital = hospitals.find(h => h.email === email && h.password === password);
  if (hospital) {
    res.json({ hospitalName: hospital.hospitalName });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
});

// Registration endpoint
app.post('/register-hospital', (req, res) => {
  const { email, password, profile } = req.body;
  console.log('Registration attempt:', email, profile);
  
  // Check if email already exists
  const existingHospital = hospitals.find(h => h.email === email);
  if (existingHospital) {
    return res.status(400).json({ error: 'Email already registered' });
  }
  
  // Validate required fields
  if (!email || !password || !profile?.organization) {
    return res.status(400).json({ error: 'Email, password, and organization are required' });
  }
  
  const newHospital = {
    id: hospitalIdCounter++,
    email,
    password,
    hospitalName: profile.organization || profile.hospitalName,
    firstName: profile.firstName || '',
    lastName: profile.lastName || '',
    phone: profile.phone || '',
    createdAt: new Date().toISOString()
  };
  
  hospitals.push(newHospital);
  console.log('New hospital registered:', newHospital.hospitalName);
  
  res.json({ uid: 'test-uid-' + newHospital.id, hospitalName: newHospital.hospitalName });
});

// Get all records
app.get('/all-records', (req, res) => {
  const hospitalName = req.query.hospitalName;
  console.log('Fetching records for:', hospitalName);
  
  const hospitalRecords = records.filter(r => r.hospitalName === hospitalName);
  res.json({ records: hospitalRecords });
});

// Verify record
app.get('/verify-record/:id', (req, res) => {
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
app.post('/admin-verify-record', (req, res) => {
  const { recordId, action } = req.body;
  console.log('Admin action:', action, 'for record:', recordId);
  
  if (!recordId || !action) {
    return res.status(400).json({ error: 'Record ID and action are required' });
  }
  
  if (!['verify', 'reject'].includes(action)) {
    return res.status(400).json({ error: 'Action must be "verify" or "reject"' });
  }
  
  const recordIndex = records.findIndex(r => r.recordId === recordId);
  if (recordIndex !== -1) {
    const record = records[recordIndex];
    
    // Update record status
    record.status = action === 'verify' ? 'verified' : 'invalid';
    record.verifiedAt = new Date().toISOString();
    record.verifiedBy = 'admin';
    
    // Add blockchain transaction hash if verifying
    if (action === 'verify') {
      if (!record.txHash || record.txHash === '') {
        record.txHash = '0x' + Math.random().toString(16).substr(2, 64);
      }
      if (!record.fileHash || record.fileHash === '') {
        record.fileHash = '0x' + Math.random().toString(16).substr(2, 64);
      }
    }
    
    console.log(`Record ${recordId} ${action === 'verify' ? 'verified' : 'rejected'} by admin`);
    
    res.json({ 
      status: 'ok', 
      newStatus: record.status,
      message: `Record ${action === 'verify' ? 'verified' : 'rejected'} successfully`,
      txHash: record.txHash,
      fileHash: record.fileHash
    });
  } else {
    console.log('Record not found:', recordId);
    res.status(404).json({ error: 'Record not found' });
  }
});

// Upload record - handle multipart form data
app.post('/upload-record', upload.array('files'), (req, res) => {
  const { recordId, patientName, hospitalName, note, patientContact, aadhaarNumber, clientFileHash, clientTxHash } = req.body;
  const files = req.files || [];
  
  console.log('Upload record:', recordId, patientName, hospitalName);
  console.log('Files uploaded:', files.length);
  console.log('Request body:', req.body);
  
  // Validate required fields
  if (!recordId || !patientName || !hospitalName) {
    return res.status(400).json({ error: 'Record ID, Patient Name, and Hospital Name are required' });
  }
  
  // Check if record ID already exists
  const existingRecord = records.find(r => r.recordId === recordId);
  if (existingRecord) {
    return res.status(400).json({ error: 'Record ID already exists' });
  }
  
  // Generate hashes (use client hash if provided, otherwise generate)
  const fileHash = clientFileHash || ('0x' + Math.random().toString(16).substr(2, 64));
  const txHash = clientTxHash || ('0x' + Math.random().toString(16).substr(2, 64));
  
  const newRecord = {
    id: recordId,
    recordId,
    patientName,
    patientContact: patientContact || '',
    aadhaarNumber: aadhaarNumber || '',
    hospitalName,
    note: note || '',
    status: 'pending', // All new records start as pending for admin approval
    uploadedAt: new Date().toISOString(),
    files: files.length > 0 ? files.map(f => ({
      originalname: f.originalname,
      mimetype: f.mimetype,
      size: f.size,
      path: f.path
    })) : [{mimetype: 'application/pdf', size: 1024000}], // Default if no files
    fileHash,
    txHash: '', // Will be set when verified
    uploadedBy: hospitalName,
    verificationTime: Math.random().toFixed(2) + 's'
  };
  
  records.push(newRecord);
  console.log('Record added:', recordId, 'Status:', newRecord.status, 'Total records:', records.length);
  
  res.json({ 
    status: 'ok', 
    fileHash, 
    txHash: fileHash, // Return fileHash as txHash for now
    message: 'Record uploaded successfully and pending verification'
  });
});

// Debug endpoints
app.get('/debug/hospitals', (req, res) => {
  res.json({ hospitals, count: hospitals.length });
});

app.get('/debug/records', (req, res) => {
  res.json({ records, count: records.length });
});

app.get('/debug/status', (req, res) => {
  res.json({ 
    status: 'running',
    hospitalsCount: hospitals.length,
    recordsCount: records.length,
    timestamp: new Date().toISOString()
  });
});

app.listen(3001, () => {
  console.log('Simple backend running on port 3001');
  console.log('Available endpoints:');
  console.log('POST /login - Hospital login');
  console.log('POST /register-hospital - Register new hospital');
  console.log('GET  /all-records?hospitalName=X - Get records for hospital');
  console.log('POST /upload-record - Upload new medical record');
  console.log('POST /admin-verify-record - Verify/reject pending records');
  console.log('GET  /verify-record/:id - Get record details');
  console.log('GET  /debug/status - Server status');
  console.log('\nDemo hospital: rastogimehak3845@gmail.com / mehak1234');
});