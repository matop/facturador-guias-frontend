import { defaultGridVariant } from './default'
import { controlRoomGridVariant } from './controlRoom'
import { neoBrutalistaGridVariant } from './neoBrutalista'
import { glassCriptoGridVariant } from './glassCripto'
import { terminalSiiGridVariant } from './terminalSii'
import type { GuiasGridVariant } from './types'

// Agregar una variante nueva: crear un archivo hermano que exporte un
// GuiasGridVariant y sumarlo aquí. GuiasGrid.tsx no cambia.
const GRID_VARIANTS: Record<string, GuiasGridVariant> = {
  [defaultGridVariant.key]: defaultGridVariant,
  [controlRoomGridVariant.key]: controlRoomGridVariant,
  [neoBrutalistaGridVariant.key]: neoBrutalistaGridVariant,
  [glassCriptoGridVariant.key]: glassCriptoGridVariant,
  [terminalSiiGridVariant.key]: terminalSiiGridVariant,
}

export function getGridVariant(key: string | undefined): GuiasGridVariant {
  return GRID_VARIANTS[key ?? 'default'] ?? defaultGridVariant
}
