const hospitals = [
  {
    id: 1,
    email: 'rastogimehak3845@gmail.com',
    password: 'mehak1234',
    hospitalName: 'Test Hospital'
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

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  console.log('Login request received:', req.body);
  const { email, password } = req.body;
  
  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password are required' });
  }
  
  const hospital = hospitals.find(h => h.email === email && h.password === password);
  
  if (hospital) {
    console.log('Login successful for:', email);
    res.status(200).json({ hospitalName: hospital.hospitalName });
  } else {
    console.log('Login failed for:', email);
    res.status(401).json({ error: 'Invalid credentials' });
  }
}