import { useClients } from "../hooks/useClients";
import { useState } from "react";

function Clients() {
  const { clients, loading, addClient, deleteClient } = useClients();
  const [showForm, setShowForm] = useState(false);
  const [newClient, setNewClient] = useState({ name: "", email: "", phone: "", company: "", status: "active" });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newClient.name || !newClient.email) return;
    await addClient(newClient);
    setNewClient({ name: "", email: "", phone: "", company: "", status: "active" });
    setShowForm(false);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-[#6B7280]">Loading clients...</div>
      </div>
    );
  }

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
                  <td className="font-bold">{client.name}</td>
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
