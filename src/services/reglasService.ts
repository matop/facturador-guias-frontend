import type { DiscoverResult, ReglaConfig, ReglaEmp, ReglaDisponible } from '@/types'
import { backendFetch, getContext } from './http'

export function fetchDiscoverCandidatos(gclirut?: string): Promise<DiscoverResult> {
  const { empkey } = getContext()
  const params: Record<string, string> = { empkey }
  if (gclirut) params.gclirut = gclirut
  return backendFetch<DiscoverResult>(`/reglas/discover`, { params })
}

export function fetchReglaActiva(): Promise<ReglaEmp[]> {
  const { empkey } = getContext()
  return backendFetch<ReglaEmp[]>(`/reglas/empresa/${empkey}`)
}

export function activarRegla(config: ReglaConfig): Promise<ReglaEmp> {
  const { empkey } = getContext()
  return backendFetch<ReglaEmp>(`/reglas/activar`, {
    method: 'POST',
    body: { empkey, config },
  })
}

export function fetchReglasEmpresa(): Promise<ReglaDisponible[]> {
  const { empkey } = getContext()
  return backendFetch<ReglaDisponible[]>(`/empresas/${empkey}/reglas`)
}

export function updateReglanombre(reglaidl: string, reglanombre: string): Promise<void> {
  const { empkey } = getContext()
  return backendFetch(`/empresas/${empkey}/reglas/${reglaidl}`, {
    method: 'PATCH',
    body: { reglanombre },
  })
}
