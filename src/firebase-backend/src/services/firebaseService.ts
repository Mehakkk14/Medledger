import admin from 'firebase-admin';
const serviceAccount = require('../../serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: 'https://medledger-e1d6f.firebaseio.com'
});

export const db = admin.firestore();
export const auth = admin.auth();