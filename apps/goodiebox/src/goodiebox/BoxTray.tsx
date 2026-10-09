import { RoundedBox } from '@react-three/drei'
import { Path, Shape } from 'three'
import { BotanicalPrint } from './BotanicalPrint'
import { FrontWallBrand } from './BrandMark'
import type { BoxTheme } from './types'
import { INSERT_TOP } from './itemLayouts'
import { PaperMaterial } from './PaperMaterial'
import { getBoxTones } from './boxAppearance'

// A continuous ring keeps the rim and corners free of panel seams.
const shell = new Shape()
shell.moveTo(-2.98, -2.23)
shell.lineTo(2.98, -2.23)
shell.lineTo(2.98, 2.23)
shell.lineTo(-2.98, 2.23)
shell.closePath()
const cavity = new Path()
cavity.moveTo(-2.86, -2.11)
cavity.lineTo(-2.86, 2.11)
cavity.lineTo(2.86, 2.11)
cavity.lineTo(2.86, -2.11)
cavity.closePath()
shell.holes.push(cavity)
const shellOptions = { depth: 1.58, steps: 1, bevelEnabled: true, bevelSegments: 3, bevelSize: 0.02, bevelThickness: 0.02, curveSegments: 1 }

export function BoxTray({ color, theme = 'botanical' }: { color: string; theme?: BoxTheme }) {
  const tones = getBoxTones(color)
  return <group>
    <RoundedBox args={[5.94, 0.18, 4.44]} radius={0.018} smoothness={3} position={[0, 0.09, 0]} castShadow receiveShadow>
      <PaperMaterial color={color} />
    </RoundedBox>
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0.02, 0]} castShadow receiveShadow>
      <extrudeGeometry args={[shell, shellOptions]} />
      <PaperMaterial color={color} />
    </mesh>
    {/* Thin paper linings end below the rim, leaving the wrapped board edge visible. */}
    {[-1, 1].map((side) => <group key={side}>
      <RoundedBox args={[5.67, 0.46, 0.012]} radius={0.005} smoothness={2} position={[0, 1.35, side * 2.107]} receiveShadow>
        <PaperMaterial color={tones.wallLining} finish="lining" />
      </RoundedBox>
      <RoundedBox args={[0.012, 0.46, 4.2]} radius={0.005} smoothness={2} position={[side * 2.857, 1.35, 0]} receiveShadow>
        <PaperMaterial color={tones.wallLining} finish="lining" />
      </RoundedBox>
    </group>)}
    <RoundedBox args={[5.69, INSERT_TOP - 0.18, 4.19]} radius={0.018} smoothness={3} position={[0, (INSERT_TOP + 0.18) / 2, 0]} receiveShadow>
      <PaperMaterial color={tones.lining} finish="lining" />
    </RoundedBox>
    <BotanicalPrint theme={theme} color={color} width={3.96} height={0.88} opacity={0.42} density={6} seed={824} position={[-3.001, 0.9, 0]} rotation={[0, Math.PI / 2, 0]} />
    <BotanicalPrint theme={theme} color={color} width={3.96} height={0.88} opacity={0.42} density={6} seed={517} position={[3.001, 0.9, 0]} rotation={[0, Math.PI / 2, 0]} />
    <FrontWallBrand color={color} />
  </group>
}
