import { useEffect, useMemo } from 'react'
import { CanvasTexture, DoubleSide } from 'three'
import type { Euler, Vector3 } from 'three'
import type { BoxTheme } from './types'
import { getInkTone } from './boxAppearance'

type PrintProps = {
  theme?: BoxTheme
  color: string
  width: number
  height: number
  opacity: number
  density: number
  seed: number
  position: Vector3 | [number, number, number]
  rotation?: Euler | [number, number, number]
  renderOrder?: number
  // Centered world-unit band kept motif-free (lettering sits there).
  quietRect?: { width: number; height: number }
}

function seededRandom(seed: number) {
  let value = seed >>> 0
  return () => {
    value += 0x6d2b79f5
    let result = value
    result = Math.imul(result ^ (result >>> 15), result | 1)
    result ^= result + Math.imul(result ^ (result >>> 7), result | 61)
    return ((result ^ (result >>> 14)) >>> 0) / 4294967296
  }
}

function drawSprig(context: CanvasRenderingContext2D, x: number, y: number, angle: number, size: number, kind: number) {
  context.save()
  context.translate(x, y)
  context.rotate(angle)
  context.scale(size, size)
  context.lineWidth = 2.1
  context.lineCap = 'round'
  context.beginPath()
  context.moveTo(0, 23)
  if (kind === 1 || kind === 5) context.bezierCurveTo(-8, 10, 8, -8, 1, -27)
  else if (kind === 2 || kind === 6) context.quadraticCurveTo(2, 0, -3, -28)
  else context.quadraticCurveTo(kind % 2 ? 6 : -5, 0, 0, -26)
  context.stroke()

  const leafVariants: Array<Array<[number, number, number]>> = [
    [[-6, 13, -0.58], [7, 6, 0.65], [-7, -3, -0.58], [7, -13, 0.62]],
    [[7, 15, 0.52], [-7, 6, -0.64], [7, -5, 0.58], [-6, -15, -0.62]],
    [[-6, 14, -0.6], [6, 2, 0.6], [-5, -10, -0.55]],
    [[7, 11, 0.58], [-6, 1, -0.6], [6, -10, 0.55], [-4, -19, -0.5]],
    [[-5, 15, -0.75], [5, 9, 0.72], [-5, 3, -0.7], [5, -4, 0.7], [-4, -12, -0.7]],
    [[6, 16, 0.45], [-5, 7, -0.48], [6, -2, 0.45], [-4, -12, -0.5]],
    [[-4, 12, -0.42], [5, 2, 0.46]],
    [[5, 14, 0.72], [-6, 5, -0.72], [5, -5, 0.68], [-5, -15, -0.68]],
  ]
  const leafSets = leafVariants[kind % 8]
  leafSets.forEach(([leafX, leafY, leafAngle]) => {
    context.save()
    context.translate(leafX, leafY)
    context.rotate(leafAngle)
    context.beginPath()
    context.ellipse(0, 0, 5.1, 2.15, 0, 0, Math.PI * 2)
    context.fill()
    context.restore()
  })
  if (kind === 3 || kind === 5 || kind === 7) {
    ;[-14, -21].forEach((budY, index) => {
      context.beginPath()
      context.arc(index ? 4.5 : -4.1, budY, 2.4, 0, Math.PI * 2)
      context.fill()
    })
  }
  context.restore()
}

