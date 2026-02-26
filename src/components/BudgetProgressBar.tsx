interface BudgetProgressBarProps {
  spent: number;
  budget: number;
}

export function BudgetProgressBar({ spent, budget }: BudgetProgressBarProps) {
  const percentage = budget > 0 ? Math.min((spent / budget) * 100, 100) : 0;
  const isOverBudget = spent > budget;
  const isWarning = percentage > 80;

  const getBarColor = () => {
    if (isOverBudget) return "bg-red-500";
    if (isWarning) return "bg-amber-500";
    return "bg-cobalt";
  };

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center text-[10px] uppercase tracking-widest">
        <span className="text-text-secondary font-medium">Budget Velocity</span>
        <span className={`font-mono font-medium ${isOverBudget ? "text-red-500" : "text-text-primary"}`}>
          ${spent.toLocaleString()} / ${budget.toLocaleString()}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${getBarColor()}`}
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
