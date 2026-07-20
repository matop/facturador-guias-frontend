import { useState, useEffect } from 'react'
import { Settings, CheckCircle2, AlertTriangle, RefreshCw, Edit2, Check, X } from 'lucide-react'
import {
  fetchDiscoverCandidatos,
  activarRegla,
  fetchClientes,
  fetchReglasPorCliente,
  activarReglaCliente,
  assignReglaCliente,
  updateReglanombre,
} from '@/services/api'
import type { DiscoverCandidato, DiscoverResult, ReglaConfig, ReglaEmp, ReglaCliente, Cliente } from '@/types'
import { useTenantStore } from '@/store/tenantStore'

// ─── Helpers ──────────────────────────────────────────────────────────────────

function candidatoKey(c: DiscoverCandidato): string {
  return c.tipo === 'campo-receptor'
    ? `receptor_${c.field}`
    : `detalle_${c.lineFilter}_${c.key}`
}

function candidatoLabel(c: DiscoverCandidato): string {
  return c.tipo === 'campo-receptor' ? c.field! : `${c.lineFilter} · ${c.key}`
}

function candidatoSubtitle(c: DiscoverCandidato): string {
  return c.tipo === 'campo-receptor' ? 'Campo de receptor' : 'Campo de detalle'
}

function toConfig(c: DiscoverCandidato): ReglaConfig {
  if (c.tipo === 'campo-receptor') return { type: 'campo-receptor', field: c.field! }
  return { type: 'campo-detalle', lineFilter: c.lineFilter!, key: c.key! }
}

function configLabel(config: ReglaConfig): string {
  if (config.type === 'campo-receptor') return config.field
  return `${config.lineFilter} · ${config.key}`
}

function isConfiguredForCliente(c: DiscoverCandidato, reglasCliente: ReglaCliente[]): boolean {
  return reglasCliente.some((r) => {
    if (!r.reglaconfig) return false
    if (c.tipo === 'campo-receptor' && r.reglaconfig.type === 'campo-receptor') return r.reglaconfig.field === c.field
    if (c.tipo === 'campo-detalle' && r.reglaconfig.type === 'campo-detalle') {
      return r.reglaconfig.lineFilter === c.lineFilter && r.reglaconfig.key === c.key
    }
    return false
  })
}

