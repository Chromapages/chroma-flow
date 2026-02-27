import { useAgentStatus, useModelSpend } from '../hooks/useAgents';
import { useCampaigns } from '../hooks/useCampaigns';

function MissionControl() {
  const { agents, loading: agentsLoading, error, isDemo } = useAgentStatus(5000);
  const { dailySpend, loading: spendLoading, isDemo: spendIsDemo } = useModelSpend();
  const { campaigns } = useCampaigns();

  const activeCampaigns = campaigns.filter(c => c.status === 'active');
  
  // Get active agents
  const activeAgents = Object.entries(agents).filter(
    ([, status]) => status.status !== 'idle'
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'thinking': return 'bg-purple-500';
      case 'working': return 'bg-green-500';
      case 'typing': return 'bg-blue-500';
      case 'waiting': return 'bg-yellow-500';
      default: return 'bg-gray-500';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'thinking': return '🧠';
      case 'working': return '⚙️';
      case 'typing': return '⌨️';
      case 'waiting': return '⏳';
      default: return '💤';
    }
  };

  return (
    <div className="space-y-16">
      <header className="flex justify-between items-end border-b border-border pb-12">
        <div>
          <p className="text-[10px] text-primary uppercase tracking-[0.2em] font-bold mb-4 mono">
            System Command // Mission Control
          </p>
          <h1 className="page-title">Mission Control</h1>
        </div>
        <div className="flex flex-col items-end gap-6">
          <p className="text-[10px] text-text-secondary uppercase tracking-widest mono">
            {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
          </p>
          <button className="btn btn-primary">+ Spawn Agent</button>
        </div>
      </header>

      {/* Demo Mode Banner */}
      {(isDemo || spendIsDemo) && (
        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 flex items-center gap-3">
          <span className="text-primary">🔧</span>
          <p className="text-sm text-primary">
            <span className="font-semibold">Demo Mode:</span> Showing simulated agent data. 
            Connect Pixel Office for live monitoring.
          </p>
        </div>
      )}

      {/* Agent Status Grid */}
      <section>
        <h2 className="text-[10px] font-bold text-text-primary mb-6 uppercase tracking-[0.15em] border-l-2 border-primary pl-3">
          Active Agents
        </h2>
        
        {agentsLoading ? (
          <div className="flex items-center justify-center h-32">
            <div className="text-text-secondary mono uppercase tracking-widest text-xs">Scanning agent nodes...</div>
          </div>
        ) : error ? (
          <div className="stat-card bg-yellow-500/10 border-yellow-500/30">
            <p className="text-yellow-500 mono text-xs uppercase">
              ⚠️ {error} — Start Pixel Office to monitor agents
            </p>
          </div>
        ) : Object.keys(agents).length === 0 ? (
          <div className="stat-card">
            <p className="text-text-secondary mono text-xs uppercase italic">
              No active agent sessions detected
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(agents).map(([agentId, status]) => (
              <div key={agentId} className="stat-card">
                <div className="flex items-center gap-3 mb-3">
                  <div className={`w-2 h-2 rounded-full ${getStatusColor(status.status)} animate-pulse`} />
                  <span className="font-mono text-xs text-text-secondary uppercase">{agentId}</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-xl">{getStatusIcon(status.status)}</span>
                  <span className="text-lg font-semibold capitalize">{status.status}</span>
                </div>
                <p className="text-sm text-text-secondary mt-1">{status.message}</p>
                <p className="text-[10px] text-text-secondary mono mt-2">
                  {new Date(status.timestamp).toLocaleTimeString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* Stats Grid */}
      <section>
        <div className="stats-grid">
          <div className="stat-card">
            <h3 className="stat-label">Active Tasks</h3>
            <p className="stat-value">{activeAgents.length}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-label">Daily Spend</h3>
            <p className="stat-value">
              {spendLoading ? '...' : `$${dailySpend.toFixed(2)}`}
            </p>
          </div>
          <div className="stat-card">
            <h3 className="stat-label">Active Campaigns</h3>
            <p className="stat-value">{activeCampaigns.length}</p>
          </div>
          <div className="stat-card">
            <h3 className="stat-label">Total Agents</h3>
            <p className="stat-value">{Object.keys(agents).length}</p>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section>
        <h2 className="text-[10px] font-bold text-text-primary mb-6 uppercase tracking-[0.15em] border-l-2 border-primary pl-3">
          Quick Actions
        </h2>
        <div className="flex flex-wrap gap-4">
          <button className="btn btn-secondary">📊 Run Analytics</button>
          <button className="btn btn-secondary">📝 Generate Brief</button>
          <button className="btn btn-secondary">🤖 Spawn Research Agent</button>
          <button className="btn btn-secondary">📧 Send Updates</button>
        </div>
      </section>

      {/* Active Campaigns */}
      {activeCampaigns.length > 0 && (
        <section>
          <h2 className="text-[10px] font-bold text-text-primary mb-6 uppercase tracking-[0.15em] border-l-2 border-primary pl-3">
            Active Campaigns
          </h2>
          <div className="table-container">
            <table className="w-full">
              <thead>
                <tr>
                  <th>Campaign</th>
                  <th>Status</th>
                  <th>Channel</th>
                  <th className="text-right">Leads</th>
                </tr>
              </thead>
              <tbody>
                {activeCampaigns.slice(0, 5).map(campaign => (
                  <tr key={campaign.id}>
                    <td className="font-semibold">{campaign.name}</td>
                    <td>
                      <span className="badge badge-active">{campaign.status}</span>
                    </td>
                    <td className="text-text-secondary">—</td>
                    <td className="text-right mono text-xs">—</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}
    </div>
  );
}

export default MissionControl;
