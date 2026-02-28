import { NextResponse } from 'next/server';
import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

let db;
try {
  const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT || '{}');
  if (serviceAccount.project_id) {
    initializeApp({ credential: cert(serviceAccount) });
    db = getFirestore();
  }
} catch (e) {}

export async function GET() {
  if (!db) return NextResponse.json({ status: 'error', message: 'DB not initialized' });
  try {
    const snapshot = await db.collection('clients').get();
    const data = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
    return NextResponse.json({ status: 'success', data });
  } catch (e) {
    return NextResponse.json({ status: 'error', message: e.message });
  }
}

export async function POST(request) {
  if (!db) return NextResponse.json({ status: 'error', message: 'DB not initialized' });
  try {
    const body = await request.json();
    const data = { ...body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() };
    const doc = await db.collection('clients').add(data);
    return NextResponse.json({ status: 'success', data: { id: doc.id } });
  } catch (e) {
    return NextResponse.json({ status: 'error', message: e.message });
  }
}
