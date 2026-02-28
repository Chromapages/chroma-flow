const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const express = require('express');
const cors = require('cors');

const serviceAccount = require('./service-account.json');

initializeApp({ credential: cert(serviceAccount) });
const db = getFirestore();

const app = express();
app.use(cors());
app.use(express.json());

const success = (data) => ({ status: 'success', data });
const error = (msg) => ({ status: 'error', message: msg });

// Root
app.get('/', (req, res) => {
  res.send(`<h1>🚀 ChromaBase API</h1><p>Running locally on port 3000</p>`);
});

// Health
app.get('/api/health', (req, res) => res.json({ status: 'ok', service: 'ChromaBase API' }));

// Clients
app.get('/api/clients', async (req, res) => {
  try {
    const snap = await db.collection('clients').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/clients', async (req, res) => {
  try {
    const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const doc = await db.collection('clients').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

// Leads
app.get('/api/leads', async (req, res) => {
  try {
    const snap = await db.collection('leads').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/leads', async (req, res) => {
  try {
    const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const doc = await db.collection('leads').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

// Campaigns
app.get('/api/campaigns', async (req, res) => {
  try {
    const snap = await db.collection('campaigns').get();
    res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
  } catch (e) { res.json(error(e.message)); }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const doc = await db.collection('campaigns').add(data);
    res.json(success({ id: doc.id }));
  } catch (e) { res.json(error(e.message)); }
});

app.listen(3000, () => console.log('🚀 ChromaBase API running on http://localhost:3000'));
