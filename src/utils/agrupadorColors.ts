function srgbChannelToLinear(channel8bit: number): number {
  const c = channel8bit / 255
  return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4
}

/** WCAG relative luminance (0=black, 1=white), with per-channel gamma correction */
function relativeLuminance(hex: string): number {
  const c = hex.replace('#', '')
  const r = parseInt(c.slice(0, 2), 16)
  const g = parseInt(c.slice(2, 4), 16)
  const b = parseInt(c.slice(4, 6), 16)
  return (
    0.2126 * srgbChannelToLinear(r) +
    0.7152 * srgbChannelToLinear(g) +
    0.0722 * srgbChannelToLinear(b)
  )
}

/** Returns '#ffffff' or '#1a1a1a', whichever yields the higher WCAG contrast ratio against bg */
export function getChipTextColor(hex: string): string {
  const c = hex.replace('#', '')
  if (c.length !== 6) return '#ffffff'
  const luminance = relativeLuminance(hex)
  const contrastWhite = 1.05 / (luminance + 0.05)
  const contrastBlack = (luminance + 0.05) / 0.05
  return contrastBlack > contrastWhite ? '#1a1a1a' : '#ffffff'
}

/** @deprecated use getChipTextColor */
export function getAgrupadorTextColor(hex: string): string {
  return getChipTextColor(hex)
}
