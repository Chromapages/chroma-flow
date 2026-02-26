import { collection, addDoc, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { db } from "../lib/firebase";

export interface Client {
  id: string;
  name: string;
  email: string;
  phone?: string;
  company?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Lead {
  id: string;
  client_id?: string;
  name: string;
  email: string;
  phone?: string;
  source?: string;
  pipeline_stage: string;
  value?: number;
  notes?: string;
  created_at: string;
  updated_at: string;
}

export interface Campaign {
  id: string;
  client_id?: string;
  name: string;
  description?: string;
  status: "planning" | "active" | "paused" | "completed";
  start_date?: string;
  end_date?: string;
  budget?: number;
  spent?: number;
  conversions?: number;
  cpa?: number;
  roi?: number;
  ctr?: number;
  conversion_rate?: number;
  created_at: string;
  updated_at: string;
}

export interface Content {
  id: string;
  campaign_id?: string;
  client_id?: string;
  title: string;
  content_type: string;
  status: string;
  content_body?: string;
  published_at?: string;
  created_at: string;
  updated_at: string;
}

export interface Deliverable {
  id: string;
  campaign_id?: string;
  client_id: string;
  name: string;
  description?: string;
  due_date?: string;
  status: string;
  created_at: string;
  updated_at: string;
}

// Utility to create dates
const now = () => new Date().toISOString();

// Validation helpers
const isValidEmail = (email: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
const isNonEmpty = (val: string) => typeof val === 'string' && val.trim().length > 0;

// Sanitize input - remove potentially dangerous fields
const sanitizeData = <T extends object>(data: T): Partial<T> => {
  const sanitized: Record<string, unknown> = {};
  const allowedFields = Object.keys(data);
  
  for (const key of allowedFields) {
    const value = (data as Record<string, unknown>)[key];
    // Skip undefined, functions, and objects (prevent injection)
    if (value === undefined || typeof value === 'function') continue;
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) continue;
    sanitized[key] = value;
  }
  return sanitized as Partial<T>;
};

// Client API
export const clientApi = {
  collection: collection(db, "clients"),
  create: async (data: Omit<Client, "id" | "created_at" | "updated_at">) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Client name is required");
    if (!isNonEmpty(data.email)) throw new Error("Client email is required");
    if (!isValidEmail(data.email)) throw new Error("Invalid email format");
    if (!isNonEmpty(data.status)) throw new Error("Client status is required");
    
    const sanitized = sanitizeData(data);
    const docRef = await addDoc(collection(db, "clients"), {
      ...sanitized,
      created_at: now(),
      updated_at: now()
    });
    return { id: docRef.id, ...sanitized, created_at: now(), updated_at: now() } as Client;
  },
  update: async (data: Client) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Client name is required");
    if (!isNonEmpty(data.email)) throw new Error("Client email is required");
    if (!isValidEmail(data.email)) throw new Error("Invalid email format");
    if (!isNonEmpty(data.status)) throw new Error("Client status is required");
    
    const docRef = doc(db, "clients", data.id);
    const { id, ...updateData } = sanitizeData(data);
    await updateDoc(docRef, { ...updateData, updated_at: now() });
    return { ...data, updated_at: now() };
  },
  delete: async (id: string) => {
    if (!isNonEmpty(id)) throw new Error("Invalid document ID");
    await deleteDoc(doc(db, "clients", id));
  },
};

// Lead API
const LEAD_STAGES = ['New', 'Contacted', 'Qualified', 'Proposal', 'Won', 'Lost'];
const LEAD_SOURCES = ['Website', 'Referral', 'Social', 'Cold Outreach', 'Ad', 'Event', 'Other'];

