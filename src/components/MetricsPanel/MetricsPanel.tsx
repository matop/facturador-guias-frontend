import { type ReactNode } from 'react'
import { useQuery } from '@tanstack/react-query'
import { FileText, Users, Receipt } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { MetricCard } from '@/components/MetricCard'
import { fetchMetricas } from '@/services/api'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import { queryKeys } from '@/lib/queryKeys'

interface MetricCardData {
  label: string
  value: string | number
  subtitle: string
  icon: ReactNode
}

function fmtMonto(n: number): string {
  return '$' + (n / 1_000_000).toFixed(1).replace('.', ',') + 'M'
}

export function MetricsPanel() {
  const periodo = usePeriodoStore((s) => s.periodo)
  const tenantId = useTenantStore((s) => s.tenantId)

  const { data: metricas, isLoading } = useQuery({
    queryKey: queryKeys.metricas(tenantId, periodo),
    queryFn: fetchMetricas,
  })

  if (isLoading || !metricas) {
    return (
      <div role="status" className="grid grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Card key={i}>
            <CardContent className="p-4">
              <div className="h-24 animate-pulse rounded bg-muted" />
            </CardContent>
          </Card>
        ))}
      </div>
    )
  }

  const cards: MetricCardData[] = [
    {
      label: 'Total guías pendientes',
      value: metricas.totalGuias,
      subtitle: 'en todos los clientes activos',
      icon: <FileText className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      label: 'Clientes involucrados',
      value: metricas.clientesActivos,
      subtitle: periodo === 'anterior'
        ? 'período anterior activo'
        : metricas.clientesConRezagadas > 0
          ? `${metricas.clientesConRezagadas} con rezagadas del mes anterior`
          : 'sin rezagadas del mes anterior',
      icon: <Users className="w-3.5 h-3.5" aria-hidden="true" />,
    },
    {
      label: 'Estimación a facturar',
      value: fmtMonto(metricas.montoEstimado),
      subtitle: `~${metricas.factEst} facturas proyectadas`,
      icon: <Receipt className="w-3.5 h-3.5" aria-hidden="true" />,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <MetricCard
          key={card.label}
          icon={card.icon}
          label={card.label}
          value={card.value}
          subtitle={card.subtitle}
        />
      ))}
    </div>
  )
}
