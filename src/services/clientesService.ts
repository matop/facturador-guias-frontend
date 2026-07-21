import type { Cliente, MetricasResumen, ReglaCliente } from '@/types'
import { backendFetch, getContext, periodoToYYYYMM } from './http'
import { usePeriodoStore } from '@/store/periodoStore'

// ─── DTOs ─────────────────────────────────────────────────────────────────────

interface ClienteConGuiasDto {
  rut: string
  nombre: string
  cantidadGuias: number
  montoTotal: string
  reglaIdl: string | null
}

// ─── Exports ──────────────────────────────────────────────────────────────────

export function fetchClientes(q?: string): Promise<Cliente[]> {
  const { empkey, periodo } = getContext()
  return backendFetch<ClienteConGuiasDto[]>(`/empresas/${empkey}/clientes`, { params: { periodo } })
    .then((dtos) => {
      let items = dtos
      if (q) {
        const lq = q.toLowerCase()
        items = dtos.filter((d) => d.nombre.toLowerCase().includes(lq) || d.rut.includes(lq))
      }
      return items.map((d) => ({
        id: d.rut,
        nombre: d.nombre,
        rut: d.rut,
        guiasPendientes: d.cantidadGuias,
        factEst: 1,
        montoNeto: Number(d.montoTotal),
        reglaIdl: d.reglaIdl ?? null,
      }))
    })
}

export function fetchMetricas(): Promise<MetricasResumen> {
  const { empkey, periodo } = getContext()
  const periodoActual = usePeriodoStore.getState().periodo

  const mainFetch = backendFetch<ClienteConGuiasDto[]>(`/empresas/${empkey}/clientes`, { params: { periodo } })

  if (periodoActual === 'anterior') {
    // Estamos viendo el período de rezagadas — todos los clientes listados son rezagadas
    return mainFetch.then((clientes) => ({
      totalGuias:           clientes.reduce((s, c) => s + c.cantidadGuias, 0),
      clientesActivos:      clientes.length,
      factEst:              clientes.length,
      montoEstimado:        clientes.reduce((s, c) => s + Number(c.montoTotal), 0),
      clientesConRezagadas: clientes.length,
      tendenciaGuias:       0,
      tendenciaFactEst:     0,
      tendenciaClientes:    0,
    }))
  }

  // Período actual — buscar rezagadas del mes anterior en paralelo
  const anteriorPeriodo = periodoToYYYYMM('anterior')
  const anteriorFetch = backendFetch<ClienteConGuiasDto[]>(`/empresas/${empkey}/clientes`, {
    params: { periodo: anteriorPeriodo },
  }).catch(() => [] as ClienteConGuiasDto[])

  return Promise.all([mainFetch, anteriorFetch]).then(([clientes, clientesAnterior]) => ({
    totalGuias:           clientes.reduce((s, c) => s + c.cantidadGuias, 0),
    clientesActivos:      clientes.length,
    factEst:              clientes.length,
    montoEstimado:        clientes.reduce((s, c) => s + Number(c.montoTotal), 0),
    clientesConRezagadas: clientesAnterior.filter((c) => c.cantidadGuias > 0).length,
    tendenciaGuias:       0,
    tendenciaFactEst:     0,
    tendenciaClientes:    0,
  }))
}

export function assignReglaCliente(
  rut: string,
  reglaidl: string,
  opciones?: { recomputar: boolean; periodo?: string },
): Promise<void> {
  const { empkey } = getContext()
  return backendFetch(`/empresas/${empkey}/clientes/${rut}/regla`, {
    method: 'PUT',
    body: { reglaidl, ...opciones },
  })
}

export function fetchReglasPorCliente(rut: string): Promise<ReglaCliente[]> {
  const { empkey } = getContext()
  return backendFetch<ReglaCliente[]>(`/empresas/${empkey}/clientes/${rut}/reglas`)
}

export function activarReglaCliente(rut: string, reglaidl: string): Promise<void> {
  const { empkey } = getContext()
  return backendFetch(`/empresas/${empkey}/clientes/${rut}/reglas/${reglaidl}/activar`, {
    method: 'PUT',
  })
}
