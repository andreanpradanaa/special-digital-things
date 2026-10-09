import { useFrame } from '@react-three/fiber'
import { useEffect, useMemo } from 'react'
import type { RefObject } from 'react'
import { BufferAttribute, BufferGeometry } from 'three'
import type { Group } from 'three'
import { BOX } from './boxDimensions'
import { PaperMaterial } from './PaperMaterial'

export function hingeSection(t: number, angle: number): [number, number] {
  const endY = BOX.hingeY + 0.055 * Math.sin(angle)
  const endZ = BOX.hingeZ - 0.055 * Math.cos(angle)
  // Bezier control points sit just below and just behind the hinge axis.
  const a = 1 - t
  return [a * a * (BOX.hingeY - 0.145) + 2 * a * t * (BOX.hingeY - 0.005) + t * t * endY,
    a * a * (BOX.hingeZ - 0.078) + 2 * a * t * (BOX.hingeZ + 0.05) + t * t * endZ]
}

export function ClothHinge({ lid, color }: { lid: RefObject<Group>; color: string }) {
  const geometry = useMemo(() => {
    const mesh = new BufferGeometry()
    mesh.setAttribute('position', new BufferAttribute(new Float32Array(17 * 2 * 3), 3))
    const indices: number[] = []
    for (let i = 0; i < 16; i++) {
      const a = i * 2
      indices.push(a, a + 1, a + 2, a + 1, a + 3, a + 2)
    }
    mesh.setIndex(indices)
    return mesh
  }, [])
  useEffect(() => () => geometry.dispose(), [geometry])
  useFrame(() => {
    const positions = geometry.getAttribute('position')
    for (let i = 0; i <= 16; i++) {
      const [y, z] = hingeSection(i / 16, lid.current?.rotation.x ?? 0)
      positions.setXYZ(i * 2, -2.82, y, z)
      positions.setXYZ(i * 2 + 1, 2.82, y, z)
    }
    positions.needsUpdate = true
    geometry.computeVertexNormals()
  })
  return <mesh geometry={geometry} frustumCulled={false} castShadow receiveShadow>
    <PaperMaterial color={color} finish="cloth" />
  </mesh>
}
