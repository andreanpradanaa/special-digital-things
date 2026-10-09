import { Color } from 'three'

const WARM_PAPER = new Color('#f2e8de')
const DARK_INK = '#4a3b38'
const LIGHT_INK = '#f7eee5'

function luminance(color: Color) {
  return color.r * 0.2126 + color.g * 0.7152 + color.b * 0.0722
}

function mix(color: Color, target: Color | string, amount: number) {
  return color.clone().lerp(typeof target === 'string' ? new Color(target) : target, amount).getStyle()
}

export function getInkTone(baseColor: string) {
  const base = new Color(baseColor)
  if (luminance(base) < 0.24) return LIGHT_INK

  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl)
  base.setHSL(hsl.h, Math.min(0.46, hsl.s * 0.62 + 0.035), Math.max(0.13, hsl.l - 0.2))
  return base.getStyle()
}

// Lettering needs far more contrast than the prints: darken much further
// while keeping the box's hue so it never blends into the paper.
export function getLetteringTone(baseColor: string) {
  const base = new Color(baseColor)
  if (luminance(base) < 0.35) return LIGHT_INK
  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl)
  base.setHSL(hsl.h, Math.min(0.35, hsl.s * 0.6 + 0.03), Math.max(0.12, hsl.l - 0.55))
  return base.getStyle()
}

export function getBoxTones(baseColor: string) {
  const base = new Color(baseColor)
  const light = luminance(base) > 0.52

  return {
    outer: base.getStyle(),
    top: mix(base, WARM_PAPER, light ? 0.045 : 0.075),
    inner: mix(base, WARM_PAPER, light ? 0.14 : 0.2),
    wallLining: mix(base, WARM_PAPER, light ? 0.19 : 0.25),
    lining: mix(base, WARM_PAPER, light ? 0.3 : 0.36),
    text: light ? DARK_INK : LIGHT_INK,
  }
}

// Gift-item accents derive from the box hue so the whole set reads as one
// product: paper stays warm, but the card bodies follow the box color.
export function getItemPalette(baseColor: string) {
  const base = new Color(baseColor)
  const hsl = { h: 0, s: 0, l: 0 }
  base.getHSL(hsl)
  // Keep the picked color's character: vivid customs stay vivid (only capped
  // so pastel boxes stay pastel), and true grays get a warm neutral instead
  // of an arbitrary hue.
  const h = hsl.s < 0.08 ? 0.07 : hsl.h
  const s = Math.min(0.55, Math.max(0.15, hsl.s))
  return {
    accent: new Color().setHSL(h, Math.min(0.65, s + 0.05), 0.58).getStyle(),
    accentSoft: new Color().setHSL(h, s * 0.9, 0.84).getStyle(),
    accentDeep: new Color().setHSL(h, s * 0.95, 0.32).getStyle(),
  }
}

export function getAdaptiveBackdrop(baseColor: string) {
  const base = new Color(baseColor)
  const lightBox = luminance(base) > 0.58
  const neutral = new Color(lightBox ? '#e6e0da' : '#f2ede7')
  const halo = new Color(lightBox ? '#d8d1ca' : '#faf6f0')
  const tint = neutral.clone().lerp(base, 0.075)
  const displayColor = base.clone().convertLinearToSRGB()
  const red = Math.round(displayColor.r * 255)
  const green = Math.round(displayColor.g * 255)
  const blue = Math.round(displayColor.b * 255)

  return {
    '--scene-base': tint.getStyle(),
    '--scene-halo': halo.getStyle(),
    '--scene-wash': `rgba(${red}, ${green}, ${blue}, 0.055)`,
  }
}
