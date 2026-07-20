import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { fetchReglasEmpresa, assignReglaCliente } from '@/services/api'
import type { ReglaDisponible } from '@/types'
import { usePeriodoStore } from '@/store/periodoStore'
import { periodoToYYYYMM } from '@/utils/periodo'
import { ResincronizarReglaDialog } from '@/components/ResincronizarReglaDialog/ResincronizarReglaDialog'

interface ReglaActivaPopupProps {
  clienteNombre: string
  rut: string
  reglaActual: string | null
  onClose: () => void
  onSaved: () => void
}

export function ReglaActivaPopup({ clienteNombre, rut, reglaActual, onClose, onSaved }: ReglaActivaPopupProps) {
  const [reglas, setReglas] = useState<ReglaDisponible[]>([])
  const [selected, setSelected] = useState<string | null>(reglaActual)
  const [saving, setSaving] = useState(false)
  const [step, setStep] = useState<'select' | 'confirm-resinc'>('select')
  const [pendingReglaIdl, setPendingReglaIdl] = useState<string | null>(null)

  const periodo = usePeriodoStore((s) => s.periodo)
  const periodoDefault = periodoToYYYYMM(periodo)

  useEffect(() => {
    fetchReglasEmpresa().then(setReglas).catch(() => setReglas([]))
  }, [])

  const handleGuardar = async () => {
    if (selected === reglaActual) { onClose(); return }

    // Primera activación: reglaActual era null → PUT directo
    if (reglaActual === null) {
      setSaving(true)
      try {
        if (selected) await assignReglaCliente(rut, selected)
        onSaved()
        onClose()
      } catch {
        // silencioso
      } finally {
        setSaving(false)
      }
      return
    }

    // Cambio de regla → mostrar diálogo de resincronización
    setPendingReglaIdl(selected)
    setStep('confirm-resinc')
  }

  const handleConfirmResinc = async (opciones: { recomputar: boolean; periodo?: string }) => {
    if (!pendingReglaIdl) return
    setSaving(true)
    try {
      await assignReglaCliente(rut, pendingReglaIdl, opciones)
      onSaved()
      onClose()
    } catch {
      // silencioso
    } finally {
      setSaving(false)
    }
  }

  const handleCancelResinc = () => {
    setStep('select')
    setPendingReglaIdl(null)
  }

  if (step === 'confirm-resinc') {
    const anteriorDesc = reglas.find((r) => r.reglaIdl === reglaActual)?.reglaDesc ?? reglaActual ?? ''
    const nuevaDesc = reglas.find((r) => r.reglaIdl === pendingReglaIdl)?.reglaDesc ?? pendingReglaIdl ?? ''
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

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="font-semibold text-foreground">Regla de agrupación — {clienteNombre}</h2>

        <p className="text-sm text-muted-foreground">
          Regla activa: <span className="font-medium text-foreground">{reglaActual ?? 'Sin regla'}</span>
        </p>

        <fieldset className="space-y-2">
          <legend className="text-sm font-medium text-foreground mb-2">Cambiar a:</legend>
          {reglas.map((r) => (
            <label key={r.reglaIdl} className="flex items-center gap-2 text-sm cursor-pointer">
              <input
                type="radio"
                name="regla"
                value={r.reglaIdl}
                checked={selected === r.reglaIdl}
                onChange={() => setSelected(r.reglaIdl)}
                aria-label={r.reglaDesc}
              />
              <span>{r.reglaDesc}</span>
            </label>
          ))}
          <label className="flex items-center gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="regla"
              value=""
              checked={selected === null || selected === ''}
              onChange={() => setSelected(null)}
              aria-label="Sin regla"
            />
            <span>Sin regla</span>
          </label>
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onClose} disabled={saving}>Cancelar</Button>
          <Button onClick={handleGuardar} disabled={saving}>
            {saving ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
