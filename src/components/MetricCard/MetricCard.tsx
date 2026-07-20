import type { ReactNode } from 'react'

interface MetricCardProps {
  icon: ReactNode
  label: string
  value: string | number
  subtitle: string
  accentColor?: string
  testId?: string
}

export function MetricCard({
  icon,
  label,
  value,
  subtitle,
  accentColor = 'var(--primary)',
  testId,
}: MetricCardProps) {
  return (
    <div
      data-testid={testId}
      className="bg-card border border-border rounded-xl p-4 relative overflow-hidden"
    >
      <div className="absolute top-0 left-0 right-0 h-[3px]" style={{ backgroundColor: accentColor }} />
      <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground mb-2 flex items-center gap-1.5">
        {icon}
        {label}
      </p>
      <p className="text-2xl font-medium text-foreground font-mono leading-none">{value}</p>
      <p className="text-xs text-muted-foreground mt-1 truncate">{subtitle}</p>
    </div>
  )
}
