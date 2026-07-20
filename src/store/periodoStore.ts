import { create } from 'zustand'
import type { Periodo } from '@/types'

interface PeriodoState {
  periodo: Periodo
  setPeriodo: (p: Periodo) => void
  initPeriodo: (tieneRezagadas: boolean) => void
}

export const usePeriodoStore = create<PeriodoState>((set) => ({
  periodo: 'actual',
  setPeriodo: (p) => set({ periodo: p }),
  initPeriodo: (tieneRezagadas) =>
    set({ periodo: tieneRezagadas ? 'anterior' : 'actual' }),
}))
