const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://medledger-e1d6f.firebaseio.com'
});

const db = admin.firestore();

async function createTestHospital() {
  try {
    // Create a test hospital
    await db.collection('hospitals').add({
      email: 'rastogimehak3845@gmail.com',
      password: 'mehak1234', // In production, this should be hashed
      hospitalName: 'Test Hospital',
      firstName: 'Test',
      lastName: 'User',
      phone: '9555709375',
      organization: 'Test Hospital',
      createdAt: new Date().toISOString()
    });
    
    console.log('Test hospital created successfully!');
    console.log('Email: rastogimehak3845@gmail.com');
    console.log('Password: mehak1234');
    
    process.exit(0);
  } catch (error) {
    console.error('Error creating hospital:', error);
    process.exit(1);
  }
}

createTestHospital();