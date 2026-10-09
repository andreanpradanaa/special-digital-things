import { useMemo } from 'react'
import { Color, MeshBasicMaterial, MeshStandardMaterial } from 'three'
import { Text } from '@react-three/drei'
import serifUrl from '@fontsource/playfair-display/files/playfair-display-latin-400-normal.woff?url'
import serifMediumUrl from '@fontsource/playfair-display/files/playfair-display-latin-500-normal.woff?url'
import serifSemiboldUrl from '@fontsource/playfair-display/files/playfair-display-latin-600-normal.woff?url'
import { getLetteringTone } from './boxAppearance'
import { SprigEmblem } from './BotanicalPrint'

// Foil-stamped lettering, Playfair Display, matching the reference box.
// Fonts ship with the bundle (no CDN). Each glyph stack renders as a
// letterpress deboss: a dark edge above, a paper highlight below, and a
// metallic foil face on top that catches the scene environment.
export const GOLD_FOIL = '#a8824e'
export const SERIF = serifUrl
export const SERIF_MEDIUM = serifMediumUrl
export const SERIF_SEMIBOLD = serifSemiboldUrl

const MAIN_LINES = ['A BRIGHTER', 'KINDER', 'YOU'] as const

type Face = 'top' | 'interior'

// Offsets scale with fontSize so small lines stay crisp (fixed world offsets
// made small taglines read as a double image).
function debossOffsets(fontSize: number) {
  return {
    shadow: [0, fontSize * 0.02, -0.002] as [number, number, number],
    highlight: [0, -fontSize * 0.03, 0] as [number, number, number],
    main: [0, -fontSize * 0.01, 0.003] as [number, number, number],
  }
}

function EmbossText({ color, font, position, rotation, fontSize, letterSpacing, children }: {
  color: string
  font: string
  position: [number, number, number]
  rotation: [number, number, number]
  fontSize: number
  letterSpacing: number
  children: string
}) {
  const materials = useMemo(() => {
    const ink = new Color(color)
    return {
      shadow: new MeshBasicMaterial({ color: ink.clone().multiplyScalar(0.55), toneMapped: false }),
      highlight: new MeshBasicMaterial({ color: ink.clone().lerp(new Color('#ffffff'), 0.55), transparent: true, opacity: 0.75, toneMapped: false }),
      main: new MeshStandardMaterial({
        color: ink,
        metalness: 0.4,
        roughness: 0.45,
        emissive: ink,
        emissiveIntensity: 0.22,
        toneMapped: false,
      }),
    }
  }, [color])
  const offsets = debossOffsets(fontSize)
  return <group position={position} rotation={rotation}>
    <Text
      position={offsets.shadow}
      fontSize={fontSize}
      letterSpacing={letterSpacing}
      font={font}
      anchorX="center"
      anchorY="middle"
      material={materials.shadow}
      renderOrder={1}
    >{children}</Text>
    <Text
      position={offsets.highlight}
      fontSize={fontSize}
      letterSpacing={letterSpacing}
      font={font}
      anchorX="center"
      anchorY="middle"
      material={materials.highlight}
      renderOrder={1}
    >{children}</Text>
    <Text
      position={offsets.main}
      fontSize={fontSize}
      letterSpacing={letterSpacing}
      font={font}
      anchorX="center"
      anchorY="middle"
      material={materials.main}
      renderOrder={2}
    >{children}</Text>
  </group>
}

// The stacked brand lockup: sprig, three main lines, a short rule, and the
// two taglines. The interior face flips z because +z runs toward the hinge
// (bottom of the panel as seen by the reader), the top face runs the other way.
function BrandStack({ face, ink }: { face: Face; ink: string }) {
  const top = face === 'top'
  const sign = top ? 1 : -1
  const textY = top ? 0.102 : -0.111
  const rotation: [number, number, number] = top ? [-Math.PI / 2, 0, Math.PI] : [Math.PI / 2, 0, Math.PI]
  const mainZ = [0.525, 0.185, -0.155]
  return <group>
    <SprigEmblem ink={ink} width={top ? 0.4 : 0.36} position={[0, textY, sign * 0.925]} rotation={rotation} />
    {MAIN_LINES.map((line, index) => <EmbossText
      key={line}
      color={ink}
      font={SERIF_SEMIBOLD}
      position={[0, textY, sign * mainZ[index]]}
      rotation={rotation}
      fontSize={0.4}
      letterSpacing={0.16}
    >{line}</EmbossText>)}
    <mesh position={[0, top ? 0.101 : -0.113, sign * -0.435]} rotation={rotation} renderOrder={2}>
      <planeGeometry args={[1.15, 0.014]} />
      <meshBasicMaterial color={ink} toneMapped={false} />
    </mesh>
    <EmbossText color={ink} font={SERIF_SEMIBOLD} position={[0, textY, sign * -0.815]} rotation={rotation} fontSize={0.125} letterSpacing={1.1}>THOUGHTFUL GIFTS</EmbossText>
    <EmbossText color={ink} font={SERIF_SEMIBOLD} position={[0, textY, sign * -1.075]} rotation={rotation} fontSize={0.125} letterSpacing={1.35}>BRIGHTER DAYS</EmbossText>
  </group>
}

// All lettering follows the box color via the adaptive ink tone.
export function LidTopBrand({ color }: { color: string }) {
  return <BrandStack face="top" ink={getLetteringTone(color)} />
}

// Interior lettering follows the box color via the adaptive ink tone.
export function LidInteriorBrand({ color }: { color: string }) {
  return <BrandStack face="interior" ink={getLetteringTone(color)} />
}

// Front-wall lockup: maker mark with a wide-tracked shop name. Centered on
// the wall; the shortened apron (bottom ~y 1.24) still leaves it fully
// visible when closed. z sits proud of the outer wall face to avoid z-fighting.
export function FrontWallBrand({ color }: { color: string }) {
  const ink = getLetteringTone(color)
  return <group rotation={[0, Math.PI, 0]} position={[0, 0, -2.256]}>
    <SprigEmblem ink={ink} width={0.28} position={[0, 1.02, 0]} />
    <EmbossText color={ink} position={[0, 0.68, 0]} rotation={[0, 0, 0]} fontSize={0.185} letterSpacing={0.34} font={SERIF_SEMIBOLD}>THE GOOD GIFT CO.</EmbossText>
    <EmbossText color={ink} position={[0, 0.42, 0]} rotation={[0, 0, 0]} fontSize={0.09} letterSpacing={0.72} font={SERIF_SEMIBOLD}>KIND PEOPLE BRIGHTER DAYS</EmbossText>
  </group>
}
