import { useContent } from "../hooks/useContent";
import { useClients } from "../hooks/useClients";
import { useCampaigns } from "../hooks/useCampaigns";
import { useState } from "react";

function Content() {
  const { contents, loading, addContent, deleteContent } = useContent();
  const { clients } = useClients();
  const { campaigns } = useCampaigns();
  const [showForm, setShowForm] = useState(false);
  const [newContent, setNewContent] = useState({
    title: "",
    content_type: "blog",
    status: "draft",
    content_body: "",
    client_id: "",
    campaign_id: ""
  });

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newContent.title) return;
    await addContent({
      title: newContent.title,
      content_type: newContent.content_type,
      status: newContent.status,
      content_body: newContent.content_body || undefined,
      client_id: newContent.client_id || undefined,
      campaign_id: newContent.campaign_id || undefined
    });
    setNewContent({
      title: "",
      content_type: "blog",
      status: "draft",
      content_body: "",
      client_id: "",
      campaign_id: ""
    });
    setShowForm(false);
  };

  const getClientName = (clientId?: string) => {
    if (!clientId) return "—";
    const client = clients.find(c => c.id === clientId);
    return client?.name || "—";
  };

  const getCampaignName = (campaignId?: string) => {
    if (!campaignId) return "—";
    const campaign = campaigns.find(c => c.id === campaignId);
    return campaign?.name || "—";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-48">
        <div className="text-[#6B7280]">Loading content...</div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header className="flex justify-between items-end border-b border-border pb-8">
        <div>
          <h1 className="page-title">Content</h1>
          <p className="text-xs text-text-secondary mt-2 uppercase tracking-widest mono">
            {contents.length} Digital Artifacts
          </p>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className={`btn ${showForm ? "btn-secondary" : "btn-primary"}`}
        >
          {showForm ? "Cancel" : "+ New Artifact"}
        </button>
      </header>

      {showForm && (
        <form onSubmit={handleAdd} className="card bg-white p-8 mb-12">
          <h3 className="text-xs font-bold uppercase tracking-widest mb-6 border-b border-border pb-2 inline-block">Artifact Specification</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="space-y-2 lg:col-span-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Artifact Title *</label>
              <input
                type="text"
                placeholder="e.g. Strategic Analysis of Market Trends"
                value={newContent.title}
                onChange={e => setNewContent({ ...newContent, title: e.target.value })}
                className="form-input"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Category</label>
              <select
                value={newContent.content_type}
                onChange={e => setNewContent({ ...newContent, content_type: e.target.value })}
                className="form-select"
              >
                <option value="blog">Blog</option>
                <option value="social">Social Media</option>
                <option value="email">Email</option>
                <option value="ad">Ad Copy</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">State</label>
              <select
                value={newContent.status}
                onChange={e => setNewContent({ ...newContent, status: e.target.value })}
                className="form-select"
              >
                <option value="draft">Draft</option>
                <option value="review">In Review</option>
                <option value="published">Published</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Client Affiliation</label>
              <select
                value={newContent.client_id}
                onChange={e => setNewContent({ ...newContent, client_id: e.target.value })}
                className="form-select"
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
                value={newContent.campaign_id}
                onChange={e => setNewContent({ ...newContent, campaign_id: e.target.value })}
                className="form-select"
              >
                <option value="">Void</option>
                {campaigns.map(campaign => (
                  <option key={campaign.id} value={campaign.id}>{campaign.name}</option>
                ))}
              </select>
            </div>
            <div className="space-y-2 lg:col-span-3">
              <label className="text-[10px] uppercase tracking-widest text-text-secondary font-bold">Artifact Payload (Body)</label>
              <textarea
                placeholder="Enter core content payload..."
                value={newContent.content_body}
                onChange={e => setNewContent({ ...newContent, content_body: e.target.value })}
                className="form-textarea"
                rows={5}
              />
            </div>
          </div>
          <div className="mt-8 flex justify-end">
            <button type="submit" className="btn btn-primary">Commit Artifact</button>
          </div>
        </form>
      )}

      {contents.length === 0 ? (
        <div className="empty-state bg-white border border-border p-24">
          <p className="text-xl font-bold uppercase tracking-widest mb-4">No digital artifacts found</p>
          <button
            onClick={() => setShowForm(true)}
            className="text-primary font-bold uppercase text-xs tracking-widest hover:underline"
          >
            Create first artifact
          </button>
        </div>
      ) : (
        <div className="table-container">
          <table className="w-full">
            <thead>
              <tr>
                <th>Artifact Identifier</th>
                <th>Category</th>
                <th>Client / Directive</th>
                <th>State</th>
                <th className="text-right">Operation</th>
              </tr>
            </thead>
            <tbody>
              {contents.map(item => (
                <tr key={item.id}>
                  <td className="font-bold">
                    <div>{item.title}</div>
                  </td>
                  <td>
                    <span className="mono text-[10px] uppercase tracking-widest border border-border px-1.5 py-0.5">{item.content_type}</span>
                  </td>
                  <td className="text-text-secondary text-xs">
                    <div className="uppercase tracking-widest">{getClientName(item.client_id)}</div>
                    <div className="text-[10px] italic">{getCampaignName(item.campaign_id)}</div>
                  </td>
                  <td>
                    <span className="badge badge-active">{item.status}</span>
                  </td>
                  <td className="text-right">
                    <button
                      onClick={() => deleteContent(item.id)}
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

export default Content;
