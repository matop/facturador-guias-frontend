import type { ComponentType } from 'react'
import { GuiasDefaultView } from './DefaultView'
import { GuiasControlRoomView } from './ControlRoomView'
import { GuiasNeoBrutalistaView } from './NeoBrutalistaView'
import { GuiasGlassCriptoView } from './GlassCriptoView'
import { GuiasTerminalSiiView } from './TerminalSiiView'
import type { GuiasViewProps } from './types'

interface GuiasVariantDef {
  key: string
  label: string
  View: ComponentType<GuiasViewProps>
}

// Agregar una variante nueva: crear un archivo hermano (ej. XView.tsx) que
// exporte un componente GuiasViewProps y sumarlo aquí. Guias.tsx no cambia —
// lee la lista y el switch desde acá.
export const GUIAS_VARIANTS: GuiasVariantDef[] = [
  { key: 'default', label: 'Actual (Lucien)', View: GuiasDefaultView },
  { key: 'control-room', label: 'Control Room', View: GuiasControlRoomView },
  { key: 'neo-brutalista', label: 'Neo-Brutalismo Fiscal', View: GuiasNeoBrutalistaView },
  { key: 'glass-cripto', label: 'Glassmorphism Cripto', View: GuiasGlassCriptoView },
  { key: 'terminal-sii', label: 'Terminal SII', View: GuiasTerminalSiiView },
]

export function getGuiasView(key: string): ComponentType<GuiasViewProps> {
  return GUIAS_VARIANTS.find((v) => v.key === key)?.View ?? GUIAS_VARIANTS[0].View
}
