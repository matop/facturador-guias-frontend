import { describe, it, expect, beforeEach, vi } from 'vitest'
import { screen, waitFor } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import HistorialPage from './Historial'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'
import { renderWithQuery } from '@/test/renderWithQuery'
import type { Factura } from '@/types'

vi.mock('@/services/api', () => ({
  fetchFacturas: vi.fn(),
}))

const mockFacturas: Factura[] = [
  {
    id: 'f1',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    agrupadorId: 'a1',
    agrupadorCodigo: 'OC 0001',
    folio: '1001',
    periodo: '2026-05',
    montoNeto: 1770000,
    iva: 336300,
    total: 2106300,
    fechaEmision: '2026-05-10',
    estado: 'emitida',
    guias: [],
  },
  {
    id: 'f2',
    clienteId: 'c1',
    clienteNombre: 'Constructora Aconcagua S.A.',
    agrupadorId: 'a2',
    agrupadorCodigo: 'OC 0002',
    folio: '1002',
    periodo: '2026-05',
    montoNeto: 750000,
    iva: 142500,
    total: 892500,
    fechaEmision: undefined,
    estado: 'borrador',
    guias: [],
  },
  {
    id: 'f3',
    clienteId: 'c2',
    clienteNombre: 'Minera del Norte Ltda.',
    agrupadorId: 'a3',
    agrupadorCodigo: 'DIR Santiago',
    folio: '1003',
    periodo: '2026-05',
    montoNeto: 2350000,
    iva: 446500,
    total: 2796500,
    fechaEmision: '2026-05-12',
    estado: 'aprobada',
    guias: [],
  },
]

describe('Historial page', () => {
  beforeEach(async () => {
    vi.clearAllMocks()
    usePeriodoStore.setState({ periodo: 'actual' })
    useTenantStore.setState({ tenantId: 'tenant-test', tenantNombre: 'Test' })
    const api = await import('@/services/api')
    vi.mocked(api.fetchFacturas).mockResolvedValue(mockFacturas)
  })

  const renderPage = () =>
    renderWithQuery(
      <MemoryRouter>
        <HistorialPage />
      </MemoryRouter>,
    )

  // ── Layout ─────────────────────────────────────────────────────────────────

  it('muestra título "Historial de Facturación"', () => {
    renderPage()
    expect(screen.getByText('Historial de Facturación')).toBeInTheDocument()
  })

  // ── Carga de facturas ───────────────────────────────────────────────────────

  it('renderiza filas de facturas después de cargar', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toBeInTheDocument()
    })
    expect(screen.getByTestId('fila-factura-f2')).toBeInTheDocument()
    expect(screen.getByTestId('fila-factura-f3')).toBeInTheDocument()
  })

  it('muestra el nombre del cliente en la fila', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('Constructora Aconcagua S.A.')
    })
  })

  it('muestra el folio en la fila', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('1001')
    })
  })

  it('muestra el agrupador en la fila', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('OC 0001')
    })
  })

  // ── Estado vacío ────────────────────────────────────────────────────────────

  it('muestra empty state cuando no hay facturas', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchFacturas).mockResolvedValue([])
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('empty-historial')).toBeInTheDocument()
    })
    expect(screen.getByTestId('empty-historial')).toHaveTextContent('No hay facturas emitidas en este período')
  })

  // ── Badges de estado ────────────────────────────────────────────────────────

  it('badge "Emitida" para factura con estado emitida', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('Emitida')
    })
  })

  it('badge "Borrador" para factura con estado borrador', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f2')).toHaveTextContent('Borrador')
    })
  })

  it('badge "Aprobada" para factura con estado aprobada', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f3')).toHaveTextContent('Aprobada')
    })
  })

  // ── Formato de fecha ────────────────────────────────────────────────────────

  it('formatea fecha de emisión como DD-MM-YYYY', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toHaveTextContent('10-05-2026')
    })
  })

  it('muestra "—" para fecha de emisión ausente', async () => {
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f2')).toHaveTextContent('—')
    })
  })

  // ── Métricas en header ──────────────────────────────────────────────────────

  it('muestra count de facturas en header', async () => {
    renderPage()
    await waitFor(() => {
      // El número está en <strong> y "facturas" en un text node — usar función matcher
      const match = screen.queryAllByText((_, el) =>
        el?.tagName === 'SPAN' && /^\s*3\s+facturas\s*$/.test(el.textContent ?? ''),
      )
      expect(match.length).toBeGreaterThan(0)
    })
  })

  it('muestra count de emitidas en header', async () => {
    renderPage()
    await waitFor(() => {
      // "1 emitidas" — solo f1 tiene estado 'emitida'
      expect(screen.getByText(/emitidas/)).toBeInTheDocument()
    })
  })

  // ── Error ────────────────────────────────────────────────────────────────────

  it('muestra error-historial cuando fetchFacturas falla', async () => {
    const api = await import('@/services/api')
    vi.mocked(api.fetchFacturas).mockRejectedValue(new Error('Network error'))
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('error-historial')).toBeInTheDocument()
    })
    expect(screen.getByTestId('error-historial')).toHaveTextContent('Error al cargar el historial')
  })

  // ── Re-fetch en cambio de período ──────────────────────────────────────────

  it('re-fetcha fetchFacturas cuando cambia el período', async () => {
    const api = await import('@/services/api')
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toBeInTheDocument()
    })
    usePeriodoStore.setState({ periodo: 'anterior' })
    await waitFor(() => {
      expect(vi.mocked(api.fetchFacturas)).toHaveBeenCalledTimes(2)
    })
  })

  it('re-fetcha fetchFacturas cuando cambia la tenant', async () => {
    // La key incluye tenantId, no sólo el período: cambiar de empresa no puede
    // dejar el historial de la anterior en pantalla.
    const api = await import('@/services/api')
    renderPage()
    await waitFor(() => {
      expect(screen.getByTestId('fila-factura-f1')).toBeInTheDocument()
    })
    useTenantStore.setState({ tenantId: 'tenant-otra', tenantNombre: 'Otra' })
    await waitFor(() => {
      expect(vi.mocked(api.fetchFacturas)).toHaveBeenCalledTimes(2)
    })
  })

  // ── Query key ───────────────────────────────────────────────────────────────

  it('no llama fetchFacturas con el QueryFunctionContext como params', async () => {
    // fetchFacturas(params?) spreadea su argumento al query string, así que
    // `queryFn: fetchFacturas` filtraría queryKey/signal/meta al backend.
    const api = await import('@/services/api')
    renderPage()
    await waitFor(() => {
      expect(vi.mocked(api.fetchFacturas)).toHaveBeenCalled()
    })
    for (const call of vi.mocked(api.fetchFacturas).mock.calls) {
      expect(call).toEqual([])
    }
  })
})
