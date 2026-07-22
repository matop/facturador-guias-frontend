import { describe, it, expect, vi, beforeEach } from 'vitest'

vi.mock('./http', () => ({
  backendFetch: vi.fn(),
  getContext: vi.fn(() => ({ empkey: '977', periodo: '2026-05' })),
}))

import * as http from './http'
import { fetchGuias } from './guiasService'

beforeEach(() => {
  vi.clearAllMocks()
  vi.mocked(http.getContext).mockReturnValue({ empkey: '977', periodo: '2026-05' })
})

describe('fetchGuias', () => {
  it('propaga grupo.reglaIdl a cada guía del grupo', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue([
      {
        cliente: { rut: '76.543.210-K', nombre: 'Constructora Aconcagua S.A.' },
        grupos: [
          {
            valorAgrupador: 'OC 0001',
            reglaIdl: '977_campo_receptor_CmnaRecep',
            cantidadGuias: 1,
            montoTotal: '100000',
            folios: [{ folio: '4401', fecha: '2026-05-03' }],
          },
        ],
      },
    ])

    const guias = await fetchGuias()

    expect(guias).toHaveLength(1)
    expect(guias[0].reglaIdl).toBe('977_campo_receptor_CmnaRecep')
  })

  it('mapea reglaIdl null cuando el grupo no tiene regla asignada', async () => {
    vi.mocked(http.backendFetch).mockResolvedValue([
      {
        cliente: { rut: '76.543.210-K', nombre: 'Constructora Aconcagua S.A.' },
        grupos: [
          {
            valorAgrupador: 'OC 0002',
            reglaIdl: null,
            cantidadGuias: 1,
            montoTotal: '50000',
            folios: [{ folio: '4402', fecha: '2026-05-04' }],
          },
        ],
      },
    ])

    const guias = await fetchGuias()

    expect(guias[0].reglaIdl).toBeNull()
  })
})