export function createBotanicalTexture(baseColor: string, density: number, seed: number, surfaceWidth: number, surfaceHeight: number, theme: BoxTheme = 'botanical', quietRect?: { width: number; height: number }) {
  const canvas = document.createElement('canvas')
  const aspect = surfaceWidth / surfaceHeight
  const shortSide = 512
  canvas.width = aspect >= 1 ? Math.round(shortSide * aspect) : shortSide
  canvas.height = aspect >= 1 ? shortSide : Math.round(shortSide / aspect)
  const context = canvas.getContext('2d')!
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = getInkTone(baseColor)
  context.fillStyle = getInkTone(baseColor)
  context.globalAlpha = 1

  const random = seededRandom(seed)
  const pixelsPerWorldUnit = Math.min(canvas.width / surfaceWidth, canvas.height / surfaceHeight)
  const motifScale = (pixelsPerWorldUnit * 0.27) / 50
  const margin = pixelsPerWorldUnit * 0.16
  // Centered band kept free of motifs so the foil lettering stays readable.
  // Symmetric in both axes so it works on faces with flipped orientations.
  const quietHalf = quietRect && {
    x: (quietRect.width / 2) * pixelsPerWorldUnit,
    y: (quietRect.height / 2) * pixelsPerWorldUnit,
  }
  const inQuiet = (x: number, y: number) => Boolean(quietHalf && Math.abs(x - canvas.width / 2) < quietHalf.x && Math.abs(y - canvas.height / 2) < quietHalf.y)
  if (theme === 'polkadot') {
    const spacing = pixelsPerWorldUnit * 0.38
    for (let row = 0, y = spacing / 2; y < canvas.height; row++, y += spacing) {
      for (let x = spacing / 2 + (row % 2) * spacing / 2; x < canvas.width; x += spacing) {
        if (inQuiet(x, y)) continue
        context.globalAlpha = 0.85
        context.beginPath()
        context.arc(x, y, pixelsPerWorldUnit * 0.035, 0, Math.PI * 2)
        context.fill()
      }
    }
  } else if (theme === 'stripes') {
    const spacing = pixelsPerWorldUnit * 0.32
    for (let x = spacing / 2; x < canvas.width; x += spacing) {
      context.fillRect(x, 0, pixelsPerWorldUnit * 0.012, canvas.height)
      context.fillRect(x + pixelsPerWorldUnit * 0.035, 0, pixelsPerWorldUnit * 0.006, canvas.height)
    }
  }
  for (let index = 0; theme === 'botanical' && index < density; index += 1) {
    let x = 0
    let y = 0
    let placed = false
    for (let attempt = 0; attempt < 10 && !placed; attempt += 1) {
      x = margin + random() * (canvas.width - margin * 2)
      y = margin + random() * (canvas.height - margin * 2)
      placed = !inQuiet(x, y)
    }
    if (!placed) continue
    // Faded, varied sprigs read as tone-on-tone paper art instead of wallpaper.
    context.globalAlpha = 0.5 + random() * 0.4
    drawSprig(context, x, y, (random() - 0.5) * 0.68, motifScale * (0.8 + random() * 0.3), Math.floor(random() * 8))
  }

  const texture = new CanvasTexture(canvas)
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

export function createSprigEmblemTexture(ink: string) {
  const canvas = document.createElement('canvas')
  canvas.width = 128
  canvas.height = 160
  const context = canvas.getContext('2d')!
  context.clearRect(0, 0, canvas.width, canvas.height)
  context.strokeStyle = ink
  context.fillStyle = ink
  context.lineWidth = 3.4
  drawSprig(context, canvas.width / 2, canvas.height / 2 + 8, 0, 1.55, 1)
  const texture = new CanvasTexture(canvas)
  texture.anisotropy = 4
  texture.needsUpdate = true
  return texture
}

export function SprigEmblem({ ink, width, position, rotation }: { ink: string; width: number; position: Vector3 | [number, number, number]; rotation?: Euler | [number, number, number] }) {
  const texture = useMemo(() => createSprigEmblemTexture(ink), [ink])
  useEffect(() => () => texture.dispose(), [texture])
  return <mesh position={position} rotation={rotation} renderOrder={2}>
    <planeGeometry args={[width, width * 1.25]} />
    <meshBasicMaterial map={texture} transparent depthWrite={false} toneMapped={false} />
  </mesh>
}

export function BotanicalPrint({ theme = 'botanical', color, width, height, opacity, density, seed, position, rotation, renderOrder = 1, quietRect }: PrintProps) {
  const texture = useMemo(() => createBotanicalTexture(color, density, seed, width, height, theme, quietRect), [color, density, seed, width, height, theme, quietRect])
  useEffect(() => () => texture.dispose(), [texture])
  if (theme === 'plain') return null
  return <mesh position={position} rotation={rotation} renderOrder={renderOrder}>
    <planeGeometry args={[width, height]} />
    <meshStandardMaterial map={texture} transparent opacity={opacity} side={DoubleSide} depthWrite={false} depthTest={true} roughness={0.92} polygonOffset polygonOffsetFactor={-1} />
  </mesh>
}
