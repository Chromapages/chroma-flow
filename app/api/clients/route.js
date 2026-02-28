// Simple ChromaBase API - Firebase REST
const PROJECT = 'chromabase-web-883a';

async function callFirestore(method, collection, data = null, docId = null) {
  const baseUrl = `https://firestore.googleapis.com/v1/projects/${PROJECT}/databases/(default)/documents`;
  let url = `${baseUrl}/${collection}`;
  if (docId) url += `/${docId}`;
  if (method === 'GET' && !docId) url += '?pageSize=100';
  
  const opts = { method, headers: { 'Content-Type': 'application/json' } };
  
  if (data && (method === 'POST' || method === 'PATCH')) {
    // Convert to Firestore format
    const fields = {};
    for (const [k, v] of Object.entries(data)) {
      if (v === null || v === undefined) continue;
      if (typeof v === 'string') fields[k] = { stringValue: v };
      else if (typeof v === 'number') fields[k] = { integerValue: String(v) };
      else if (typeof v === 'boolean') fields[k] = { booleanValue: v };
    }
    opts.body = JSON.stringify({ fields });
  }
  
  try {
    const res = await fetch(url, opts);
    return await res.json();
  } catch (e) {
    return { error: e.message };
  }
}

function parseFirestore(doc) {
  if (!doc.fields) return { id: doc.name?.split('/').pop() };
  const result = { id: doc.name?.split('/').pop() };
  for (const [k, v] of Object.entries(doc.fields)) {
    if (v.stringValue) result[k] = v.stringValue;
    else if (v.integerValue) result[k] = parseInt(v.integerValue);
    else if (v.doubleValue) result[k] = parseFloat(v.doubleValue);
    else if (v.booleanValue) result[k] = v.booleanValue;
  }
  return result;
}

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const col = searchParams.get('col') || 'clients';
  
  const result = await callFirestore('GET', col);
  
  if (result.error) {
    return Response.json({ status: 'error', message: result.error });
  }
  
  const docs = (result.documents || []).map(parseFirestore);
  return Response.json({ status: 'success', data: docs });
}

export async function POST(request) {
  const body = await request.json();
  const { col = 'clients', ...fields } = body;
  
  fields.created_at = new Date().toISOString();
  fields.updated_at = new Date().toISOString();
  
  const result = await callFirestore('POST', col, fields);
  
  if (result.error) {
    return Response.json({ status: 'error', message: result.error });
  }
  
  const id = result.name?.split('/').pop();
  return Response.json({ status: 'success', data: { id } });
}
