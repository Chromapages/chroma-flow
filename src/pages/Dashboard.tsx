import { useClients } from "../hooks/useClients";
import { useLeads } from "../hooks/useLeads";
import { useCampaigns } from "../hooks/useCampaigns";
import { useContent } from "../hooks/useContent";

function Dashboard() {
  const { clients, loading: clientsLoading } = useClients();
  const { leads, loading: leadsLoading } = useLeads();
  const { campaigns, loading: campaignsLoading } = useCampaigns();
  const { contents, loading: contentLoading } = useContent();

  const activeCampaigns = campaigns.filter((c) => c.status === "active");
  const totalBudget = campaigns.reduce<number>((sum, c) => sum + (c.budget || 0), 0);
  const totalSpent = campaigns.reduce<number>((sum, c) => sum + (c.spent || 0), 0);
  const totalConversions = campaigns.reduce<number>((sum, c) => sum + (c.conversions || 0), 0);
  
  // Lead funnel stages
  const leadsByStage = {
    new: leads.filter((l) => l.pipeline_stage === 'New').length,
    contacted: leads.filter((l) => l.pipeline_stage === 'Contacted').length,
    qualified: leads.filter((l) => l.pipeline_stage === 'Qualified').length,
    proposal: leads.filter((l) => l.pipeline_stage === 'Proposal').length,
    won: leads.filter((l) => l.pipeline_stage === 'Won').length,
    lost: leads.filter((l) => l.pipeline_stage === 'Lost').length,
  };
  
  // Content by status
  const contentByStatus = {
    draft: contents.filter((c) => c.status === 'Draft').length,
    review: contents.filter((c) => c.status === 'Review').length,
    approved: contents.filter((c) => c.status === 'Approved').length,
    published: contents.filter((c) => c.status === 'Published').length,
  };

  const loading = clientsLoading || leadsLoading || campaignsLoading || contentLoading;

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
          {/* Key Metrics Row */}
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
              <p className="stat-value">{activeCampaigns.length}</p>
            </div>
            <div className="stat-card">
              <h3 className="stat-label">Published Content</h3>
              <p className="stat-value">{contentByStatus.published}</p>
            </div>
          </div>
          
          {/* Financial Metrics Row */}
          <div className="stats-grid mt-6">
            <div className="stat-card bg-gradient-to-br from-cobalt/10 to-primary/10">
              <h3 className="stat-label">Total Budget</h3>
              <p className="stat-value">${totalBudget.toLocaleString()}</p>
            </div>
            <div className="stat-card bg-gradient-to-br from-cobalt/10 to-primary/10">
              <h3 className="stat-label">Total Spent</h3>
              <p className="stat-value">${totalSpent.toLocaleString()}</p>
            </div>
            <div className="stat-card bg-gradient-to-br from-green-500/10 to-emerald-500/10">
              <h3 className="stat-label">Conversions</h3>
              <p className="stat-value">{totalConversions}</p>
            </div>
            <div className="stat-card bg-gradient-to-br from-purple-500/10 to-pink-500/10">
              <h3 className="stat-label">Budget Used</h3>
              <p className="stat-value">{totalBudget > 0 ? Math.round((totalSpent / totalBudget) * 100) : 0}%</p>
            </div>
          </div>
        </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        {/* Lead Funnel */}
        <section>
          <h2 className="text-[10px] font-bold text-text-primary mb-6 uppercase tracking-[0.15em] border-l-2 border-primary pl-3">Lead Pipeline</h2>
          <div className="table-container">
            <div className="space-y-3">
              {Object.entries(leadsByStage).map(([stage, count]) => (
                <div key={stage} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs uppercase tracking-wider text-text-secondary">{stage}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-primary rounded-full" 
                        style={{ width: `${leads.length > 0 ? (count / leads.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="mono text-sm font-bold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Content Pipeline */}
        <section>
          <h2 className="text-[10px] font-bold text-text-primary mb-6 uppercase tracking-[0.15em] border-l-2 border-primary pl-3">Content Pipeline</h2>
          <div className="table-container">
            <div className="space-y-3">
              {Object.entries(contentByStatus).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between py-2 border-b border-border/50 last:border-0">
                  <span className="text-xs uppercase tracking-wider text-text-secondary">{status}</span>
                  <div className="flex items-center gap-3">
                    <div className="w-24 h-2 bg-white/10 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${
                          status === 'published' ? 'bg-green-500' : 
                          status === 'approved' ? 'bg-blue-500' : 
                          status === 'review' ? 'bg-yellow-500' : 'bg-gray-500'
                        }`}
                        style={{ width: `${contents.length > 0 ? (count / contents.length) * 100 : 0}%` }}
                      />
                    </div>
                    <span className="mono text-sm font-bold">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>

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
