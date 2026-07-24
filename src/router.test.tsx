import { describe, it, expect, vi } from 'vitest'
import { screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router-dom'
import { renderWithQuery } from '@/test/renderWithQuery'
import AppRouter from './router'

vi.mock('@/services/api', () => ({
  fetchClientes:       vi.fn().mockResolvedValue([]),
  fetchReglaActiva:    vi.fn().mockResolvedValue([]),
  assignReglaCliente:  vi.fn().mockResolvedValue(undefined),
  fetchMetricas:       vi.fn().mockResolvedValue({ totalGuias: 0, clientesActivos: 0, factEst: 0, montoEstimado: 0, clientesConRezagadas: 0, tendenciaGuias: 0, tendenciaFactEst: 0, tendenciaClientes: 0 }),
  fetchGuias:          vi.fn().mockResolvedValue([]),
  fetchFacturas:       vi.fn().mockResolvedValue([]),
  emitirFacturas:      vi.fn().mockResolvedValue([]),
}))

function renderRouter(path: string) {
  return renderWithQuery(
    <MemoryRouter initialEntries={[path]}>
      <AppRouter />
    </MemoryRouter>,
  )
}

describe('AppRouter', () => {
  it('renders Clientes page at /clientes', () => {
    renderRouter('/clientes')
    expect(screen.getByTestId('tab-actual')).toBeInTheDocument()
  })

  it('renders Guías page at /guias', () => {
    renderRouter('/guias')
    expect(screen.getByTestId('guias-page')).toBeInTheDocument()
  })

  it('redirects / to /clientes', () => {
    renderRouter('/')
    expect(screen.getByTestId('tab-actual')).toBeInTheDocument()
  })

  it('renders Historial at /historial', () => {
    renderRouter('/historial')
    expect(screen.getByRole('heading', { name: /historial/i })).toBeInTheDocument()
  })
})
