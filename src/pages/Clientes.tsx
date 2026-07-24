import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useQuery } from '@tanstack/react-query'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { MetricsPanel } from '@/components/MetricsPanel'
import { ClientesGrid } from '@/components/ClientesGrid'
import { ReglaActivaPopup } from '@/components/ReglaActivaPopup/ReglaActivaPopup'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import { fetchClientes } from '@/services/api'
import { queryKeys } from '@/lib/queryKeys'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { periodoToRange } from '@/utils/periodo'
import type { Periodo } from '@/types'

export default function Clientes() {
  const navigate = useNavigate()
  const periodo = usePeriodoStore((s) => s.periodo)
  const setPeriodo = usePeriodoStore((s) => s.setPeriodo)
  const tenantId = useTenantStore((s) => s.tenantId)

  const [query, setQuery] = useState('')
  const [debouncedQuery, setDebouncedQuery] = useState('')

  // Popup state
  const [popupRut, setPopupRut] = useState<string | null>(null)

  // Debounce de 300ms sobre la query key
  useEffect(() => {
    const timer = setTimeout(() => setDebouncedQuery(query), 300)
    return () => clearTimeout(timer)
  }, [query])

  const { data: clientes = [], isLoading: loading } = useQuery({
    queryKey: queryKeys.clientes(tenantId, periodo, debouncedQuery),
    queryFn: () => fetchClientes(debouncedQuery || undefined),
  })

  const popupCliente = clientes.find((c) => c.rut === popupRut)

  const tabs: { key: Periodo; label: string; testId: string; mesLabel: string }[] = [
    { key: 'anterior', label: 'Mes Anterior', testId: 'tab-anterior', mesLabel: periodoToRange('anterior').label },
    { key: 'actual',   label: 'Mes Actual',   testId: 'tab-actual',   mesLabel: periodoToRange('actual').label  },
  ]

  return (
    <div className="space-y-6">
      <MetricsPanel />

      {/* Tabs de período con navegación ◄ ► */}
      <div className="flex items-center border-b border-border">
        <nav className="-mb-px flex flex-1">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              type="button"
              data-testid={tab.testId}
              onClick={() => setPeriodo(tab.key)}
              className={`px-5 py-2.5 text-sm font-medium border-b-2 -mb-px transition-colors text-left ${
                periodo === tab.key
                  ? 'border-primary text-foreground bg-primary/10'
                  : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
              }`}
            >
              <span className="block">{tab.label}</span>
              <span className="block text-xs font-normal opacity-60">{tab.mesLabel}</span>
            </button>
          ))}
        </nav>

        {/* Flechas de navegación */}
        <div className="flex items-center gap-0.5 px-3 pb-px">
          <button
            type="button"
            aria-label="Ir a mes anterior"
            disabled={periodo === 'anterior'}
            onClick={() => setPeriodo('anterior')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            aria-label="Ir a mes actual"
            disabled={periodo === 'actual'}
            onClick={() => setPeriodo('actual')}
            className="p-1.5 rounded-md text-muted-foreground hover:text-foreground hover:bg-accent disabled:opacity-25 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Buscador + Facturar Global secundario */}
      <div className="flex items-center justify-between gap-4">
        <Input
          data-testid="buscador"
          type="text"
          placeholder="Buscar por nombre o RUT..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          className="flex-1 max-w-md"
        />
        <Button
          variant="default"
          data-testid="facturar-global-secundario"
          onClick={() => navigate('/guias')}
        >
          Facturar Global
        </Button>
      </div>

      {/* Grilla de clientes */}
      <div className="bg-card rounded-xl border border-border overflow-hidden">
        <ClientesGrid
          clientes={clientes}
          loading={loading}
          hasQuery={query.trim().length > 0}
          onVerGuias={(id) => navigate(`/guias?clienteId=${id}`)}
          onFacturar={(id) => navigate(`/guias?clienteId=${id}`)}
          onGestionarRegla={(rut) => setPopupRut(rut)}
        />
      </div>

      {/* Popup regla activa */}
      {popupRut && popupCliente && (
        <ReglaActivaPopup
          clienteNombre={popupCliente.nombre}
          rut={popupRut}
          reglaActual={popupCliente.reglaIdl}
          onClose={() => setPopupRut(null)}
          onSaved={() => {}}
        />
      )}
    </div>
  )
}