export const leadApi = {
  collection: collection(db, "leads"),
  create: async (data: Omit<Lead, "id" | "created_at" | "updated_at">) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Lead name is required");
    if (!isNonEmpty(data.email)) throw new Error("Lead email is required");
    if (!isValidEmail(data.email)) throw new Error("Invalid email format");
    if (!isNonEmpty(data.pipeline_stage)) throw new Error("Pipeline stage is required");
    if (!LEAD_STAGES.includes(data.pipeline_stage)) throw new Error(`Invalid pipeline stage. Must be one of: ${LEAD_STAGES.join(', ')}`);
    if (data.source && !LEAD_SOURCES.includes(data.source)) throw new Error(`Invalid source. Must be one of: ${LEAD_SOURCES.join(', ')}`);
    if (data.value !== undefined && (typeof data.value !== 'number' || data.value < 0)) throw new Error("Value must be a positive number");
    
    const sanitized = sanitizeData(data);
    const docRef = await addDoc(collection(db, "leads"), {
      ...sanitized,
      created_at: now(),
      updated_at: now()
    });
    return { id: docRef.id, ...sanitized, created_at: now(), updated_at: now() } as Lead;
  },
  update: async (data: Lead) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Lead name is required");
    if (!isNonEmpty(data.email)) throw new Error("Lead email is required");
    if (!isValidEmail(data.email)) throw new Error("Invalid email format");
    if (!isNonEmpty(data.pipeline_stage)) throw new Error("Pipeline stage is required");
    if (!LEAD_STAGES.includes(data.pipeline_stage)) throw new Error(`Invalid pipeline stage. Must be one of: ${LEAD_STAGES.join(', ')}`);
    if (data.value !== undefined && (typeof data.value !== 'number' || data.value < 0)) throw new Error("Value must be a positive number");
    
    const docRef = doc(db, "leads", data.id);
    const { id, ...updateData } = sanitizeData(data);
    await updateDoc(docRef, { ...updateData, updated_at: now() });
    return { ...data, updated_at: now() };
  },
  delete: async (id: string) => {
    if (!isNonEmpty(id)) throw new Error("Invalid document ID");
    await deleteDoc(doc(db, "leads", id));
  },
};

// Campaign API
const CAMPAIGN_STATUSES = ['planning', 'active', 'paused', 'completed'];

export const campaignApi = {
  collection: collection(db, "campaigns"),
  create: async (data: Omit<Campaign, "id" | "created_at" | "updated_at">) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Campaign name is required");
    if (!isNonEmpty(data.status)) throw new Error("Campaign status is required");
    if (!CAMPAIGN_STATUSES.includes(data.status)) throw new Error(`Invalid status. Must be one of: ${CAMPAIGN_STATUSES.join(', ')}`);
    if (data.budget !== undefined && (typeof data.budget !== 'number' || data.budget < 0)) throw new Error("Budget must be a positive number");
    
    const sanitized = sanitizeData(data);
    const docRef = await addDoc(collection(db, "campaigns"), {
      ...sanitized,
      created_at: now(),
      updated_at: now()
    });
    return { id: docRef.id, ...sanitized, created_at: now(), updated_at: now() } as Campaign;
  },
  update: async (data: Campaign) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Campaign name is required");
    if (!isNonEmpty(data.status)) throw new Error("Campaign status is required");
    if (!CAMPAIGN_STATUSES.includes(data.status)) throw new Error(`Invalid status. Must be one of: ${CAMPAIGN_STATUSES.join(', ')}`);
    if (data.budget !== undefined && (typeof data.budget !== 'number' || data.budget < 0)) throw new Error("Budget must be a positive number");
    
    const docRef = doc(db, "campaigns", data.id);
    const { id, ...updateData } = sanitizeData(data);
    await updateDoc(docRef, { ...updateData, updated_at: now() });
    return { ...data, updated_at: now() };
  },
  delete: async (id: string) => {
    if (!isNonEmpty(id)) throw new Error("Invalid document ID");
    await deleteDoc(doc(db, "campaigns", id));
  },
};

// Content API
const CONTENT_TYPES = ['Blog Post', 'Social Media', 'Email', 'Landing Page', 'Ad Copy', 'Video Script', 'Other'];
const CONTENT_STATUSES = ['Draft', 'Review', 'Approved', 'Published', 'Archived'];

