import { useDeliverables } from "../hooks/useDeliverables";
import { useClients } from "../hooks/useClients";
import { useCampaigns } from "../hooks/useCampaigns";
import { useState } from "react";

function Deliverables() {
  const { deliverables, loading, addDeliverable, deleteDeliverable } = useDeliverables();
  const { clients } = useClients();
  const { campaigns } = useCampaigns();
  const [showForm, setShowForm] = useState(false);
  const [newDeliverable, setNewDeliverable] = useState({
    name: "",
    description: "",
    client_id: "",
    campaign_id: "",
    due_date: "",
    status: "pending"
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newDeliverable.name || !newDeliverable.client_id) return;
    await addDeliverable({
      name: newDeliverable.name,
      description: newDeliverable.description || undefined,
      client_id: newDeliverable.client_id,
      campaign_id: newDeliverable.campaign_id || undefined,
      due_date: newDeliverable.due_date || undefined,
      status: newDeliverable.status
    });
    setNewDeliverable({
      name: "",
      description: "",
      client_id: "",
      campaign_id: "",
      due_date: "",
      status: "pending"
    });
    setShowForm(false);
  };

  const getClientName = (clientId: string) => {
    const client = clients.find(c => c.id === clientId);
    return client?.name || "Unknown";
  };

  const getCampaignName = (campaignId?: string) => {
    if (!campaignId) return "—";
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.name || "—";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-[#6B7280]">Loading deliverables...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="page-title">Deliverables</h1>
          <p className="text-xs text-text-secondary mt-2 uppercase tracking-widest mono">
            {deliverables.length} Committed Results
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
        >
          {showForm ? "Cancel" : "+ New Deliverable"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleAdd} className="card bg-white p-8 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Deliverable Parameterization</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Deliverable Identifier *</label>
              <input
                type="text"
                placeholder="e.g. Final Brand Guidelines"
                value={newDeliverable.name}
                onChange={e => setNewDeliverable({ ...newDeliverable, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Client Affiliation *</label>
              <select
                value={newDeliverable.client_id}
                onChange={e => setNewDeliverable({ ...newDeliverable, client_id: e.target.value })}
                className="form-select"
                required
              >
                <option value="">Void</option>
                {clients.map(client => (
                  <option key={client.id} value={client.id}>{client.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Campaign Directive</label>
              <select
                value={newDeliverable.campaign_id}
                onChange={e => setNewDeliverable({ ...newDeliverable, campaign_id: e.target.value })}
                className="form-select"
              >
                <option value="">Void</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">State Vector</label>
              <select
                value={newDeliverable.status}
                onChange={e => setNewDeliverable({ ...newDeliverable, status: e.target.value })}
                className="form-select"
              >
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
                <option value="overdue">Overdue</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Temporal Bound (Due)</label>
              <input
                type="date"
                value={newDeliverable.due_date}
                onChange={e => setNewDeliverable({ ...newDeliverable, due_date: e.target.value })}
                className="form-input mono"
              />
            </div>
            <div className="space-y-2 lg:col-span-3">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Scope of Work (Description)</label>
              <textarea
                placeholder="Detail technical requirements..."
                value={newDeliverable.description}
                onChange={e => setNewDeliverable({ ...newDeliverable, description: e.target.value })}
                className="form-textarea"
                rows={3}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="btn btn-primary">Archive Deliverable</button>
          </div>
        </form>
      )}

      {deliverables.length === 0 ? (
        <div className="empty-state bg-white border border-border p-24">
          <p className="text-xl font-bold uppercase tracking-widest mb-4">No results committed to stack</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary font-bold uppercase text-xs tracking-widest hover:underline"
          >
            Create first deliverable
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th>Result Identifier</th>
                <th>Client / Directive</th>
                <th>Temporal Bound</th>
                <th>State Vector</th>
                <th className="text-right">Operation</th>
              </tr>
            </thead>
            <tbody>
              {deliverables.map(item => (
                <tr key={item.id}>
                  <td className="font-bold">
                    <div>{item.name}</div>
                    {item.description && (
                      <div className="text-[10px] text-text-secondary font-normal uppercase tracking-wider truncate max-w-xs">{item.description}</div>
                    )}
                  </td>
                  <td className="text-text-secondary text-xs">
                    <div className="uppercase tracking-widest">{getClientName(item.client_id)}</div>
                    <div className="text-[10px] italic">{getCampaignName(item.campaign_id)}</div>
                  </td>
                  <td className="mono text-[10px] text-primary font-bold">
                    {item.due_date || "UNDEFINED"}
                  </td>
                  <td>
                    <span className="badge badge-active">{item.status.replace("_", " ")}</span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => deleteDeliverable(item.id)}
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
      )}
    </div>
  );
}

export default Deliverables;
