import { useState, useEffect } from 'react'
import { Outlet, useNavigate, useLocation } from 'react-router-dom'
import { FileText, Receipt, Users, AlertTriangle } from 'lucide-react'
import Sidebar from '../Sidebar/Sidebar'
import { usePeriodoStore } from '@/store/periodoStore'
import { fetchMetricas } from '@/services/api'
import type { MetricasResumen } from '@/types'

const PAGE_META: Record<string, { title: string; sub: string }> = {
  '/clientes':     { title: 'Clientes',              sub: 'Todos los clientes' },
  '/guias':        { title: 'Guías de Despacho',      sub: 'Vista por agrupador' },
  '/preview':      { title: 'Previsualización',       sub: 'Revisión antes de emitir al SII' },
  '/historial':    { title: 'Historial',              sub: 'Auditoría post-emisión' },
  '/admin/reglas': { title: 'Reglas de Agrupación',  sub: 'Configuración del campo agrupador' },
}

const clpFmt = new Intl.NumberFormat('es-CL', {
  style: 'currency',
  currency: 'CLP',
  maximumFractionDigits: 0,
})

const PERIODO_LABEL: Record<string, string> = {
  actual:   'Mes Actual',
  anterior: 'Mes Anterior',
}

export default function AppLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const periodo = usePeriodoStore((s) => s.periodo)
  const [globalDialogOpen, setGlobalDialogOpen] = useState(false)
  const [metricas, setMetricas] = useState<MetricasResumen | null>(null)

  useEffect(() => {
    fetchMetricas().then(setMetricas).catch(() => {})
  }, [periodo])

  const page      = PAGE_META[location.pathname] ?? { title: '', sub: '' }
  const montoNeto = metricas?.montoEstimado ?? 0
  const iva       = Math.round(montoNeto * 0.19)

  const metricPills = [
    { testId: 'header-metric-guias',    label: 'Guías',    value: metricas?.totalGuias      ?? '–', icon: <FileText className="w-4 h-4" /> },
    { testId: 'header-metric-facturas', label: 'Facturar', value: metricas?.factEst         ?? '–', icon: <Receipt  className="w-4 h-4" /> },
    { testId: 'header-metric-clientes', label: 'Clientes', value: metricas?.clientesActivos ?? '–', icon: <Users    className="w-4 h-4" /> },
  ]

  const globalSummary = [
    { label: 'Clientes a facturar', value: metricas ? String(metricas.clientesActivos)      : '–' },
    { label: 'Guías de despacho',   value: metricas ? String(metricas.totalGuias)            : '–' },
    { label: 'Monto Neto',          value: metricas ? clpFmt.format(montoNeto)               : '–' },
    { label: 'IVA (19%)',           value: metricas ? clpFmt.format(iva)                     : '–' },
    { label: 'Total con IVA',       value: metricas ? clpFmt.format(montoNeto + iva)         : '–', highlight: true },
  ]

  return (
    <div className="h-screen flex bg-background">
      <Sidebar />

      <div className="flex flex-col flex-1 overflow-hidden">
        {/* Header */}
        <header
          className="border-b px-6 flex items-center gap-4 shrink-0"
          style={{
            height: '64px',
            backgroundColor: 'var(--topbar-bg)',
            borderColor: 'var(--topbar-border)',
          }}
        >
          {/* Page title */}
          <div className="flex-1 min-w-0">
            <div
              className="font-bold text-[18px] leading-tight truncate"
              style={{ color: 'var(--topbar-pill-text)', fontFamily: "'Syne', system-ui, sans-serif" }}
            >
              {page.title}
            </div>
            {page.sub && (
              <p className="text-[12px] mt-0.5 truncate" style={{ color: 'var(--topbar-pill-text)', opacity: 0.55 }}>
                {page.sub}
              </p>
            )}
          </div>

          {/* KPI chips */}
          <div className="flex items-center gap-1.5">
            {metricPills.map((pill) => (
              <span
                key={pill.testId}
                data-testid={pill.testId}
                className="flex items-center gap-1.5 text-sm border px-3 py-1.5 rounded-full"
                style={{
                  backgroundColor: 'var(--topbar-pill-bg)',
                  borderColor: 'var(--topbar-pill-border)',
                  color: 'var(--topbar-pill-text)',
                }}
              >
                <span style={{ color: 'var(--topbar-icon-color)' }}>{pill.icon}</span>
                <span className="font-medium">{pill.label}</span>
                <span className="font-bold" style={{ color: 'var(--topbar-icon-color)' }}>{pill.value}</span>
              </span>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Facturar Global */}
            <button
              className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 shadow-sm"
              style={{ backgroundColor: 'var(--topbar-btn-bg)' }}
              onClick={() => setGlobalDialogOpen(true)}
            >
              <Receipt className="w-4 h-4" />
              Facturar Global
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-6">
          <Outlet />
        </main>
      </div>

      {/* Global Confirm Modal */}
      {globalDialogOpen && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setGlobalDialogOpen(false) }}
        >
          <div className="bg-card rounded-xl shadow-2xl border border-border w-[520px] max-w-[92vw] p-7">
            {/* Title */}
            <h2
              className="text-[17px] font-bold text-foreground mb-1"
              style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
            >
              Facturar Global · {PERIODO_LABEL[periodo] ?? periodo}
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Se procesarán todas las guías pendientes del período.
            </p>

            {/* Warning box */}
            <div
              className="flex gap-3 items-start rounded-lg p-3.5 mb-5 bg-warning-50 border border-warning-100"
            >
              <AlertTriangle className="w-4 h-4 mt-0.5 shrink-0 text-warning-600" />
              <p className="text-sm leading-relaxed text-warning-600">
                Esta acción emitirá facturas para <strong>todos los clientes</strong> con guías
                pendientes. El proceso <strong>no puede revertirse</strong> una vez enviado al SII.
              </p>
            </div>

            {/* Summary rows */}
            <div className="border border-border rounded-lg overflow-hidden mb-5">
              {globalSummary.map((row, i) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm gap-3"
                  style={{
                    borderBottom: i < globalSummary.length - 1 ? '1px solid var(--border)' : 'none',
                    backgroundColor: row.highlight ? 'var(--secondary)' : undefined,
                    fontWeight: row.highlight ? 700 : undefined,
                  }}
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span
                    className="font-mono font-semibold"
                    style={{
                      color: row.highlight ? 'var(--primary)' : 'var(--foreground)',
                      fontSize: row.highlight ? '14px' : undefined,
                    }}
                  >
                    {row.value}
                  </span>
                </div>
              ))}
            </div>

            {/* Actions */}
            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setGlobalDialogOpen(false)}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={() => { setGlobalDialogOpen(false); navigate('/preview') }}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                <Receipt className="w-4 h-4" />
                Confirmar emisión
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
