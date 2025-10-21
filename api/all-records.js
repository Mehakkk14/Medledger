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

export default function handler(req, res) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version');

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const hospitalName = req.query.hospitalName;
  console.log('Fetching records for:', hospitalName);
  
  const hospitalRecords = records.filter(r => r.hospitalName === hospitalName);
  res.status(200).json({ records: hospitalRecords });
}