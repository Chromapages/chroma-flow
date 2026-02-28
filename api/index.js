const { initializeApp, cert } = require('firebase-admin/app');
const { getFirestore } = require('firebase-admin/firestore');

// Initialize Firebase
let db;
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  if (serviceAccount.project_id) {
    initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore();
  }
} catch (e) {
  console.log('Firebase init error:', e.message);
}

const success = (data) => ({ status: 'success', data });
const error = (msg) => ({ status: 'error', message: msg });

module.exports = async (req, res) => {
  // CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  
  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const { path } = req;
  const pathParts = path.replace(/^\/api\//, '').split('/');
  const [collection, id] = pathParts;

  // Health
  if (path === '/api/health') {
    return res.json({ status: 'ok', service: 'ChromaBase API' });
  }

  if (!db) {
    return res.json(error('Database not initialized'));
  }

  try {
    // CLIENTS
    if (collection === 'clients') {
      if (req.method === 'GET' && !id) {
        const snap = await db.collection('clients').get();
        return res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
      if (req.method === 'POST') {
        const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        const doc = await db.collection('clients').add(data);
        return res.json(success({ id: doc.id }));
      }
      if (id && req.method === 'GET') {
        const doc = await db.collection('clients').doc(id).get();
        return doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
      }
      if (id && req.method === 'PUT') {
        await db.collection('clients').doc(id).update({ ...req.body, updated_at: new Date().toISOString() });
        return res.json(success({ id }));
      }
      if (id && req.method === 'DELETE') {
        await db.collection('clients').doc(id).delete();
        return res.json(success({ deleted: true }));
      }
    }

    // LEADS
    if (collection === 'leads') {
      if (req.method === 'GET' && !id) {
        const snap = await db.collection('leads').get();
        return res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
      if (req.method === 'POST') {
        const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        const doc = await db.collection('leads').add(data);
        return res.json(success({ id: doc.id }));
      }
      if (id && req.method === 'GET') {
        const doc = await db.collection('leads').doc(id).get();
        return doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
      }
      if (id && req.method === 'PUT') {
        await db.collection('leads').doc(id).update({ ...req.body, updated_at: new Date().toISOString() });
        return res.json(success({ id }));
      }
      if (id && req.method === 'DELETE') {
        await db.collection('leads').doc(id).delete();
        return res.json(success({ deleted: true }));
      }
    }

    // CAMPAIGNS
    if (collection === 'campaigns') {
      if (req.method === 'GET' && !id) {
        const snap = await db.collection('campaigns').get();
        return res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
      if (req.method === 'POST') {
        const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        const doc = await db.collection('campaigns').add(data);
        return res.json(success({ id: doc.id }));
      }
      if (id && req.method === 'GET') {
        const doc = await db.collection('campaigns').doc(id).get();
        return doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
      }
      if (id && req.method === 'PUT') {
        await db.collection('campaigns').doc(id).update({ ...req.body, updated_at: new Date().toISOString() });
        return res.json(success({ id }));
      }
      if (id && req.method === 'DELETE') {
        await db.collection('campaigns').doc(id).delete();
        return res.json(success({ deleted: true }));
      }
    }

    // CONTENT
    if (collection === 'content') {
      if (req.method === 'GET' && !id) {
        const snap = await db.collection('content').get();
        return res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
      if (req.method === 'POST') {
        const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        const doc = await db.collection('content').add(data);
        return res.json(success({ id: doc.id }));
      }
      if (id && req.method === 'GET') {
        const doc = await db.collection('content').doc(id).get();
        return doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
      }
      if (id && req.method === 'PUT') {
        await db.collection('content').doc(id).update({ ...req.body, updated_at: new Date().toISOString() });
        return res.json(success({ id }));
      }
      if (id && req.method === 'DELETE') {
        await db.collection('content').doc(id).delete();
        return res.json(success({ deleted: true }));
      }
    }

    // DELIVERABLES
    if (collection === 'deliverables') {
      if (req.method === 'GET' && !id) {
        const snap = await db.collection('deliverables').get();
        return res.json(success(snap.docs.map(d => ({ id: d.id, ...d.data() }))));
      }
      if (req.method === 'POST') {
        const data = { ...req.body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
        const doc = await db.collection('deliverables').add(data);
        return res.json(success({ id: doc.id }));
      }
      if (id && req.method === 'GET') {
        const doc = await db.collection('deliverables').doc(id).get();
        return doc.exists ? res.json(success({ id: doc.id, ...doc.data() })) : res.json(error('Not found'));
      }
      if (id && req.method === 'PUT') {
        await db.collection('deliverables').doc(id).update({ ...req.body, updated_at: new Date().toISOString() });
        return res.json(success({ id }));
      }
      if (id && req.method === 'DELETE') {
        await db.collection('deliverables').doc(id).delete();
        return res.json(success({ deleted: true }));
      }
    }

    return res.json(error('Not found'));
  } catch (e) {
    return res.json(error(e.message));
  }
};
