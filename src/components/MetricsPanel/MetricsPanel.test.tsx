import { render, screen, waitFor } from '@testing-library/react'
import { describe, it, expect, vi, beforeEach } from 'vitest'
import { MetricsPanel } from './MetricsPanel'

vi.mock('@/services/api', () => ({
  fetchMetricas: vi.fn(),
}))

const mockData = {
  totalGuias: 98,
  clientesActivos: 6,
  factEst: 14,
  montoEstimado: 76000000,
  clientesConRezagadas: 4,
  tendenciaGuias: 12,
  tendenciaFactEst: 8,
  tendenciaClientes: 1,
}

describe('MetricsPanel', () => {
  beforeEach(async () => {
    const { fetchMetricas } = await import('@/services/api')
    vi.mocked(fetchMetricas).mockResolvedValue(mockData)
  })

  describe('estado de carga', () => {
    it('muestra un indicador de carga mientras fetch está en progreso', () => {
      render(<MetricsPanel />)
      expect(screen.getByRole('status')).toBeInTheDocument()
    })
  })

  describe('datos cargados', () => {
    it('muestra el valor totalGuias (98)', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('98')).toBeInTheDocument()
      })
    })

    it('muestra el valor clientesActivos (6)', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('6')).toBeInTheDocument()
      })
    })

    it('muestra el monto estimado formateado ($76,0M)', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('$76,0M')).toBeInTheDocument()
      })
    })

    it('muestra la etiqueta "Total guías pendientes"', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('Total guías pendientes')).toBeInTheDocument()
      })
    })

    it('muestra la etiqueta "Clientes involucrados"', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('Clientes involucrados')).toBeInTheDocument()
      })
    })

    it('muestra la etiqueta "Estimación a facturar"', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('Estimación a facturar')).toBeInTheDocument()
      })
    })

    it('muestra subtítulo con clientes con rezagadas', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('4 con rezagadas del mes anterior')).toBeInTheDocument()
      })
    })

    it('muestra subtítulo con facturas proyectadas', async () => {
      render(<MetricsPanel />)
      await waitFor(() => {
        expect(screen.getByText('~14 facturas proyectadas')).toBeInTheDocument()
      })
    })
  })
})
