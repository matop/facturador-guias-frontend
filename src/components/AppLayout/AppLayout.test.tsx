import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter, Routes, Route } from 'react-router-dom'
import AppLayout from './AppLayout'
import { usePeriodoStore } from '@/store/periodoStore'
import type { MetricasResumen } from '@/types'

vi.mock('@/services/api', () => ({
  fetchMetricas: vi.fn().mockResolvedValue({
    totalGuias: 38,
    clientesActivos: 9,
    factEst: 9,
    montoEstimado: 15000000,
    clientesConRezagadas: 0,
    tendenciaGuias: 0,
    tendenciaFactEst: 0,
    tendenciaClientes: 0,
  } satisfies MetricasResumen),
}))

function renderWithRouter(initialPath = '/clientes') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <Routes>
        <Route element={<AppLayout />}>
          <Route path="/clientes" element={<div>Clientes page</div>} />
          <Route path="/guias" element={<div>Guías page</div>} />
        </Route>
      </Routes>
    </MemoryRouter>,
  )
}

describe('AppLayout', () => {
  beforeEach(() => {
    usePeriodoStore.setState({ periodo: 'actual' })
  })

  it('renders sidebar with brand name', () => {
    renderWithRouter()
    expect(screen.getByText('Facturador de Guías')).toBeInTheDocument()
  })

  it('renders sidebar subtitle', () => {
    renderWithRouter()
    expect(screen.getByText(/gestión de guías/i)).toBeInTheDocument()
  })

  it('shows Clientes nav link', () => {
    renderWithRouter()
    expect(screen.getByRole('link', { name: /clientes/i })).toBeInTheDocument()
  })

  it('shows Guías nav link', () => {
    renderWithRouter()
    expect(screen.getByRole('link', { name: /guías/i })).toBeInTheDocument()
  })

  it('marks Clientes link as active when on /clientes', () => {
    renderWithRouter('/clientes')
    const link = screen.getByRole('link', { name: /clientes/i })
    expect(link.className).toMatch(/bg-primary/)
  })

  it('renders the outlet (child page content)', () => {
    renderWithRouter('/clientes')
    expect(screen.getByText('Clientes page')).toBeInTheDocument()
  })

  it('renders header with Facturar Global button', () => {
    renderWithRouter()
    expect(screen.getByRole('button', { name: /facturar global/i })).toBeInTheDocument()
  })

  it('renders header metric pills', () => {
    renderWithRouter()
    expect(screen.getByTestId('header-metric-guias')).toBeInTheDocument()
    expect(screen.getByTestId('header-metric-facturas')).toBeInTheDocument()
    expect(screen.getByTestId('header-metric-clientes')).toBeInTheDocument()
  })
})
