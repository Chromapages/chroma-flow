import { useClients } from "../hooks/useClients";
import { useActivities } from "../hooks/useActivities";
import { useState } from "react";
import { Client } from "../types";

function Clients() {
  const { clients, loading, addClient, deleteClient } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", company: "", status: "active" });
  const [newNote, setNewNote] = useState("");

  const { activities, addActivity } = useActivities(selectedClient?.id);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return;
    await addClient(newClient);
    setNewClient({ name: "", email: "", phone: "", company: "", status: "active" });
    setShowForm(false);
  };

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClient || !newNote.trim()) return;
    await addActivity({
      client_id: selectedClient.id,
      type: "note",
      description: newNote.trim(),
    });
    setNewNote("");
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "note": return "📝";
      case "email": return "📧";
      case "call": return "📞";
      case "meeting": return "📅";
      case "deliverable": return "📦";
      case "payment": return "💰";
      default: return "🔹";
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { 
      month: "short", 
      day: "numeric", 
      hour: "2-digit", 
      minute: "2-digit" 
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-[#6B7280]">Loading clients...</div>
      </div>
    );
  }

  // Client Detail View
  if (selectedClient) {
    return (
      <div className="space-y-6">
        <header className="flex justify-between items-end border-b border-border pb-6">
          <div>
            <button 
              onClick={() => setSelectedClient(null)}
              className="text-xs text-text-secondary uppercase tracking-widest hover:text-primary mb-2"
            >
              ← Back to Clients
            </button>
            <h1 className="page-title">{selectedClient.name}</h1>
            <p className="text-xs text-text-secondary mt-2">{selectedClient.email}</p>
          </div>
          <span className={`badge ${selectedClient.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
            {selectedClient.status}
          </span>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Client Info */}
          <div className="card bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-border pb-2">Client Details</h3>
            <div className="space-y-4">
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-secondary block">Company</label>
                <p className="font-medium">{selectedClient.company || "—"}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-secondary block">Phone</label>
                <p className="font-medium">{selectedClient.phone || "—"}</p>
              </div>
              <div>
                <label className="text-[10px] uppercase tracking-widest text-text-secondary block">Added</label>
                <p className="font-medium">{formatDate(selectedClient.created_at)}</p>
              </div>
            </div>
          </div>

          {/* Activity Feed */}
          <div className="lg:col-span-2 card bg-white p-6">
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4 border-b border-border pb-2">Activity Log</h3>
            
            {/* Add Note Form */}
            <form onSubmit={handleAddNote} className="mb-6">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add a note..."
                  value={newNote}
                  onChange={e => setNewNote(e.target.value)}
                  className="form-input flex-1"
                />
                <button type="submit" className="btn btn-primary">Add</button>
              </div>
            </form>

            {/* Activity List */}
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {activities.length === 0 ? (
                <p className="text-text-secondary text-sm py-4">No activity recorded yet.</p>
              ) : (
                activities.map(activity => (
                  <div key={activity.id} className="flex gap-3 pb-3 border-b border-border last:border-0">
                    <span className="text-lg">{getActivityIcon(activity.type)}</span>
                    <div className="flex-1">
                      <p className="text-sm">{activity.description}</p>
                      <p className="text-[10px] text-text-secondary uppercase tracking-widest mt-1">
                        {activity.type} • {formatDate(activity.created_at)}
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Client List View
  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="page-title">Clients</h1>
          <p className="text-xs text-text-secondary mt-2 uppercase tracking-widest mono">
            {clients.length} Identified Nodes
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
        >
          {showForm ? "Cancel" : "+ New Client"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleAdd} className="card bg-white p-8 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Client Registration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Full Name *</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={newClient.name}
                onChange={e => setNewClient({ ...newClient, name: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Email Address *</label>
              <input
                type="email"
                placeholder="e.g. contact@acme.com"
                value={newClient.email}
                onChange={e => setNewClient({ ...newClient, email: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Phone Number</label>
              <input
                type="tel"
                placeholder="+1 (555) 000-0000"
                value={newClient.phone}
                onChange={e => setNewClient({ ...newClient, phone: e.target.value })}
                className="form-input"
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Company Name</label>
              <input
                type="text"
                placeholder="Acme Industries"
                value={newClient.company}
                onChange={e => setNewClient({ ...newClient, company: e.target.value })}
                className="form-input"
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="btn btn-primary">Save Node</button>
          </div>
        </form>
      )}

      {clients.length === 0 ? (
        <div className="empty-state bg-white border border-border p-24">
          <p className="text-xl font-bold uppercase tracking-widest mb-4">No metadata clusters found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary font-bold uppercase text-xs tracking-widest hover:underline"
          >
            Initialize client sequence
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th>Identifier</th>
                <th>Electronic Mail</th>
                <th>Organizational Unit</th>
                <th>Status</th>
                <th className="text-right">Operation</th>
              </tr>
            </thead>
            <tbody>
              {clients.map(client => (
                <tr key={client.id}>
                  <td className="font-bold">
                    <button 
                      onClick={() => setSelectedClient(client)}
                      className="text-primary hover:underline"
                    >
                      {client.name}
                    </button>
                  </td>
                  <td className="text-text-secondary">{client.email}</td>
                  <td className="text-text-secondary">{client.company || "—"}</td>
                  <td>
                    <span className={`badge ${client.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                      {client.status}
                    </span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => deleteClient(client.id)}
                      className="text-danger font-bold uppercase text-[10px] tracking-widest hover:opacity-70 transition-opacity"
                    >
                      Delete
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

export default Clients;
