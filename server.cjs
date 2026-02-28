/**
 * ChromaBase REST API Server
 * Connect this to OpenClaw or any external system
 * 
 * Run: node server.js
 * Default port: 3000
 */

const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');
const express = require('express');
const cors = require('cors');
const http = require('http');

// Firebase service account (you'll need to download from Firebase Console)
// Initialize Firebase Admin
let cred;
if (process.env.FIREBASE_SERVICE_ACCOUNT) {
  cred = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT);
} else {
  try {
    cred = require('./service-account.json');
  } catch (e) {
    console.log('No service account file found');
  }
}

if (cred) {
  initializeApp({
    credential: cert(cred)
  });
}

const db = getFirestore();
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());

// Root route - API info page
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>ChromaBase API</title>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; background: #fafafa; }
        h1 { color: #333; }
        .endpoint { background: #fff; padding: 12px 15px; margin: 8px 0; border-radius: 8px; font-family: monospace; box-shadow: 0 1px 3px rgba(0,0,0,0.1); }
        .method { display: inline-block; width: 60px; font-weight: bold; margin-right: 10px; }
        .get { color: #28a745; }
        .post { color: #007bff; }
        a { color: #666; }
      </style>
    </head>
    <body>
      <h1>🚀 ChromaBase API</h1>
      <p>REST API for ChromaBase CRM</p>
      <h2>Available Endpoints</h2>
      <div class='endpoint'><span class='method get'>GET</span> <a href='/api/health'>/api/health</a> - Health check</div>
      <div class='endpoint'><span class='method get'>GET</span> <a href='/api/clients'>/api/clients</a> - List clients</div>
      <div class='endpoint'><span class='method post'>POST</span> /api/clients - Create client</div>
      <div class='endpoint'><span class='method get'>GET</span> <a href='/api/leads'>/api/leads</a> - List leads</div>
      <div class='endpoint'><span class='method post'>POST</span> /api/leads - Create lead</div>
      <div class='endpoint'><span class='method get'>GET</span> <a href='/api/campaigns'>/api/campaigns</a> - List campaigns</div>
      <div class='endpoint'><span class='method get'>GET</span> <a href='/api/content'>/api/content</a> - List content</div>
      <div class='endpoint'><span class='method get'>GET</span> <a href='/api/deliverables'>/api/deliverables</a> - List deliverables</div>
    </body>
    </html>
  `);
});

app.use(express.json());

// Helper to format response
const success = (data) => ({ status: 'success', data });
const error = (msg) => ({ status: 'error', message: msg });

// ================== CLIENTS ==================

// GET all clients
app.get('/api/clients', async (req, res) => {
  try {
    const snapshot = await db.collection('clients').get();
    const clients = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(success(clients));
  } catch (e) {
    res.json(error(e.message));
  }
});

// GET single client
app.get('/api/clients/:id', async (req, res) => {
  try {
    const doc = await db.collection('clients').doc(req.params.id).get();
    if (!doc.exists) return res.json(error('Client not found'));
    res.json(success({ id: doc.id, ...doc.data() }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// POST create client
app.post('/api/clients', async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const doc = await db.collection('clients').add(data);
    triggerWebhook('clients', 'created', { id: doc.id, ...data });
    broadcastSSE('clients', 'created', { id: doc.id, ...data });
    res.json(success({ id: doc.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// PUT update client
app.put('/api/clients/:id', async (req, res) => {
  try {
    triggerWebhook('clients', 'updated', { id: req.params.id, ...req.body });
    broadcastSSE('clients', 'updated', { id: req.params.id, ...req.body });
    await db.collection('clients').doc(req.params.id).update({
      ...req.body,
      updated_at: new Date().toISOString()
    });
    res.json(success({ id: req.params.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// DELETE client
app.delete('/api/clients/:id', async (req, res) => {
  try {
    await db.collection('clients').doc(req.params.id).delete();
    triggerWebhook('clients', 'deleted', { id: req.params.id });
    broadcastSSE('clients', 'deleted', { id: req.params.id });
    res.json(success({ deleted: true }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// ================== LEADS ==================

app.get('/api/leads', async (req, res) => {
  try {
    const snapshot = await db.collection('leads').get();
    const leads = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(success(leads));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.get('/api/leads/:id', async (req, res) => {
  try {
    const doc = await db.collection('leads').doc(req.params.id).get();
    if (!doc.exists) return res.json(error('Lead not found'));
    res.json(success({ id: doc.id, ...doc.data() }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.post('/api/leads', async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const doc = await db.collection('leads').add(data);
    triggerWebhook('leads', 'created', { id: doc.id, ...data });
    broadcastSSE('leads', 'created', { id: doc.id, ...data });
    res.json(success({ id: doc.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.put('/api/leads/:id', async (req, res) => {
  try {
    triggerWebhook('leads', 'updated', { id: req.params.id, ...req.body });
    broadcastSSE('leads', 'updated', { id: req.params.id, ...req.body });
    await db.collection('leads').doc(req.params.id).update({
      ...req.body,
      updated_at: new Date().toISOString()
    });
    res.json(success({ id: req.params.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.delete('/api/leads/:id', async (req, res) => {
  try {
    await db.collection('leads').doc(req.params.id).delete();
    triggerWebhook('leads', 'deleted', { id: req.params.id });
    broadcastSSE('leads', 'deleted', { id: req.params.id });
    res.json(success({ deleted: true }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// ================== CAMPAIGNS ==================

app.get('/api/campaigns', async (req, res) => {
  try {
    const snapshot = await db.collection('campaigns').get();
    const campaigns = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(success(campaigns));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.get('/api/campaigns/:id', async (req, res) => {
  try {
    const doc = await db.collection('campaigns').doc(req.params.id).get();
    if (!doc.exists) return res.json(error('Campaign not found'));
    res.json(success({ id: doc.id, ...doc.data() }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.post('/api/campaigns', async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const doc = await db.collection('campaigns').add(data);
    triggerWebhook('campaigns', 'created', { id: doc.id, ...data });
    broadcastSSE('campaigns', 'created', { id: doc.id, ...data });
    res.json(success({ id: doc.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.put('/api/campaigns/:id', async (req, res) => {
  try {
    triggerWebhook('campaigns', 'updated', { id: req.params.id, ...req.body });
    broadcastSSE('campaigns', 'updated', { id: req.params.id, ...req.body });
    await db.collection('campaigns').doc(req.params.id).update({
      ...req.body,
      updated_at: new Date().toISOString()
    });
    res.json(success({ id: req.params.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.delete('/api/campaigns/:id', async (req, res) => {
  try {
    await db.collection('campaigns').doc(req.params.id).delete();
    triggerWebhook('campaigns', 'deleted', { id: req.params.id });
    broadcastSSE('campaigns', 'deleted', { id: req.params.id });
    res.json(success({ deleted: true }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// ================== CONTENT ==================

app.get('/api/content', async (req, res) => {
  try {
    const snapshot = await db.collection('content').get();
    const content = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(success(content));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.post('/api/content', async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const doc = await db.collection('content').add(data);
    triggerWebhook('content', 'created', { id: doc.id, ...data });
    broadcastSSE('content', 'created', { id: doc.id, ...data });
    res.json(success({ id: doc.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.put('/api/content/:id', async (req, res) => {
  try {
    triggerWebhook('content', 'updated', { id: req.params.id, ...req.body });
    broadcastSSE('content', 'updated', { id: req.params.id, ...req.body });
    await db.collection('content').doc(req.params.id).update({
      ...req.body,
      updated_at: new Date().toISOString()
    });
    res.json(success({ id: req.params.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.delete('/api/content/:id', async (req, res) => {
  try {
    await db.collection('content').doc(req.params.id).delete();
    triggerWebhook('content', 'deleted', { id: req.params.id });
    broadcastSSE('content', 'deleted', { id: req.params.id });
    res.json(success({ deleted: true }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// ================== DELIVERABLES ==================

app.get('/api/deliverables', async (req, res) => {
  try {
    const snapshot = await db.collection('deliverables').get();
    const items = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    res.json(success(items));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.post('/api/deliverables', async (req, res) => {
  try {
    const data = {
      ...req.body,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    const doc = await db.collection('deliverables').add(data);
    triggerWebhook('deliverables', 'created', { id: doc.id, ...data });
    broadcastSSE('deliverables', 'created', { id: doc.id, ...data });
    res.json(success({ id: doc.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.put('/api/deliverables/:id', async (req, res) => {
  try {
    triggerWebhook('deliverables', 'updated', { id: req.params.id, ...req.body });
    broadcastSSE('deliverables', 'updated', { id: req.params.id, ...req.body });
    await db.collection('deliverables').doc(req.params.id).update({
      ...req.body,
      updated_at: new Date().toISOString()
    });
    res.json(success({ id: req.params.id }));
  } catch (e) {
    res.json(error(e.message));
  }
});

app.delete('/api/deliverables/:id', async (req, res) => {
  try {
    await db.collection('deliverables').doc(req.params.id).delete();
    triggerWebhook('deliverables', 'deleted', { id: req.params.id });
    broadcastSSE('deliverables', 'deleted', { id: req.params.id });
    res.json(success({ deleted: true }));
  } catch (e) {
    res.json(error(e.message));
  }
});

// ================== HEALTH ==================

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'ChromaBase API', timestamp: new Date().toISOString() });
});

// Start server
const server = http.createServer(app);
server.listen(PORT, () => {
  console.log(`🚀 ChromaBase API running on http://localhost:${PORT}`);
  console.log(`
📋 Endpoints:
  GET    /api/health         - Health check
  GET    /api/clients        - List all clients
  POST   /api/clients        - Create client
  GET    /api/clients/:id    - Get client
  PUT    /api/clients/:id    - Update client
  DELETE /api/clients/:id    - Delete client
  GET    /api/leads          - List all leads
  POST   /api/leads          - Create lead
  GET    /api/leads/:id      - Get lead
  PUT    /api/leads/:id      - Update lead
  DELETE /api/leads/:id      - Delete lead
  GET    /api/campaigns      - List all campaigns
  POST   /api/campaigns      - Create campaign
  GET    /api/campaigns/:id  - Get campaign
  PUT    /api/campaigns/:id  - Update campaign
  DELETE /api/campaigns/:id  - Delete campaign
  GET    /api/content        - List all content
  POST   /api/content        - Create content
  GET    /api/content/:id    - Get content
  PUT    /api/content/:id    - Update content
  DELETE /api/content/:id    - Delete content
  GET    /api/deliverables   - List all deliverables
  POST   /api/deliverables   - Create deliverable
  PUT    /api/deliverables/:id - Update deliverable
  DELETE /api/deliverables/:id - Delete deliverable
  `);
});

// ================== WEBHOOKS ==================

// Store webhooks in memory (could be saved to Firestore)
const webhooks = {
  clients: [],
  leads: [],
  campaigns: [],
  content: [],
  deliverables: []
};

// SSE clients for real-time updates
const sseClients = new Set();

// Webhook helper - notify all registered webhooks
async function triggerWebhook(collection, event, data) {
  const hooks = webhooks[collection] || [];
  for (const url of hooks) {
    try {
      await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ event, collection, data, timestamp: new Date().toISOString() })
      });
    } catch (e) {
      console.log(`Webhook failed for ${url}: ${e.message}`);
    }
  }
}

