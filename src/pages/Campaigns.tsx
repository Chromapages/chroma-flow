import { useCampaigns } from "../hooks/useCampaigns";
import { useClients } from "../hooks/useClients";
import { useState } from "react";
import { CampaignCard } from "../components/CampaignCard";

type TabType = "all" | "planning" | "active" | "paused" | "completed";

const tabs: { key: TabType; label: string }[] = [
  { key: "all", label: "All" },
  { key: "planning", label: "Draft" },
  { key: "active", label: "Active" },
  { key: "paused", label: "Paused" },
  { key: "completed", label: "Completed" },
];

function Campaigns() {
  const { campaigns, loading, addCampaign, deleteCampaign } = useCampaigns();
  const { clients } = useClients();
  const [activeTab, setActiveTab] = useState<TabType>("all");
  const [showForm, setShowForm] = useState(false);
  const [newCampaign, setNewCampaign] = useState<{
    name: string;
    description: string;
    client_id: string;
    status: "planning" | "active" | "paused" | "completed";
    budget: number;
    spent: number;
    conversions: number;
    cpa: number;
    roi: number;
    ctr: number;
    conversion_rate: number;
    start_date: string;
    end_date: string;
  }>({
    name: "",
    description: "",
    client_id: "",
    status: "planning" as const,
    budget: 0,
    spent: 0,
    conversions: 0,
    cpa: 0,
    roi: 0,
    ctr: 0,
    conversion_rate: 0,
    start_date: "",
    end_date: ""
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.name) return;
    await addCampaign({
      name: newCampaign.name,
      description: newCampaign.description || undefined,
      client_id: newCampaign.client_id || undefined,
      status: newCampaign.status,
      budget: newCampaign.budget || undefined,
      spent: newCampaign.spent || undefined,
      conversions: newCampaign.conversions || undefined,
      cpa: newCampaign.cpa || undefined,
      roi: newCampaign.roi || undefined,
      ctr: newCampaign.ctr || undefined,
      conversion_rate: newCampaign.conversion_rate || undefined,
      start_date: newCampaign.start_date || undefined,
      end_date: newCampaign.end_date || undefined
    });
    setNewCampaign({
      name: "",
      description: "",
      client_id: "",
      status: "planning",
      budget: 0,
      spent: 0,
      conversions: 0,
      cpa: 0,
      roi: 0,
      ctr: 0,
      conversion_rate: 0,
      start_date: "",
      end_date: ""
    });
    setShowForm(false);
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return "—";
    const client = clients.find(c => c.id === clientId);
    return client?.name || "—";
  };

  const filteredCampaigns = activeTab === "all" 
    ? campaigns 
    : campaigns.filter(c => c.status === activeTab);

  const getCounts = () => ({
    all: campaigns.length,
    planning: campaigns.filter(c => c.status === "planning").length,
    active: campaigns.filter(c => c.status === "active").length,
    paused: campaigns.filter(c => c.status === "paused").length,
    completed: campaigns.filter(c => c.status === "completed").length,
  });

  const counts = getCounts();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-[#6B7280]">Loading campaigns...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-border pb-6">
        <div>
          <h1 className="page-title">Campaigns</h1>
          <p className="text-xs text-text-secondary mt-2 uppercase tracking-widest mono">
            {campaigns.length} Total Missions
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
        >
          {showForm ? "Cancel" : "Initialize Campaign"}
        </button>
      </header>

      <div className="flex gap-1 border-b border-border">
        {tabs.map(tab => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-3 text-[10px] font-bold uppercase tracking-widest transition-colors relative ${
              activeTab === tab.key 
                ? "text-cobalt" 
                : "text-text-secondary hover:text-text-primary"
            }`}
          >
            {tab.label}
            <span className={`ml-1.5 text-[9px] ${activeTab === tab.key ? "text-cobalt/60" : "text-text-secondary/60"}`}>
              {counts[tab.key]}
            </span>
            {activeTab === tab.key && (
              <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-cobalt" />
            )}
          </button>
        ))}
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="card bg-white p-8 mb-8">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Campaign Parameters</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Campaign Directive Name *</label>
              <input
                type="text"
                placeholder="e.g. Q4 Growth Initiative"
                value={newCampaign.name}
                onChange={e => setNewCampaign({ ...newCampaign, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Client Affiliation</label>
              <select
                value={newCampaign.client_id}
                onChange={e => setNewCampaign({ ...newCampaign, client_id: e.target.value })}
                className="form-select"
              >
                <option value="">Void</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Status Vector</label>
              <select
                value={newCampaign.status}
                onChange={e => setNewCampaign({ ...newCampaign, status: e.target.value as "planning" | "active" | "paused" | "completed" })}
                className="form-select"
              >
                <option value="planning">Planning</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Financial Allocation ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={newCampaign.budget}
                onChange={e => setNewCampaign({ ...newCampaign, budget: Number(e.target.value) })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Amount Spent ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={newCampaign.spent}
                onChange={e => setNewCampaign({ ...newCampaign, spent: Number(e.target.value) })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Conversions</label>
              <input
                type="number"
                placeholder="0"
                value={newCampaign.conversions}
                onChange={e => setNewCampaign({ ...newCampaign, conversions: Number(e.target.value) })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">CPA ($)</label>
              <input
                type="number"
                step="0.01"
                placeholder="0.00"
                value={newCampaign.cpa}
                onChange={e => setNewCampaign({ ...newCampaign, cpa: Number(e.target.value) })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">ROI (%)</label>
              <input
                type="number"
                step="0.1"
                placeholder="0.0"
                value={newCampaign.roi}
                onChange={e => setNewCampaign({ ...newCampaign, roi: Number(e.target.value) })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Temporal Bound (Start)</label>
              <input
                type="date"
                value={newCampaign.start_date}
                onChange={e => setNewCampaign({ ...newCampaign, start_date: e.target.value })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Temporal Bound (End)</label>
              <input
                type="date"
                value={newCampaign.end_date}
                onChange={e => setNewCampaign({ ...newCampaign, end_date: e.target.value })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2 lg:col-span-3">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Directive Metadata (Description)</label>
              <textarea
                placeholder="Enter core campaign objective..."
                value={newCampaign.description}
                onChange={e => setNewCampaign({ ...newCampaign, description: e.target.value })}
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="btn btn-primary">Save Directive</button>
          </div>
        </form>
      )}

      {filteredCampaigns.length === 0 ? (
        <div className="empty-state bg-white border border-border p-24">
          <p className="text-xl font-bold uppercase tracking-widest mb-4">No campaigns found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary font-bold uppercase text-xs tracking-widest hover:underline"
          >
            Create first campaign node
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCampaigns.map(campaign => (
            <CampaignCard
              key={campaign.id}
              campaign={campaign}
              clientName={getClientName(campaign.client_id)}
              onClick={() => deleteCampaign(campaign.id)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Campaigns;