export const contentApi = {
  collection: collection(db, "contents"),
  create: async (data: Omit<Content, "id" | "created_at" | "updated_at" | "published_at">) => {
    // Input validation
    if (!isNonEmpty(data.title)) throw new Error("Content title is required");
    if (!isNonEmpty(data.content_type)) throw new Error("Content type is required");
    if (!CONTENT_TYPES.includes(data.content_type)) throw new Error(`Invalid content type. Must be one of: ${CONTENT_TYPES.join(', ')}`);
    if (!isNonEmpty(data.status)) throw new Error("Content status is required");
    if (!CONTENT_STATUSES.includes(data.status)) throw new Error(`Invalid status. Must be one of: ${CONTENT_STATUSES.join(', ')}`);
    
    const sanitized = sanitizeData(data);
    const docRef = await addDoc(collection(db, "contents"), {
      ...sanitized,
      created_at: now(),
      updated_at: now()
    });
    return { id: docRef.id, ...sanitized, created_at: now(), updated_at: now() } as Content;
  },
  update: async (data: Content) => {
    // Input validation
    if (!isNonEmpty(data.title)) throw new Error("Content title is required");
    if (!isNonEmpty(data.content_type)) throw new Error("Content type is required");
    if (!CONTENT_TYPES.includes(data.content_type)) throw new Error(`Invalid content type. Must be one of: ${CONTENT_TYPES.join(', ')}`);
    if (!isNonEmpty(data.status)) throw new Error("Content status is required");
    if (!CONTENT_STATUSES.includes(data.status)) throw new Error(`Invalid status. Must be one of: ${CONTENT_STATUSES.join(', ')}`);
    
    const docRef = doc(db, "contents", data.id);
    const { id, ...updateData } = sanitizeData(data);
    await updateDoc(docRef, { ...updateData, updated_at: now() });
    return { ...data, updated_at: now() };
  },
  delete: async (id: string) => {
    if (!isNonEmpty(id)) throw new Error("Invalid document ID");
    await deleteDoc(doc(db, "contents", id));
  },
};

// Deliverable API
const DELIVERABLE_STATUSES = ['Pending', 'In Progress', 'Review', 'Completed', 'Cancelled'];

export const deliverableApi = {
  collection: collection(db, "deliverables"),
  create: async (data: Omit<Deliverable, "id" | "created_at" | "updated_at">) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Deliverable name is required");
    if (!isNonEmpty(data.client_id)) throw new Error("Client ID is required");
    if (!isNonEmpty(data.status)) throw new Error("Deliverable status is required");
    if (!DELIVERABLE_STATUSES.includes(data.status)) throw new Error(`Invalid status. Must be one of: ${DELIVERABLE_STATUSES.join(', ')}`);
    
    const sanitized = sanitizeData(data);
    const docRef = await addDoc(collection(db, "deliverables"), {
      ...sanitized,
      created_at: now(),
      updated_at: now()
    });
    return { id: docRef.id, ...sanitized, created_at: now(), updated_at: now() } as Deliverable;
  },
  update: async (data: Deliverable) => {
    // Input validation
    if (!isNonEmpty(data.name)) throw new Error("Deliverable name is required");
    if (!isNonEmpty(data.client_id)) throw new Error("Client ID is required");
    if (!isNonEmpty(data.status)) throw new Error("Deliverable status is required");
    if (!DELIVERABLE_STATUSES.includes(data.status)) throw new Error(`Invalid status. Must be one of: ${DELIVERABLE_STATUSES.join(', ')}`);
    
    const docRef = doc(db, "deliverables", data.id);
    const { id, ...updateData } = sanitizeData(data);
    await updateDoc(docRef, { ...updateData, updated_at: now() });
    return { ...data, updated_at: now() };
  },
  delete: async (id: string) => {
    if (!isNonEmpty(id)) throw new Error("Invalid document ID");
    await deleteDoc(doc(db, "deliverables", id));
  },
};