function isActiveForCliente(c: DiscoverCandidato, reglasCliente: ReglaCliente[]): boolean {
  return reglasCliente.some((r) => {
    if (!r.activa || !r.reglaconfig) return false
    if (c.tipo === 'campo-receptor' && r.reglaconfig.type === 'campo-receptor') return r.reglaconfig.field === c.field
    if (c.tipo === 'campo-detalle' && r.reglaconfig.type === 'campo-detalle') {
      return r.reglaconfig.lineFilter === c.lineFilter && r.reglaconfig.key === c.key
    }
    return false
  })
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function AdminReglas() {
  const tenantNombre = useTenantStore((s) => s.tenantNombre)

  // Discovery
  const [discover, setDiscover] = useState<DiscoverResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Client selector
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [clienteRut, setClienteRut] = useState<string | null>(null)
  const [reglasCliente, setReglasCliente] = useState<ReglaCliente[]>([])
  const [reglasClienteLoading, setReglasClienteLoading] = useState(false)
  const [activandoReglaidl, setActivandoReglaidl] = useState<string | null>(null)

  // Confirm modal
  const [confirmCandidato, setConfirmCandidato] = useState<DiscoverCandidato | null>(null)
  const [nombreCandidato, setNombreCandidato] = useState('')
  const [activating, setActivating] = useState(false)
  const [activateError, setActivateError] = useState<string | null>(null)
  const [successMsg, setSuccessMsg] = useState<string | null>(null)

  // Inline nombre edit
  const [editingReglaidl, setEditingReglaidl] = useState<string | null>(null)
  const [editNombre, setEditNombre] = useState('')
  const [savingNombre, setSavingNombre] = useState(false)

  useEffect(() => {
    fetchClientes().catch(() => [] as Cliente[]).then(setClientes)
  }, [])

  useEffect(() => {
    if (!clienteRut) {
      setDiscover(null)
      setReglasCliente([])
      return
    }
    setDiscover(null)
    setLoading(true)
    setError(null)
    fetchDiscoverCandidatos(clienteRut)
      .then(setDiscover)
      .catch(() => setError('No se pudieron cargar los candidatos.'))
      .finally(() => setLoading(false))

    setReglasClienteLoading(true)
    fetchReglasPorCliente(clienteRut)
      .then(setReglasCliente)
      .catch(() => setReglasCliente([]))
      .finally(() => setReglasClienteLoading(false))
  }, [clienteRut])

  function handleActivar(c: DiscoverCandidato) {
    setConfirmCandidato(c)
    setActivateError(null)
    setNombreCandidato('')
  }

  async function handleConfirmar() {
    if (!confirmCandidato || !clienteRut) return
    setActivating(true)
    setActivateError(null)
    try {
      const created: ReglaEmp = await activarRegla(toConfig(confirmCandidato))
      await assignReglaCliente(clienteRut, created.reglaidl)
      if (nombreCandidato.trim()) {
        await updateReglanombre(created.reglaidl, nombreCandidato.trim())
      }
      const updatedReglas = await fetchReglasPorCliente(clienteRut)
      setReglasCliente(updatedReglas)
      setConfirmCandidato(null)
      setNombreCandidato('')
      const clienteNombre = clientes.find((c) => c.rut === clienteRut)?.nombre ?? clienteRut
      setSuccessMsg(`Regla asignada a ${clienteNombre}: ${candidatoLabel(confirmCandidato)}`)
      setTimeout(() => setSuccessMsg(null), 4000)
    } catch {
      setActivateError('No se pudo asignar la regla. Intentá nuevamente.')
    } finally {
      setActivating(false)
    }
  }

  async function handleActivarReglaCliente(reglaidl: string) {
    if (!clienteRut) return
    setActivandoReglaidl(reglaidl)
    try {
      await activarReglaCliente(clienteRut, reglaidl)
      const updated = await fetchReglasPorCliente(clienteRut)
      setReglasCliente(updated)
    } catch {
      // silent
    } finally {
      setActivandoReglaidl(null)
    }
  }

  async function handleSaveNombre(reglaidl: string) {
    setSavingNombre(true)
    try {
      await updateReglanombre(reglaidl, editNombre.trim())
      setReglasCliente((prev) =>
        prev.map((r) => r.reglaidl === reglaidl ? { ...r, reglanombre: editNombre.trim() || null } : r),
      )
      setEditingReglaidl(null)
    } catch {
      // silent
    } finally {
      setSavingNombre(false)
    }
  }

  const clienteSeleccionado = clientes.find((c) => c.rut === clienteRut)

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Section header */}
      <div>
        <h2
          className="text-[22px] font-bold text-foreground leading-tight"
          style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
        >
          Configuración de Agrupación
        </h2>
        <p className="text-sm text-muted-foreground mt-1">
          {tenantNombre} · Seleccioná un cliente para gestionar sus reglas de agrupación
        </p>
      </div>

      {/* Client selector */}
      <div>
        <label className="block text-xs font-medium text-muted-foreground mb-1.5">Cliente</label>
        <select
          data-testid="select-cliente"
          value={clienteRut ?? ''}
          onChange={(e) => setClienteRut(e.target.value || null)}
          className="w-full rounded-lg border border-border bg-card text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
        >
          <option value="">— Seleccioná un cliente —</option>
          {clientes.map((c) => (
            <option key={c.rut} value={c.rut}>
              {c.nombre} ({c.rut})
            </option>
          ))}
        </select>
      </div>

      {/* Success toast */}
      {successMsg && (
        <div
          data-testid="success-msg"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium bg-success-50 border border-success-100 text-success-600"
        >
          <CheckCircle2 className="w-4 h-4 shrink-0" />
          {successMsg}
        </div>
      )}

      {/* Error loading */}
      {error && (
        <div
          data-testid="error-discover"
          className="flex items-center gap-3 rounded-xl px-4 py-3 text-sm bg-danger-50 border border-danger-100 text-danger-600"
        >
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Client rules panel */}
      {clienteRut && (
        <div className="rounded-xl border border-border bg-card p-5 space-y-3">
          <h3 className="text-sm font-semibold text-foreground">
            Reglas de {clienteSeleccionado?.nombre ?? clienteRut}
          </h3>
          {reglasClienteLoading ? (
            <div data-testid="reglas-cliente-skeleton" className="space-y-2">
              {[0, 1].map((i) => (
                <div key={i} className="h-10 bg-border rounded-lg animate-pulse" />
              ))}
            </div>
          ) : reglasCliente.length === 0 ? (
            <p data-testid="reglas-cliente-empty" className="text-xs text-muted-foreground italic">
              Sin reglas configuradas. Asigná una desde los candidatos abajo.
            </p>
          ) : (
            <ul data-testid="reglas-cliente-list" className="space-y-2">
              {reglasCliente.map((r) => {
                const label = r.reglaconfig ? configLabel(r.reglaconfig) : r.reglaidl
                const isEditing = editingReglaidl === r.reglaidl
                return (
                  <li
                    key={r.reglaidl}
                    data-testid={`regla-cliente-${r.reglaidl}`}
                    className={[
                      'flex items-center gap-3 rounded-lg px-3.5 py-2.5 border text-sm',
                      r.activa ? 'border-success/40 bg-success/5' : 'border-border',
                    ].join(' ')}
                  >
                    {r.activa && (
                      <CheckCircle2 className="w-4 h-4 shrink-0 text-success-600" />
                    )}

                    <div className="flex-1 min-w-0">
                      {isEditing ? (
                        <div className="flex items-center gap-2">
                          <input
                            data-testid={`input-nombre-${r.reglaidl}`}
                            autoFocus
                            value={editNombre}
                            onChange={(e) => setEditNombre(e.target.value)}
                            placeholder={label}
                            className="flex-1 rounded border border-border bg-background text-foreground text-xs px-2 py-1 focus:outline-none focus:ring-1 focus:ring-primary/50"
                          />
                          <button
                            data-testid={`btn-save-nombre-${r.reglaidl}`}
                            onClick={() => handleSaveNombre(r.reglaidl)}
                            disabled={savingNombre}
                            className="p-1 rounded text-success hover:text-success-600 disabled:opacity-50"
                          >
                            <Check className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => setEditingReglaidl(null)}
                            className="p-1 rounded text-muted-foreground hover:text-foreground"
                          >
                            <X className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      ) : (
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs truncate">
                            {r.reglanombre ?? label}
                          </span>
                          {r.reglanombre && (
                            <span className="text-xs text-muted-foreground">({label})</span>
                          )}
                          <button
                            data-testid={`btn-editar-nombre-${r.reglaidl}`}
                            onClick={() => { setEditingReglaidl(r.reglaidl); setEditNombre(r.reglanombre ?? '') }}
                            className="p-0.5 rounded text-muted-foreground hover:text-foreground opacity-60 hover:opacity-100"
                          >
                            <Edit2 className="w-3 h-3" />
                          </button>
                        </div>
                      )}
                    </div>

                    {!r.activa && (
                      <button
                        data-testid={`btn-activar-regla-${r.reglaidl}`}
                        onClick={() => handleActivarReglaCliente(r.reglaidl)}
                        disabled={activandoReglaidl === r.reglaidl}
                        className="shrink-0 px-3 py-1 rounded-md text-xs font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: 'var(--primary)' }}
                      >
                        {activandoReglaidl === r.reglaidl ? (
                          <RefreshCw className="w-3 h-3 animate-spin" />
                        ) : 'Activar'}
                      </button>
                    )}
                  </li>
                )
              })}
            </ul>
          )}
        </div>
      )}

      {/* Loading skeletons for discover */}
      {loading && (
        <div data-testid="candidatos-skeleton" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {[0, 1, 2].map((i) => (
            <div key={i} className="bg-card border border-border rounded-xl p-5 animate-pulse">
              <div className="h-4 bg-border rounded w-24 mb-3" />
              <div className="h-6 bg-border rounded w-40 mb-2" />
              <div className="h-4 bg-border rounded w-16 mb-3" />
              <div className="flex gap-2">
                <div className="h-6 bg-border rounded-full w-20" />
                <div className="h-6 bg-border rounded-full w-20" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Candidates */}
      {!loading && !error && discover && (
        <>
          <div className="flex items-center justify-between">
            <p className="text-xs text-muted-foreground">
              {discover.candidatos.length} candidato{discover.candidatos.length !== 1 ? 's' : ''}{' '}
              encontrado{discover.candidatos.length !== 1 ? 's' : ''} · muestra de{' '}
              <strong>{discover.muestraGuias}</strong> guías
            </p>
            {!clienteRut && (
              <span className="text-xs text-muted-foreground italic">
                Seleccioná un cliente para asignar reglas
              </span>
            )}
          </div>

          {discover.candidatos.length === 0 ? (
            <div
              data-testid="empty-candidatos"
              className="text-center py-16 text-muted-foreground text-sm"
            >
              <Settings className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p>No se encontraron candidatos en las guías muestreadas.</p>
              <p className="text-xs mt-1">Sincronizá guías antes de configurar una regla.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {discover.candidatos.map((c) => {
                const key = candidatoKey(c)
                const activoParaCliente = clienteRut ? isActiveForCliente(c, reglasCliente) : false
                const configuradoParaCliente = clienteRut ? isConfiguredForCliente(c, reglasCliente) : false
                return (
                  <div
                    key={key}
                    data-testid={`candidato-${key}`}
                    className={[
                      'bg-card border rounded-xl p-5 flex flex-col gap-3 transition-colors',
                      activoParaCliente ? 'border-success/40' : 'border-border hover:border-primary/30',
                    ].join(' ')}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span
                        className="text-xs font-semibold rounded-full px-3 py-1 border"
                        style={
                          c.tipo === 'campo-receptor'
                            ? { backgroundColor: '#3b82f620', borderColor: '#3b82f655', color: '#93c5fd' }
                            : { backgroundColor: '#8b5cf620', borderColor: '#8b5cf655', color: '#c4b5fd' }
                        }
                      >
                        {c.tipo === 'campo-receptor' ? 'Receptor' : 'Detalle'}
                      </span>
                      {activoParaCliente && (
                        <span className="flex items-center gap-1 text-xs font-medium text-success-600">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Activa
                        </span>
                      )}
                    </div>

                    <div>
                      <div className="text-lg font-bold text-foreground font-mono">
                        {candidatoLabel(c)}
                      </div>
                      <div className="text-xs text-muted-foreground mt-0.5">
                        {candidatoSubtitle(c)} ·{' '}
                        <strong>{c.ocurrencias}</strong> guía{c.ocurrencias !== 1 ? 's' : ''}
                      </div>
                    </div>

                    {c.ejemplos.length > 0 && (
                      <div className="flex flex-wrap gap-1.5">
                        {c.ejemplos.map((ej) => (
                          <span
                            key={ej}
                            className="text-xs rounded-full px-2.5 py-1 border border-border text-muted-foreground bg-background"
                          >
                            {ej}
                          </span>
                        ))}
                      </div>
                    )}

                    <div className="mt-auto pt-2 flex justify-end">
                      {activoParaCliente ? (
                        <span className="text-xs text-muted-foreground italic">Activa para este cliente</span>
                      ) : configuradoParaCliente ? (
                        <span className="text-xs text-muted-foreground italic">Ya configurada</span>
                      ) : (
                        <button
                          data-testid={`btn-activar-${key}`}
                          onClick={() => { if (clienteRut) handleActivar(c) }}
                          disabled={!clienteRut}
                          className="px-4 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Asignar
                        </button>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </>
      )}

      {/* Confirm modal */}
      {confirmCandidato && (
        <div
          className="fixed inset-0 z-[900] flex items-center justify-center"
          style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setConfirmCandidato(null) }}
        >
          <div className="bg-card rounded-xl shadow-2xl border border-border w-[480px] max-w-[92vw] p-7">
            <h2
              className="text-[17px] font-bold text-foreground mb-1"
              style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
            >
              Asignar regla de agrupación
            </h2>
            <p className="text-sm text-muted-foreground mb-4">
              Las guías de{' '}
              <strong className="text-foreground">
                {clientes.find((c) => c.rut === clienteRut)?.nombre ?? clienteRut}
              </strong>{' '}
              se agruparán por{' '}
              <strong className="text-foreground font-mono">{candidatoLabel(confirmCandidato)}</strong>.
            </p>

            <div className="border border-border rounded-lg overflow-hidden mb-4">
              {[
                { label: 'Tipo', value: candidatoSubtitle(confirmCandidato) },
                { label: 'Campo', value: candidatoLabel(confirmCandidato) },
                { label: 'Ocurrencias', value: `${confirmCandidato.ocurrencias} guías` },
              ].map((row, i, arr) => (
                <div
                  key={row.label}
                  className="flex items-center justify-between px-3.5 py-2.5 text-sm gap-3"
                  style={{ borderBottom: i < arr.length - 1 ? '1px solid var(--border)' : 'none' }}
                >
                  <span className="text-muted-foreground">{row.label}</span>
                  <span className="font-mono font-semibold text-foreground">{row.value}</span>
                </div>
              ))}
            </div>

            <div className="mb-5">
              <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                Nombre de display <span className="opacity-60">(opcional)</span>
              </label>
              <input
                data-testid="input-nombre-candidato"
                value={nombreCandidato}
                onChange={(e) => setNombreCandidato(e.target.value)}
                placeholder={`ej: Por ${candidatoLabel(confirmCandidato)}`}
                className="w-full rounded-lg border border-border bg-background text-foreground text-sm px-3 py-2 focus:outline-none focus:ring-1 focus:ring-primary/50"
              />
            </div>

            {activateError && (
              <div
                data-testid="error-activar"
                className="flex items-center gap-2 rounded-lg px-3.5 py-3 mb-4 text-sm bg-danger-50 border border-danger-100 text-danger-600"
              >
                <AlertTriangle className="w-4 h-4 shrink-0" />
                {activateError}
              </div>
            )}

            <div className="flex gap-2.5 justify-end">
              <button
                onClick={() => setConfirmCandidato(null)}
                disabled={activating}
                className="px-4 py-2 rounded-lg border border-border text-sm font-medium text-muted-foreground hover:text-foreground hover:border-foreground/30 transition-colors disabled:opacity-50"
              >
                Cancelar
              </button>
              <button
                data-testid="btn-confirmar-activar"
                onClick={handleConfirmar}
                disabled={activating}
                className="flex items-center gap-2 px-5 py-2 rounded-lg text-sm font-semibold text-white transition-all hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: 'var(--primary)' }}
              >
                {activating ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    Asignando…
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    Confirmar
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
