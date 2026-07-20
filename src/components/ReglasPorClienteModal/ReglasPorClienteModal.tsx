import { useState } from 'react'
import { X, CheckCircle2, RefreshCw, Pencil, Check } from 'lucide-react'
import type { ReglaCliente } from '@/types'
import { usePeriodoStore } from '@/store/periodoStore'
import { periodoToYYYYMM } from '@/utils/periodo'
import { ResincronizarReglaDialog } from '@/components/ResincronizarReglaDialog/ResincronizarReglaDialog'

function reglaLabel(r: ReglaCliente): string {
  if (r.reglanombre) return r.reglanombre
  if (!r.reglaconfig) return r.reglaidl
  return r.reglaconfig.type === 'campo-receptor'
    ? r.reglaconfig.field
    : `${r.reglaconfig.lineFilter} · ${r.reglaconfig.key}`
}

interface Props {
  clienteNombre: string
  rut: string
  reglas: ReglaCliente[]
  loading: boolean
  activando: string | null
  renombrando?: string | null
  onActivar: (reglaidl: string, opciones?: { recomputar: boolean; periodo?: string }) => void
  onRenombrar: (reglaidl: string, nombre: string) => void
  onClose: () => void
}

export function ReglasPorClienteModal({
  clienteNombre,
  reglas,
  loading,
  activando,
  renombrando,
  onActivar,
  onRenombrar,
  onClose,
}: Props) {
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const [step, setStep] = useState<'select' | 'confirm-resinc'>('select')
  const [pendingReglaIdl, setPendingReglaIdl] = useState<string | null>(null)

  const periodo = usePeriodoStore((s) => s.periodo)
  const periodoDefault = periodoToYYYYMM(periodo)

  const reglaActiva = reglas.find((r) => r.activa)

  const handleActivar = (reglaidl: string) => {
    if (!reglaActiva) {
      onActivar(reglaidl)
      return
    }
    setPendingReglaIdl(reglaidl)
    setStep('confirm-resinc')
  }

  const handleConfirmResinc = (opciones: { recomputar: boolean; periodo?: string }) => {
    if (!pendingReglaIdl) return
    onActivar(pendingReglaIdl, opciones)
    setStep('select')
    setPendingReglaIdl(null)
  }

  const handleCancelResinc = () => {
    setStep('select')
    setPendingReglaIdl(null)
  }

  if (step === 'confirm-resinc') {
    const anteriorDesc = reglaActiva ? reglaLabel(reglaActiva) : ''
    const nuevaRegla = reglas.find((r) => r.reglaidl === pendingReglaIdl)
    const nuevaDesc = nuevaRegla ? reglaLabel(nuevaRegla) : (pendingReglaIdl ?? '')
    return (
      <ResincronizarReglaDialog
        clienteNombre={clienteNombre}
        reglaAnteriorDesc={anteriorDesc}
        reglaNuevaDesc={nuevaDesc}
        periodoDefault={periodoDefault}
        onConfirm={handleConfirmResinc}
        onCancel={handleCancelResinc}
      />
    )
  }

  const startEdit = (r: ReglaCliente) => {
    setEditingId(r.reglaidl)
    setEditValue(r.reglanombre ?? '')
  }

  const cancelEdit = () => setEditingId(null)

  const saveEdit = (reglaidl: string) => {
    onRenombrar(reglaidl, editValue)
    setEditingId(null)
  }

  return (
    <div
      data-testid="modal-overlay"
      className="fixed inset-0 z-[900] flex items-center justify-center"
      style={{ backgroundColor: 'rgba(11,24,41,.55)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-card rounded-xl shadow-2xl border border-border w-[520px] max-w-[94vw] p-7">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 mb-5">
          <div>
            <h2
              data-testid="modal-titulo"
              className="text-[17px] font-bold text-foreground leading-tight"
              style={{ fontFamily: "'Syne', system-ui, sans-serif" }}
            >
              {clienteNombre}
            </h2>
            <p className="text-xs text-muted-foreground mt-0.5">Reglas de agrupación configuradas</p>
          </div>
          <button
            data-testid="btn-cerrar"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Body */}
        {loading ? (
          <div data-testid="reglas-skeleton" className="space-y-3">
            {[0, 1].map((i) => (
              <div key={i} className="h-14 bg-muted rounded-lg animate-pulse" />
            ))}
          </div>
        ) : reglas.length === 0 ? (
          <div
            data-testid="empty-reglas"
            className="text-center py-10 text-sm text-muted-foreground"
          >
            No hay reglas configuradas para este cliente.
          </div>
        ) : (
          <div className="space-y-2">
            {reglas.map((r) => {
              const isEditing = editingId === r.reglaidl
              const isRenombrando = renombrando === r.reglaidl

              return (
                <div
                  key={r.reglaidl}
                  data-testid={`regla-row-${r.reglaidl}`}
                  className={[
                    'flex items-center justify-between gap-3 rounded-lg px-4 py-3 border transition-colors',
                    r.activa
                      ? 'border-emerald-500/40 bg-emerald-500/5'
                      : 'border-border bg-background',
                  ].join(' ')}
                >
                  {/* Label / input area */}
                  <div className="flex items-center gap-3 min-w-0 flex-1">
                    {r.activa && (
                      <span
                        data-testid={`badge-activa-${r.reglaidl}`}
                        className="flex items-center gap-1 text-xs font-semibold shrink-0"
                        style={{ color: '#6ee7b7' }}
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        Activa
                      </span>
                    )}
                    {isEditing ? (
                      <input
                        data-testid={`input-nombre-${r.reglaidl}`}
                        value={editValue}
                        onChange={(e) => setEditValue(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveEdit(r.reglaidl)
                          if (e.key === 'Escape') cancelEdit()
                        }}
                        className="flex-1 text-sm bg-background border border-border rounded px-2 py-0.5 focus:outline-none focus:ring-1 focus:ring-primary"
                        autoFocus
                      />
                    ) : (
                      <span className="text-sm font-medium text-foreground truncate">
                        {reglaLabel(r)}
                      </span>
                    )}
                  </div>

                  {/* Actions area */}
                  <div className="flex items-center gap-1 shrink-0">
                    {isEditing ? (
                      <>
                        <button
                          data-testid={`btn-guardar-${r.reglaidl}`}
                          onClick={() => saveEdit(r.reglaidl)}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Guardar"
                        >
                          <Check className="w-3.5 h-3.5" />
                        </button>
                        <button
                          data-testid={`btn-cancelar-editar-${r.reglaidl}`}
                          onClick={cancelEdit}
                          className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                          title="Cancelar"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      </>
                    ) : isRenombrando ? (
                      <RefreshCw
                        data-testid={`spinner-renombrando-${r.reglaidl}`}
                        className="w-3.5 h-3.5 animate-spin text-muted-foreground"
                      />
                    ) : (
                      <button
                        data-testid={`btn-editar-${r.reglaidl}`}
                        onClick={() => startEdit(r)}
                        className="p-1.5 rounded-md hover:bg-accent text-muted-foreground hover:text-foreground transition-colors"
                        title="Renombrar"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                    )}

                    {!isEditing && (
                      r.activa ? null : activando === r.reglaidl ? (
                        <button
                          data-testid={`btn-activando-${r.reglaidl}`}
                          disabled
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-white opacity-60"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          <RefreshCw className="w-3 h-3 animate-spin" />
                          Activando…
                        </button>
                      ) : (
                        <button
                          data-testid={`btn-activar-${r.reglaidl}`}
                          onClick={() => handleActivar(r.reglaidl)}
                          className="px-3 py-1.5 rounded-lg text-xs font-semibold text-white transition-all hover:opacity-90"
                          style={{ backgroundColor: 'var(--primary)' }}
                        >
                          Activar
                        </button>
                      )
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
