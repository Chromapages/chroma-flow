import { Campaign } from "../types";
import { BudgetProgressBar } from "./BudgetProgressBar";

interface CampaignCardProps {
  campaign: Campaign;
  clientName: string;
  onClick?: () => void;
}

const statusConfig: Record<string, { bg: string; text: string; label: string }> = {
  active: { bg: "bg-green-100", text: "text-green-700", label: "Active" },
  planning: { bg: "bg-gray-100", text: "text-gray-600", label: "Draft" },
  paused: { bg: "bg-orange-100", text: "text-orange-700", label: "Paused" },
  completed: { bg: "bg-gray-100", text: "text-gray-500", label: "Completed" },
};

function formatDateRange(start?: string, end?: string) {
  if (!start && !end) return "No dates set";
  return `${start || "—"} → ${end || "—"}`;
}

export function CampaignCard({ campaign, clientName, onClick }: CampaignCardProps) {
  const status = statusConfig[campaign.status] || statusConfig.planning;
  const spent = campaign.spent || 0;
  const budget = campaign.budget || 0;

  return (
    <div 
      onClick={onClick}
      className="bg-white border border-border p-6 cursor-pointer hover:border-cobalt/30 transition-colors group"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex-1 min-w-0">
          <h3 className="font-bold text-lg text-text-primary leading-tight truncate group-hover:text-cobalt transition-colors">
            {campaign.name}
          </h3>
          {clientName && clientName !== "—" && (
            <p className="text-xs text-text-secondary uppercase tracking-wider mt-1">{clientName}</p>
          )}
        </div>
        <span className={`ml-3 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider rounded-full ${status.bg} ${status.text}`}>
          {status.label}
        </span>
      </div>

      <div className="text-[10px] text-text-secondary uppercase tracking-widest mb-4 font-mono">
        {formatDateRange(campaign.start_date, campaign.end_date)}
      </div>

      <BudgetProgressBar spent={spent} budget={budget} />

      <div className="mt-4 pt-4 border-t border-border grid grid-cols-3 gap-2">
        <div>
          <p className="text-[9px] text-text-secondary uppercase tracking-widest mb-0.5">Conversions</p>
          <p className="font-mono font-bold text-text-primary">{campaign.conversions ?? "—"}</p>
        </div>
        <div>
          <p className="text-[9px] text-text-secondary uppercase tracking-widest mb-0.5">CPA</p>
          <p className="font-mono font-bold text-text-primary">
            {campaign.cpa ? `$${campaign.cpa.toFixed(2)}` : "—"}
          </p>
        </div>
        <div>
          <p className="text-[9px] text-text-secondary uppercase tracking-widest mb-0.5">ROI</p>
          <p className={`font-mono font-bold ${campaign.roi && campaign.roi > 0 ? "text-green-600" : "text-text-primary"}`}>
            {campaign.roi ? `${campaign.roi.toFixed(1)}%` : "—"}
          </p>
        </div>
      </div>
    </div>
  );
}
