import { describe, it, expect } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useGuiasFilters } from './useGuiasFilters'
import type { Guia } from '@/types'

const makeGuia = (overrides: Partial<Guia>): Guia => ({
  id: 'g1',
  numero: '1001',
  clienteId: 'c1',
  clienteNombre: 'Test Cliente',
  fecha: '2026-06-10',
  descripcion: 'Test',
  cantidad: 1,
  montoNeto: 1000,
  agrupadorId: 'a1',
  agrupadorCodigo: 'OC-001',
  agrupadorColor: '#dbeafe',
  agrupadorNombre: 'Orden 001',
  estado: 'pendiente',
  ...overrides,
})

const guias: Guia[] = [
  makeGuia({ id: 'g1', numero: '1001', clienteId: 'c1', fecha: '2026-06-03', agrupadorId: 'a1', agrupadorCodigo: 'OC-001', montoNeto: 1000 }),
  makeGuia({ id: 'g2', numero: '1002', clienteId: 'c1', fecha: '2026-06-05', agrupadorId: 'a1', agrupadorCodigo: 'OC-001', montoNeto: 2000 }),
  makeGuia({ id: 'g3', numero: '1003', clienteId: 'c2', fecha: '2026-06-07', agrupadorId: 'a2', agrupadorCodigo: 'OC-002', montoNeto: 3000 }),
  makeGuia({ id: 'g4', numero: '1004', clienteId: 'c1', fecha: '2026-06-10', agrupadorId: 'a2', agrupadorCodigo: 'OC-002', montoNeto: 500, descripcion: 'Material especial' }),
]

describe('useGuiasFilters', () => {
  it('returns all guias when no filters active', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    expect(result.current.guiasPreFiltradas).toHaveLength(4)
    expect(result.current.guiasFiltradas).toHaveLength(4)
  })

  it('filters by busqueda on numero', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setBusqueda('1001'))
    expect(result.current.guiasPreFiltradas.map((g) => g.id)).toEqual(['g1'])
    expect(result.current.guiasFiltradas.map((g) => g.id)).toEqual(['g1'])
  })

  it('filters by busqueda on descripcion', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setBusqueda('especial'))
    expect(result.current.guiasPreFiltradas.map((g) => g.id)).toEqual(['g4'])
  })

  it('filters by dateRange', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setDateRange({ from: '2026-06-05', to: '2026-06-07' }))
    const ids = result.current.guiasPreFiltradas.map((g) => g.id)
    expect(ids).toContain('g2')
    expect(ids).toContain('g3')
    expect(ids).not.toContain('g1')
    expect(ids).not.toContain('g4')
  })

  it('filters by agrupador (guiasFiltradas only)', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroAgrupador('a1'))
    expect(result.current.guiasPreFiltradas).toHaveLength(4) // pre-filter ignores agrupador
    expect(result.current.guiasFiltradas.map((g) => g.id)).toEqual(['g1', 'g2'])
  })

  it('setFiltroCliente resets filtroAgrupador', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroAgrupador('a1'))
    expect(result.current.filtroAgrupador).toBe('a1')
    act(() => result.current.setFiltroCliente('c2'))
    expect(result.current.filtroAgrupador).toBe('')
  })

  it('derives unique agrupadores from guiasPreFiltradas', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    const ids = result.current.agrupadores.map((a) => a.id)
    expect(ids).toContain('a1')
    expect(ids).toContain('a2')
    expect(ids).toHaveLength(2)
  })

  it('agrupadoresFiltrados searches by codigo', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setBusquedaAgrupador('OC-001'))
    expect(result.current.agrupadoresFiltrados).toHaveLength(1)
    expect(result.current.agrupadoresFiltrados[0].id).toBe('a1')
  })

  it('computes montoTotal from guiasPreFiltradas', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    expect(result.current.montoTotal).toBe(1000 + 2000 + 3000 + 500)
  })

  it('computes montoFiltrado from guiasFiltradas', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroAgrupador('a1'))
    expect(result.current.montoFiltrado).toBe(1000 + 2000)
  })

  it('hasActiveFilter is false when no filters', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    expect(result.current.hasActiveFilter).toBe(false)
  })

  it('hasActiveFilter is true when filtroCliente set', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => result.current.setFiltroCliente('c1'))
    expect(result.current.hasActiveFilter).toBe(true)
  })

  it('initialClienteId pre-fills filtroCliente', () => {
    const { result } = renderHook(() => useGuiasFilters(guias, 'c1'))
    expect(result.current.filtroCliente).toBe('c1')
  })

  it('reset clears all filters', () => {
    const { result } = renderHook(() => useGuiasFilters(guias))
    act(() => {
      result.current.setBusqueda('xyz')
      result.current.setFiltroCliente('c1')
      result.current.setFiltroAgrupador('a1')
    })
    act(() => result.current.reset())
    expect(result.current.busqueda).toBe('')
    expect(result.current.filtroCliente).toBe('')
    expect(result.current.filtroAgrupador).toBe('')
    expect(result.current.hasActiveFilter).toBe(false)
  })
})
