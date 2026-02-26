import { useClients } from "../hooks/useClients";
import { useLeads } from "../hooks/useLeads";
import { useCampaigns } from "../hooks/useCampaigns";

function Dashboard() {
  const { clients, loading: clientsLoading } = useClients();
  const { leads, loading: leadsLoading } = useLeads();
  const { campaigns, loading: campaignsLoading } = useCampaigns();

  const activeCampaigns = campaigns.filter(c => c.status === "active").length;
  const loading = clientsLoading || leadsLoading || campaignsLoading;

  return (
    <div className="space-y-16">
      <header className="flex justify-between items-end border-b border-border pb-12">
        <div>
          <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold mb-4 mono">
            System Overview //
          </p>
          <h1 className="page-title">Dashboard</h1>
        </div>
        <div className="flex flex-col items-end gap-6">
          <p className="text-[10px] text-text-secondary uppercase tracking-widest mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <button className="btn btn-primary">+ New Client</button>
        </div>
      </header>

      {loading ? (
        <div className="flex items-center justify-center h-48">
          <div className="text-text-secondary mono uppercase tracking-widest text-xs">Loading sync nodes...</div>
        </div>
      ) : (
        <section>
          <div className="stats-grid">
            <div className="stat-card">
              <h3 className="stat-label">Total Clients</h3>
              <p className="stat-value">{clients.length}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-label">Total Leads</h3>
              <p className="stat-value">{leads.length}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-label">Active Campaigns</h3>
              <p className="stat-value">{activeCampaigns}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-label">Pending Units</h3>
              <p className="stat-value">12</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Recent Clients */}
        <section>
          <h2 className="text-[10px] font-bold text-text-primary mb-6 uppercase tracking-[0.15em] border-l-2 border-primary pl-3">Recent Clients</h2>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Status</th>
                  <th className="text-right">Activity</th>
                </tr>
              </thead>
              <tbody>
                {clients.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-text-secondary mono text-xs uppercase italic">No client nodes identified</td>
                  </tr>
                ) : (
                  clients.slice(0, 5).map(client => (
                    <tr key={client.id}>
                      <td className="font-semibold">{client.name}</td>
                      <td>
                        <span className={`badge ${client.status === 'active' ? 'badge-active' : 'badge-inactive'}`}>
                          {client.status}
                        </span>
                      </td>
                      <td className="text-right text-text-secondary mono text-xs">Today</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        {/* Recent Leads */}
        <section>
          <h2 className="text-[10px] font-bold text-text-primary mb-6 uppercase tracking-[0.15em] border-l-2 border-primary pl-3">Recent Leads</h2>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Lead</th>
                  <th>Pipeline</th>
                  <th className="text-right">Date</th>
                </tr>
              </thead>
              <tbody>
                {leads.length === 0 ? (
                  <tr>
                    <td colSpan={3} className="text-center py-12 text-text-secondary mono text-xs uppercase italic">No leads in queue</td>
                  </tr>
                ) : (
                  leads.slice(0, 5).map(lead => (
                    <tr key={lead.id}>
                      <td className="font-semibold">{lead.name}</td>
                      <td>
                        <span className={`badge badge-active`}>
                          {lead.pipeline_stage}
                        </span>
                      </td>
                      <td className="text-right text-text-secondary mono text-xs">Feb 24</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Dashboard;
