import { useMemo, useRef } from 'react'
import { Color, DoubleSide } from 'three'
import type { Group } from 'three'
import { useFrame } from '@react-three/fiber'
import { RoundedBox, Text } from '@react-three/drei'
import { SERIF } from './BrandMark'
import { getLetteringTone } from './boxAppearance'

// Muted satin tone derived from the box hue — reads lilac-taupe on cream
// boxes like the reference, and stays in the box's family on other colors.
function useSatinTone(boxColor: string) {
  return useMemo(() => {
    const hsl = { h: 0, s: 0, l: 0 }
    new Color(boxColor).getHSL(hsl)
    return new Color().setHSL(hsl.h, 0.25, 0.42).getStyle()
  }, [boxColor])
}


// Two crossing bands over the lid: one left-to-right, one front-to-back.
// Both sit just under the foil lettering so the branding stays readable,
// and wrap down the box edges; the tray strips continue them below.
export function RibbonLid({ boxColor }: { boxColor: string }) {
  const satin = useSatinTone(boxColor)
  const material = { color: satin, metalness: 0.3, roughness: 0.35 }
  const ink = useMemo(() => getLetteringTone(boxColor), [boxColor])
  return <group>
    <RoundedBox args={[6.2, 0.008, 0.44]} radius={0.004} smoothness={2} position={[0, 0.0925, -1.45]} renderOrder={3}>
      <meshStandardMaterial {...material} />
    </RoundedBox>
    {[-3.06, 3.06].map((x) => (
      <RoundedBox key={x} args={[0.045, 0.48, 0.44]} radius={0.015} smoothness={2} position={[x, -0.13, -1.45]} castShadow>
        <meshStandardMaterial {...material} />
      </RoundedBox>
    ))}
    <RoundedBox args={[0.44, 0.008, 4.72]} radius={0.004} smoothness={2} position={[2.28, 0.0945, 0]} renderOrder={3}>
      <meshStandardMaterial {...material} />
    </RoundedBox>
    {[-2.28, 2.28].map((z) => (
      <RoundedBox key={z} args={[0.44, 0.48, 0.045]} radius={0.015} smoothness={2} position={[2.28, -0.13, z]} castShadow>
        <meshStandardMaterial {...material} />
      </RoundedBox>
    ))}
  </group>
}


