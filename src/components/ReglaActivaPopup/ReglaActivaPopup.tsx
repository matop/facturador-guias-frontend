import { useState } from 'react'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { Button } from '@/components/ui/button'
import { fetchReglasEmpresa, assignReglaCliente } from '@/services/api'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import { periodoToYYYYMM } from '@/utils/periodo'
import { queryKeys } from '@/lib/queryKeys'
import { ResincronizarReglaDialog } from '@/components/ResincronizarReglaDialog/ResincronizarReglaDialog'

interface ReglaActivaPopupProps {
  clienteNombre: string
  rut: string
  reglaActual: string | null
  onClose: () => void
}

export function ReglaActivaPopup({ clienteNombre, rut, reglaActual, onClose }: ReglaActivaPopupProps) {
  const [selected, setSelected] = useState<string | null>(reglaActual)
  const [step, setStep] = useState<'select' | 'confirm-resinc'>('select')
  const [pendingReglaIdl, setPendingReglaIdl] = useState<string | null>(null)

  const periodo = usePeriodoStore((s) => s.periodo)
  const periodoDefault = periodoToYYYYMM(periodo)
  const tenantId = useTenantStore((s) => s.tenantId)
  const queryClient = useQueryClient()

  const { data: reglas = [] } = useQuery({
    queryKey: queryKeys.reglasEmpresa(tenantId),
    queryFn: fetchReglasEmpresa,
  })

  const mutation = useMutation({
    mutationFn: ({ reglaIdl, opciones }: { reglaIdl: string; opciones?: { recomputar: boolean; periodo?: string } }) =>
      opciones ? assignReglaCliente(rut, reglaIdl, opciones) : assignReglaCliente(rut, reglaIdl),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.clientesAll(tenantId) })
      onClose()
    },
  })

  const handleGuardar = () => {
    if (selected === reglaActual) { onClose(); return }

    // Primera activación: reglaActual era null → PUT directo
    if (reglaActual === null) {
      if (!selected) { onClose(); return }
      mutation.mutate({ reglaIdl: selected })
      return
    }

    // Cambio de regla → mostrar diálogo de resincronización
    setPendingReglaIdl(selected)
    setStep('confirm-resinc')
  }

  const handleConfirmResinc = (opciones: { recomputar: boolean; periodo?: string }) => {
    if (!pendingReglaIdl) return
    mutation.mutate({ reglaIdl: pendingReglaIdl, opciones })
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
          <Button variant="outline" onClick={onClose} disabled={mutation.isPending}>Cancelar</Button>
          <Button onClick={handleGuardar} disabled={mutation.isPending}>
            {mutation.isPending ? 'Guardando...' : 'Guardar'}
          </Button>
        </div>
      </div>
    </div>
  )
}
