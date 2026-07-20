import { describe, it, expect, vi, beforeEach } from 'vitest'
import type { ReglaCliente } from '@/types'

vi.mock('./http', () => ({
  backendFetch: vi.fn(),
  getContext: vi.fn(() => ({ empkey: '977', periodo: '2026-05' })),
}))

import * as http from './http'
import { fetchReglasPorCliente, activarReglaCliente, assignReglaCliente } from './clientesService'

const mockReglas: ReglaCliente[] = [
  {
    reglaidl: '977_campo_receptor_CmnaRecep',
    empkey: '977',
    gclirut: '76543210-K',
    activa: true,
    reglanombre: 'Por comuna',
    reglaconfig: { type: 'campo-receptor', field: 'CmnaRecep' },
  },
  {
    reglaidl: '977_campo_detalle_OBRA_Valor',
    empkey: '977',
    gclirut: '76543210-K',
    activa: false,
    reglanombre: null,
    reglaconfig: { type: 'campo-detalle', lineFilter: 'OBRA', key: 'Valor' },
  },
]

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(http.getContext).mockReturnValue({ empkey: '977', periodo: '2026-05' })
})

describe('fetchReglasPorCliente', () => {
  it('llama GET /empresas/:empkey/clientes/:rut/reglas', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(mockReglas)
    const result = await fetchReglasPorCliente('76543210-K')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/reglas',
    )
    expect(result).toEqual(mockReglas)
  })
})

describe('assignReglaCliente', () => {
  it('llama PUT /regla sin opciones', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await assignReglaCliente('76543210-K', 'regla_A')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/regla',
      { method: 'PUT', body: { reglaidl: 'regla_A' } },
    )
  })

  it('llama PUT /regla con recomputar=true y periodo', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await assignReglaCliente('76543210-K', 'regla_B', { recomputar: true, periodo: '2026-05' })
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/regla',
      { method: 'PUT', body: { reglaidl: 'regla_B', recomputar: true, periodo: '2026-05' } },
    )
  })

  it('llama PUT /regla con recomputar=false (sin periodo)', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await assignReglaCliente('76543210-K', 'regla_B', { recomputar: false })
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/regla',
      { method: 'PUT', body: { reglaidl: 'regla_B', recomputar: false } },
    )
  })
})

describe('activarReglaCliente', () => {
  it('llama PUT /empresas/:empkey/clientes/:rut/reglas/:reglaidl/activar', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await activarReglaCliente('76543210-K', '977_campo_receptor_CmnaRecep')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/clientes/76543210-K/reglas/977_campo_receptor_CmnaRecep/activar',
      { method: 'PUT' },
    )
  })
})
