import { Settings2 } from 'lucide-react'
import type { Cliente } from '@/types'
import { Button } from '@/components/ui/button'

const clpFormatter = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
})

interface ClientesGridProps {
  clientes: Cliente[]
  loading: boolean
  onVerGuias: (id: string) => void
  onFacturar: (id: string) => void
  onGestionarRegla: (rut: string) => void
}

function SkeletonRow() {
  return (
    <tr className="animate-pulse">
      <td className="px-6 py-4">
        <div className="h-4 bg-muted rounded w-48 mb-2" />
        <div className="h-3 bg-muted rounded w-28" />
      </td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-10" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-24" /></td>
      <td className="px-6 py-4"><div className="h-4 bg-muted rounded w-32" /></td>
    </tr>
  )
}

export function ClientesGrid({
  clientes,
  loading,
  onVerGuias,
  onFacturar,
  onGestionarRegla,
}: ClientesGridProps) {
  if (loading) {
    return (
      <div role="status" data-testid="clientes-grid-skeleton">
        <table className="min-w-full divide-y divide-border">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente / RUT</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guías Pend.</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Factura Estimada</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Monto Neto</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-card divide-y divide-border">
            <SkeletonRow /><SkeletonRow /><SkeletonRow />
          </tbody>
        </table>
      </div>
    )
  }

  if (clientes.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">
        No hay clientes para este período.
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-border">
        <thead className="bg-muted">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Cliente / RUT</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Guías Pend.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Fact. Est.</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Monto Neto</th>
            <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">Acciones</th>
          </tr>
        </thead>
        <tbody className="bg-card divide-y divide-border">
          {clientes.map((c) => (
            <tr key={c.id} className="hover:bg-accent transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="font-medium text-foreground">{c.nombre}</div>
                <div className="text-xs text-muted-foreground">{c.rut}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{c.guiasPendientes}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{c.factEst}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-foreground">{clpFormatter.format(c.montoNeto)}</td>
              <td className="px-6 py-4 whitespace-nowrap text-sm">
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => onVerGuias(c.id)}>
                    Ver Guías
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-primary text-primary bg-primary/5 hover:bg-primary/15"
                    onClick={() => onFacturar(c.id)}
                  >
                    Facturar
                  </Button>
                  <button
                    data-testid={`gestionar-regla-${c.rut}`}
                    aria-label="Gestionar regla"
                    onClick={() => onGestionarRegla(c.rut)}
                    className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent transition-colors"
                  >
                    <Settings2 size={15} />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
