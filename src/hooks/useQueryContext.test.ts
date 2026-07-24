import { describe, it, expect, beforeEach } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import { useQueryContext } from './useQueryContext'
import { usePeriodoStore } from '@/store/periodoStore'
import { useTenantStore } from '@/store/tenantStore'

beforeEach(() => {
  useTenantStore.setState({ tenantId: '977', tenantNombre: 'Test' })
  usePeriodoStore.setState({ periodo: 'actual' })
})

describe('useQueryContext', () => {
  it('devuelve tenant y período activos', () => {
    const { result } = renderHook(() => useQueryContext())
    expect(result.current).toEqual({ tenantId: '977', periodo: 'actual' })
  })

  it('mantiene la misma referencia mientras tenant y período no cambien', () => {
    const { result, rerender } = renderHook(() => useQueryContext())
    const first = result.current
    rerender()
    expect(result.current).toBe(first)
  })

  it('devuelve una referencia nueva al cambiar el período', () => {
    const { result } = renderHook(() => useQueryContext())
    const first = result.current

    act(() => usePeriodoStore.setState({ periodo: 'anterior' }))

    expect(result.current).not.toBe(first)
    expect(result.current.periodo).toBe('anterior')
  })

  it('devuelve una referencia nueva al cambiar la tenant', () => {
    const { result } = renderHook(() => useQueryContext())
    const first = result.current

    act(() => useTenantStore.setState({ tenantId: '123' }))

    expect(result.current).not.toBe(first)
    expect(result.current.tenantId).toBe('123')
  })
})
