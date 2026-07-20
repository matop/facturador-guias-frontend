import { useState } from 'react'
import { Button } from '@/components/ui/button'

interface ResincronizarReglaDialogProps {
  clienteNombre: string
  reglaAnteriorDesc: string
  reglaNuevaDesc: string
  periodoDefault: string // YYYY-MM
  onConfirm: (opciones: { recomputar: boolean; periodo?: string }) => void
  onCancel: () => void
}

export function ResincronizarReglaDialog({
  clienteNombre,
  reglaAnteriorDesc,
  reglaNuevaDesc,
  periodoDefault,
  onConfirm,
  onCancel,
}: ResincronizarReglaDialogProps) {
  const [mode, setMode] = useState<'resincronizar' | 'solo-nuevas'>('resincronizar')
  const [mes, setMes] = useState(periodoDefault)

  const handleConfirmar = () => {
    if (mode === 'resincronizar') {
      onConfirm({ recomputar: true, periodo: mes })
    } else {
      onConfirm({ recomputar: false })
    }
  }

  return (
    <div role="dialog" aria-modal="true" className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-card border border-border rounded-xl shadow-xl w-full max-w-md p-6 space-y-4">
        <h2 className="font-semibold text-foreground">
          Cambio de regla — {clienteNombre}
        </h2>

        <p className="text-sm text-muted-foreground">
          La regla activa cambiará de{' '}
          <span className="font-medium text-foreground">{reglaAnteriorDesc}</span>
          {' '}a{' '}
          <span className="font-medium text-foreground">{reglaNuevaDesc}</span>.
        </p>

        <p className="text-sm font-medium text-foreground">¿Deseas re-sincronizar guías existentes?</p>

        <fieldset className="space-y-3">
          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="modo-resync"
              value="resincronizar"
              checked={mode === 'resincronizar'}
              onChange={() => setMode('resincronizar')}
              className="mt-0.5"
              aria-label="Re-sincronizar guías del período"
            />
            <div className="space-y-1.5">
              <span className="font-medium">Re-sincronizar guías del período:</span>
              <input
                type="month"
                value={mes}
                onChange={(e) => {
                  setMes(e.target.value)
                  setMode('resincronizar')
                }}
                aria-label="Selector de mes"
                className="block border border-border rounded px-2 py-1 text-sm bg-background text-foreground"
              />
            </div>
          </label>

          <label className="flex items-start gap-2 text-sm cursor-pointer">
            <input
              type="radio"
              name="modo-resync"
              value="solo-nuevas"
              checked={mode === 'solo-nuevas'}
              onChange={() => setMode('solo-nuevas')}
              className="mt-0.5"
              aria-label="Solo guías nuevas"
            />
            <div>
              <span className="font-medium">Solo guías nuevas</span>
              <p className="text-muted-foreground text-xs mt-0.5">
                Las guías existentes conservan su clasificación anterior.
              </p>
            </div>
          </label>
        </fieldset>

        <div className="flex justify-end gap-2 pt-2">
          <Button variant="outline" onClick={onCancel}>Cancelar</Button>
          <Button onClick={handleConfirmar}>Confirmar</Button>
        </div>
      </div>
    </div>
  )
}