// SSE helper - broadcast to all connected clients
function broadcastSSE(collection, event, data) {
  const message = `event: ${event}\ndata: ${JSON.stringify({ collection, data, timestamp: new Date().toISOString() })}\n\n`;
  for (const client of sseClients) {
    client.write(message);
  }
}

// Register webhook
app.post('/api/webhooks', (req, res) => {
  const { url, collection } = req.body;
  if (!url) return res.json({ status: 'error', message: 'URL required' });
  
  const coll = collection || 'clients';
  if (!webhooks[coll]) webhooks[coll] = [];
  webhooks[coll].push(url);
  
  res.json({ status: 'success', message: `Webhook registered for ${coll}`, count: webhooks[coll].length });
});

// List webhooks
app.get('/api/webhooks', (req, res) => {
  res.json({ status: 'success', webhooks });
});

// Delete webhook
app.delete('/api/webhooks', (req, res) => {
  const { url, collection } = req.body;
  if (!url || !collection || !webhooks[collection]) {
    return res.json({ status: 'error', message: 'URL and collection required' });
  }
  webhooks[collection] = webhooks[collection].filter(u => u !== url);
  res.json({ status: 'success', message: 'Webhook removed' });
});

// SSE endpoint for real-time updates
app.get('/api/stream', (req, res) => {
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');
  res.setHeader('Access-Control-Allow-Origin', '*');
  
  // Send initial connection message
  res.write('event: connected\ndata: {"status":"connected"}\n\n');
  
  // Add to clients
  sseClients.add(res);
  
  // Remove on close
  req.on('close', () => {
    sseClients.delete(res);
  });
});

// Health check with stats
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    service: 'ChromaBase API', 
    timestamp: new Date().toISOString(),
    stats: {
      sseClients: sseClients.size,
      webhooks: Object.fromEntries(Object.entries(webhooks).map(([k,v]) => [k, v.length]))
    }
  });
});
