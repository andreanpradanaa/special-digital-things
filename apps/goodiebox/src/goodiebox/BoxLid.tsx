import { RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useRef } from 'react'
import type { Group } from 'three'
import type { BoxTheme } from './types'
import { BotanicalPrint } from './BotanicalPrint'
import { PaperMaterial } from './PaperMaterial'
import { ClothHinge } from './ClothHinge'
import { RibbonLid } from './Ribbon'
import { BOX } from './boxDimensions'
import { getBoxTones } from './boxAppearance'
import { LidTopBrand } from './BrandMark'
import caveatUrl from '@fontsource/caveat/files/caveat-latin-600-normal.woff?url'

const OPEN_ANGLE = BOX.openAngle

export function BoxLid({ color, theme = 'botanical', open, recipientName, innerNote = '', onToggle, showRibbon = false }: { color: string; theme?: BoxTheme; open: boolean; recipientName: string; innerNote?: string; onToggle?: () => void; showRibbon?: boolean }) {
  const hinge = useRef<Group>(null)
  const tones = getBoxTones(color)
  // Catatan di bagian dalam tutup — default personal dengan nama penerima.
  const note = innerNote.trim() || `Special Gift For You${recipientName ? ` ${recipientName}` : ''}`
  useFrame((_, delta) => {
    if (!hinge.current) return
    const target = open ? OPEN_ANGLE : 0
    hinge.current.rotation.x += (target - hinge.current.rotation.x) * (1 - Math.exp(-delta * 3.4))
  })
  return (
    <group>
    <ClothHinge lid={hinge} color={color} />
    <group ref={hinge} position={[0, BOX.hingeY, BOX.hingeZ]}>
      {/* The lid extends forward from the hinge; its origin never moves from the rear wall. */}
      <group position={[0, 0.09, -BOX.hingeZ]} onClick={onToggle}>
        <RoundedBox args={[BOX.lidWidth, 0.18, BOX.lidDepth]} radius={0.025} smoothness={3} castShadow receiveShadow>
          <PaperMaterial color={color} />
        </RoundedBox>
        {/* The cover's apron overlaps the body with clearance on all three sides. */}
        <RoundedBox args={[BOX.lidWidth, 0.32, 0.1]} radius={0.014} smoothness={3} position={[0, -0.25, -2.28]} castShadow receiveShadow>
          <PaperMaterial color={color} />
        </RoundedBox>
        {[-1, 1].map((side) => <RoundedBox key={side} args={[0.1, 0.32, 4.56]} radius={0.014} smoothness={3} position={[side * 3.04, -0.25, 0.05]} castShadow receiveShadow>
          <PaperMaterial color={color} />
        </RoundedBox>)}
        {showRibbon && <RibbonLid boxColor={color} />}
        {/* A wrapped inset panel and small foil-edged label give the lid a finished face. */}
        <RoundedBox args={[5.98, 0.006, 4.48]} radius={0.003} smoothness={3} position={[0, 0.091, 0]} receiveShadow>
          <PaperMaterial color={tones.top} />
        </RoundedBox>
        <BotanicalPrint theme={theme} color={color} width={5.88} height={4.38} opacity={0.5} density={30} seed={481} position={[0, 0.095, 0]} rotation={[-Math.PI / 2, 0, Math.PI]} quietRect={{ width: 3.1, height: 3.8 }} />
        <LidTopBrand color={color} />
        <RoundedBox args={[5.66, 0.018, 4.16]} radius={0.008} smoothness={2} position={[0, -0.096, 0]} receiveShadow>
          <PaperMaterial color={tones.inner} finish="lining" />
        </RoundedBox>
        <BotanicalPrint theme={theme} color={color} width={5.5} height={4.0} opacity={0.35} density={18} seed={481} position={[0, -0.107, 0]} rotation={[Math.PI / 2, 0, Math.PI]} quietRect={{ width: 3.1, height: 3.8 }} />
        {/* Catatan personal dalam font surat (Caveat), terbaca saat kotak dibuka */}
        <Text position={[0, -0.121, 0.15]} rotation={[Math.PI / 2, 0, Math.PI]} fontSize={0.34} maxWidth={4.3} color={tones.text} anchorX="center" anchorY="middle" font={caveatUrl} material-toneMapped={false} material-side={2} renderOrder={2}>{note}</Text>
      </group>
    </group>
    </group>
  )
}
