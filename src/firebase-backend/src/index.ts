import { db, auth } from './services/firebaseService';
import admin from 'firebase-admin';

// Register hospital
export async function registerHospital(email: string, password: string, profile: any) {
  const user = await auth.createUser({ email, password });
  await db.collection('hospitals').doc(user.uid).set(profile);
  return user;
}

// Verify record ID
export async function verifyRecordId(recordId: string) {
  const db = admin.firestore();
  const doc = await db.collection('medicalRecords').doc(recordId).get();
  if (!doc.exists) return null;
  return doc.data();
}

// Log actions
export async function logAction(action: string, details: any) {
  const db = admin.firestore();
  await db.collection('logs').add({
    action,
    details,
    timestamp: new Date().toISOString(),
  });
  if (action === 'upload-record' && details.recordId) {
    // Ensure all required fields exist
    const record = {
      recordId: details.recordId,
      status: details.status || "verified",
      patientName: details.patientName || "",
      hospitalName: details.hospitalName || "",
      uploadedAt: details.uploadedAt || new Date().toISOString(),
      txHash: details.txHash || "",
      fileHash: details.fileHash || "",
      verificationTime: details.verificationTime || "0.01s",
      ...details
    };
    await db.collection('medicalRecords').doc(details.recordId).set(record);
  }
}

// Add analytics
export async function addAnalytics(data: any) {
  const db = admin.firestore();
  await db.collection('analytics').add({
    ...data,
    timestamp: new Date().toISOString(),
  });
}