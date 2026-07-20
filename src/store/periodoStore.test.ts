import { describe, it, expect, beforeEach } from 'vitest'
import { usePeriodoStore } from './periodoStore'

describe('periodoStore', () => {
  beforeEach(() => {
    usePeriodoStore.setState({ periodo: 'actual' })
  })

  describe('estado inicial', () => {
    it('periodo empieza en "actual"', () => {
      const { periodo } = usePeriodoStore.getState()
      expect(periodo).toBe('actual')
    })
  })

  describe('setPeriodo', () => {
    it('cambia periodo a "anterior"', () => {
      usePeriodoStore.getState().setPeriodo('anterior')
      expect(usePeriodoStore.getState().periodo).toBe('anterior')
    })

    it('cambia periodo a "actual"', () => {
      usePeriodoStore.setState({ periodo: 'anterior' })
      usePeriodoStore.getState().setPeriodo('actual')
      expect(usePeriodoStore.getState().periodo).toBe('actual')
    })
  })

  describe('initPeriodo', () => {
    it('si tieneRezagadas es true, periodo queda en "anterior"', () => {
      usePeriodoStore.getState().initPeriodo(true)
      expect(usePeriodoStore.getState().periodo).toBe('anterior')
    })

    it('si tieneRezagadas es false, periodo queda en "actual"', () => {
      usePeriodoStore.setState({ periodo: 'anterior' })
      usePeriodoStore.getState().initPeriodo(false)
      expect(usePeriodoStore.getState().periodo).toBe('actual')
    })
  })
})
