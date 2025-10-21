const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://medledger-e1d6f.firebaseio.com'
});

const db = admin.firestore();

async function createTestRecord() {
  try {
    // Create a test medical record
    await db.collection('medicalRecords').add({
      recordId: 'MR0005',
      patientName: 'Pari',
      patientContact: '9555709375',
      aadhaarNumber: '123456789012',
      hospitalName: 'Test Hospital',
      note: 'Test medical record for demonstration',
      files: [{
        originalname: 'test-report.pdf',
        mimetype: 'application/pdf',
        size: 1024000
      }],
      fileHash: '0x1d7c41610db21c691e8288161c4bac1b3980db0a8acae9cd840a4f',
      uploadedAt: new Date().toISOString(),
      status: 'pending',
      txHash: '',
      createdAt: new Date().toISOString()
    });
    
    console.log('Test medical record created successfully!');
    console.log('Record ID: MR0005');
    console.log('Patient: Pari');
    console.log('Hospital: Test Hospital');
    console.log('Status: pending');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating record:', error);
    process.exit(1);
  }
}

createTestRecord();