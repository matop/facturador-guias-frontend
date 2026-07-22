import type { ComponentType } from 'react'
import { GuiasDefaultView } from './DefaultView'
import { GuiasControlRoomView } from './ControlRoomView'
import type { GuiasViewProps } from './types'

interface GuiasVariantDef {
  key: string
  label: string
  View: ComponentType<GuiasViewProps>
}

// Agregar una variante nueva (issue #14/#15/#16): crear un archivo hermano
// (ej. NeoBrutalistaView.tsx) que exporte un componente GuiasViewProps y
// sumarlo aquí. Guias.tsx no cambia — lee la lista y el switch desde acá.
export const GUIAS_VARIANTS: GuiasVariantDef[] = [
  { key: 'default', label: 'Actual (Lucien)', View: GuiasDefaultView },
  { key: 'control-room', label: 'Control Room', View: GuiasControlRoomView },
]

export function getGuiasView(key: string): ComponentType<GuiasViewProps> {
  return GUIAS_VARIANTS.find((v) => v.key === key)?.View ?? GUIAS_VARIANTS[0].View
}
