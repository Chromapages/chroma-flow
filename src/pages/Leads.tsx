import { useLeads } from "../hooks/useLeads";
import { useState } from "react";

function Leads() {
  const { leads, loading, addLead, deleteLead } = useLeads();
  const [viewMode, setViewMode] = useState<"table" | "kanban">("kanban");
  const [showForm, setShowForm] = useState(false);
  const [newLead, setNewLead] = useState({
    name: "",
    email: "",
    phone: "",
    source: "",
    pipeline_stage: "new",
    value: 0
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newLead.name || !newLead.email) return;
    await addLead(newLead);
    setNewLead({ name: "", email: "", phone: "", source: "", pipeline_stage: "new", value: 0 });
    setShowForm(false);
  };

  const stages = ["new", "contacted", "qualified", "won", "lost"];

  const stageLabels: Record<string, string> = {
    new: "Incoming",
    contacted: "Contacted",
    qualified: "Qualified",
    won: "Conversion",
    lost: "Archived"
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-text-secondary mono uppercase tracking-widest text-xs">Syncing lead queue...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="page-title">Leads</h1>
          <div className="flex items-center gap-4 mt-2">
            <p className="text-xs text-text-secondary uppercase tracking-widest mono">
              {leads.length} Active Nodes
            </p>
            <div className="flex bg-border/20 p-1 rounded-sm">
              <button
                onClick={() => setViewMode("table")}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-all ${viewMode === 'table' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Table
              </button>
              <button
                onClick={() => setViewMode("kanban")}
                className={`px-3 py-1 text-[10px] uppercase tracking-widest font-bold transition-all ${viewMode === 'kanban' ? 'bg-white shadow-sm text-primary' : 'text-text-secondary hover:text-text-primary'}`}
              >
                Pipeline
              </button>
            </div>
          </div>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
        >
          {showForm ? "Cancel" : "+ New Lead"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleAdd} className="card bg-white p-8 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Lead Registration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Lead Name *</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={newLead.name}
                onChange={e => setNewLead({ ...newLead, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Email Address *</label>
              <input
                type="email"
                placeholder="john@example.com"
                value={newLead.email}
                onChange={e => setNewLead({ ...newLead, email: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Source</label>
              <input
                type="text"
                placeholder="Website / Referral"
                value={newLead.source}
                onChange={e => setNewLead({ ...newLead, source: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Pipeline Stage</label>
              <select
                value={newLead.pipeline_stage}
                onChange={e => setNewLead({ ...newLead, pipeline_stage: e.target.value })}
                className="form-select"
              >
                {stages.map(s => <option key={s} value={s}>{stageLabels[s]}</option>)}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Estimated Value ($)</label>
              <input
                type="number"
                placeholder="0.00"
                value={newLead.value}
                onChange={e => setNewLead({ ...newLead, value: Number(e.target.value) })}
                className="form-input mono"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="btn btn-primary">Save Lead</button>
          </div>
        </form>
      )}

      {leads.length === 0 ? (
        <div className="empty-state bg-white border border-border p-24">
          <p className="text-xl font-bold uppercase tracking-widest mb-4">Pipeline currently empty</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary font-bold uppercase text-xs tracking-widest hover:underline"
          >
            Initialize lead sequence
          </button>
        </div>
      ) : viewMode === "table" ? (
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th>Lead Identifier</th>
                <th>Source</th>
                <th>Stage</th>
                <th className="text-right">Valuation</th>
                <th className="text-right">Operation</th>
              </tr>
            </thead>
            <tbody>
              {leads.map(lead => (
                <tr key={lead.id}>
                  <td className="font-bold">
                    <div>{lead.name}</div>
                    <div className="text-[10px] text-text-secondary font-normal lowercase">{lead.email}</div>
                  </td>
                  <td className="text-text-secondary text-xs uppercase tracking-wide">{lead.source || "Organic"}</td>
                  <td>
                    <span className="badge badge-active">{lead.pipeline_stage}</span>
                  </td>
                  <td className="text-right mono font-medium">
                    {lead.value ? `${lead.value.toLocaleString()}` : "0.00"}
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => deleteLead(lead.id)}
                      className="text-danger font-bold uppercase text-[10px] tracking-widest"
                    >
                      Archive
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        <div className="flex gap-6 overflow-x-auto pb-6 scrollbar-hide">
          {stages.map(stage => {
            const stageLeads = leads.filter(l => l.pipeline_stage === stage);
            return (
              <div key={stage} className="flex-1 min-w-[280px] space-y-4">
                <header className="flex justify-between items-center border-b-2 border-border pb-2 mb-4">
                  <h3 className="text-[11px] font-black uppercase tracking-[0.2em] text-text-primary">
                    {stageLabels[stage]}
                  </h3>
                  <span className="mono text-[10px] bg-border/30 px-1.5 py-0.5 rounded-sm">{stageLeads.length}</span>
                </header>
                <div className="space-y-3">
                  {stageLeads.map(lead => (
                    <div key={lead.id} className="card bg-white p-4 shadow-sm group hover:border-primary transition-colors cursor-pointer relative overflow-hidden">
                      <div className="absolute left-0 top-0 bottom-0 w-1 bg-border group-hover:bg-primary transition-colors" />
                      <div className="flex justify-between items-start mb-2">
                        <span className="text-[10px] uppercase font-bold tracking-widest text-text-secondary"># {lead.id.slice(-4)}</span>
                        <span className="mono text-[11px] font-bold text-primary">${lead.value?.toLocaleString() || '0'}</span>
                      </div>
                      <h4 className="font-bold text-sm mb-1">{lead.name}</h4>
                      <p className="text-[10px] text-text-secondary uppercase tracking-wider">{lead.source || "Direct Node"}</p>
                    </div>
                  ))}
                  {stageLeads.length === 0 && (
                    <div className="border-2 border-dashed border-border/50 rounded-sm py-12 text-center">
                      <p className="text-[10px] uppercase tracking-widest text-text-secondary italic">Void</p>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default Leads;
