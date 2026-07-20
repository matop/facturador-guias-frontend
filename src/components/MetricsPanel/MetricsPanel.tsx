import { useEffect, useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { fetchMetricas } from '@/services/api'
import { usePeriodoStore } from '@/store/periodoStore'
import type { MetricasResumen } from '@/types'

interface MetricCard {
  label: string
  value: string | number
  subtitle: string
}

function fmtMonto(n: number): string {
  return '$' + (n / 1_000_000).toFixed(1).replace('.', ',') + 'M'
}

export function MetricsPanel() {
  const [metricas, setMetricas] = useState<MetricasResumen | null>(null)
  const [loading, setLoading] = useState(true)
  const periodo = usePeriodoStore((s) => s.periodo)

  useEffect(() => {
    setLoading(true)
    fetchMetricas()
      .then((data: MetricasResumen) => {
        setMetricas(data)
        setLoading(false)
      })
  }, [periodo])

  if (loading || !metricas) {
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

  const cards: MetricCard[] = [
    {
      label: 'Total guías pendientes',
      value: metricas.totalGuias,
      subtitle: 'en todos los clientes activos',
    },
    {
      label: 'Clientes involucrados',
      value: metricas.clientesActivos,
      subtitle: periodo === 'anterior'
        ? 'período anterior activo'
        : metricas.clientesConRezagadas > 0
          ? `${metricas.clientesConRezagadas} con rezagadas del mes anterior`
          : 'sin rezagadas del mes anterior',
    },
    {
      label: 'Estimación a facturar',
      value: fmtMonto(metricas.montoEstimado),
      subtitle: `~${metricas.factEst} facturas proyectadas`,
    },
  ]

  return (
    <div className="grid grid-cols-3 gap-4">
      {cards.map((card) => (
        <Card key={card.label}>
          <CardContent className="p-4">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className="text-2xl font-bold text-foreground">{card.value}</p>
            <p className="mt-1 text-sm text-muted-foreground">{card.subtitle}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
