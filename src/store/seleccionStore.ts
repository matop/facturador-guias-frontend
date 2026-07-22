import { create } from 'zustand'
import { getMes, esLoteHomogeneo } from '@/utils/loteHomogeneo'
import type { Guia } from '@/types'

interface SeleccionState {
  seleccionActiva: Guia[]
  agregar: (guia: Guia) => void
  quitar: (guiaId: string) => void
  limpiar: () => void
  agregarLote: (guias: Guia[]) => void
  clienteActivoId: () => string | null
  mesActivo: () => string | null
}

export const useSeleccionStore = create<SeleccionState>((set, get) => ({
  seleccionActiva: [],

  agregar: (guia) => {
    set((state) => {
      if (state.seleccionActiva.some((g) => g.id === guia.id)) {
        return state
      }
      if (state.seleccionActiva.length > 0) {
        const clienteExistente = state.seleccionActiva[0].clienteId
        const mesExistente = getMes(state.seleccionActiva[0].fecha)
        if (guia.clienteId !== clienteExistente || getMes(guia.fecha) !== mesExistente) {
          return state
        }
      }
      return { seleccionActiva: [...state.seleccionActiva, guia] }
    })
  },

  quitar: (guiaId) => {
    set((state) => ({
      seleccionActiva: state.seleccionActiva.filter((g) => g.id !== guiaId),
    }))
  },

  limpiar: () => {
    set({ seleccionActiva: [] })
  },

  agregarLote: (guias) => {
    set((state) => {
      if (guias.length === 0) return state

      const clienteLote = guias[0].clienteId
      const mesLote = getMes(guias[0].fecha)

      if (!esLoteHomogeneo(guias)) return state

      if (state.seleccionActiva.length > 0) {
        const clienteExistente = state.seleccionActiva[0].clienteId
        const mesExistente = getMes(state.seleccionActiva[0].fecha)
        if (clienteLote !== clienteExistente || mesLote !== mesExistente) return state
      }

      const idsExistentes = new Set(state.seleccionActiva.map((g) => g.id))
      const nuevas = guias.filter((g) => !idsExistentes.has(g.id))

      return { seleccionActiva: [...state.seleccionActiva, ...nuevas] }
    })
  },

  clienteActivoId: () => {
    const { seleccionActiva } = get()
    return seleccionActiva.length === 0 ? null : seleccionActiva[0].clienteId
  },

  mesActivo: () => {
    const { seleccionActiva } = get()
    return seleccionActiva.length === 0 ? null : getMes(seleccionActiva[0].fecha)
  },
}))
