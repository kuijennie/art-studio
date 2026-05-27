export function darkenHex(hex: string, factor = 0.55): string {
  const h = hex.replace('#', '')
  const r = Math.round(parseInt(h.slice(0, 2), 16) * factor)
  const g = Math.round(parseInt(h.slice(2, 4), 16) * factor)
  const b = Math.round(parseInt(h.slice(4, 6), 16) * factor)
  return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`
}

export function buildSpotlightGradient(tint: string): string {
  const darker = darkenHex(tint, 0.52)
  return `radial-gradient(ellipse at 50% 35%, ${tint} 0%, ${darker} 25%, #0a0a0a 75%, #000000 100%)`
}

const DEFAULT_BG = 'radial-gradient(ellipse 160% 120% at 70% 10%, #2a5f9e 0%, #1a3f72 20%, #0f2347 45%, #081530 70%, #04091c 100%)'

export function getPageBackground(tint: string | null): string {
  if (!tint) return DEFAULT_BG
  return buildSpotlightGradient(tint)
}
