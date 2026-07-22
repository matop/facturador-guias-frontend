import { defaultGridVariant } from './default'
import { controlRoomGridVariant } from './controlRoom'
import type { GuiasGridVariant } from './types'

// Agregar una variante nueva (issue #14/#15/#16): crear un archivo hermano que
// exporte un GuiasGridVariant y sumarlo aquí. GuiasGrid.tsx no cambia.
const GRID_VARIANTS: Record<string, GuiasGridVariant> = {
  [defaultGridVariant.key]: defaultGridVariant,
  [controlRoomGridVariant.key]: controlRoomGridVariant,
}

export function getGridVariant(key: string | undefined): GuiasGridVariant {
  return GRID_VARIANTS[key ?? 'default'] ?? defaultGridVariant
}
