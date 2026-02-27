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

export interface Activity {
  id: string;
  client_id: string;
  type: "note" | "email" | "call" | "meeting" | "deliverable" | "payment" | "other";
  description: string;
  created_at: string;
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
