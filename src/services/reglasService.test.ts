import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./http', () => ({
  backendFetch: vi.fn(),
  getContext: vi.fn(() => ({ empkey: '977', periodo: '2026-05' })),
}))

import * as http from './http'
import { fetchDiscoverCandidatos, updateReglanombre, fetchReglasEmpresa } from './reglasService'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(http.getContext).mockReturnValue({ empkey: '977', periodo: '2026-05' })
})

describe('fetchDiscoverCandidatos', () => {
  it('sin gclirut llama /reglas/discover solo con empkey', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue({ empkey: '977', muestraGuias: 0, candidatos: [] })
    await fetchDiscoverCandidatos()
    expect(http.backendFetch).toHaveBeenCalledWith('/reglas/discover', { params: { empkey: '977' } })
  })

  it('con gclirut agrega param gclirut a la llamada', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue({ empkey: '977', muestraGuias: 0, candidatos: [] })
    await fetchDiscoverCandidatos('77004250-K')
    expect(http.backendFetch).toHaveBeenCalledWith('/reglas/discover', {
      params: { empkey: '977', gclirut: '77004250-K' },
    })
  })
})

describe('fetchReglasEmpresa', () => {
  it('llama GET /empresas/:empkey/reglas y retorna lista de reglas', async () => {
    const mockReglas = [{ reglaIdl: 'r1', reglaDesc: 'Por OC' }]
    vi.mocked(http.backendFetch).mockResolvedValue(mockReglas)
    const result = await fetchReglasEmpresa()
    expect(http.backendFetch).toHaveBeenCalledWith('/empresas/977/reglas')
    expect(result).toEqual(mockReglas)
  })
})

describe('updateReglanombre', () => {
  it('llama PATCH /empresas/:empkey/reglas/:reglaidl con reglanombre', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue(undefined)
    await updateReglanombre('977_campo_receptor_CmnaRecep', 'Por comuna')
    expect(http.backendFetch).toHaveBeenCalledWith(
      '/empresas/977/reglas/977_campo_receptor_CmnaRecep',
      { method: 'PATCH', body: { reglanombre: 'Por comuna' } },
    )
  })
})
