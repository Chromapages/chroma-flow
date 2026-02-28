import { cn } from "@/lib/utils"

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: "default" | "secondary" | "outline" | "destructive"
}

export function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors",
        variant === "default" && "bg-blue-600 text-white",
        variant === "secondary" && "bg-slate-100 text-slate-900",
        variant === "outline" && "border border-slate-200 text-slate-900",
        variant === "destructive" && "bg-red-600 text-white",
        className
      )}
      {...props}
    />
  )
}
