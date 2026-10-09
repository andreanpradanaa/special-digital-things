import { ContactShadows, Environment, Lightformer } from '@react-three/drei'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { useLayoutEffect, useRef } from 'react'
import { PCFSoftShadowMap, PerspectiveCamera } from 'three'
import { GoodieBox } from './GoodieBox'
import { frameBoxCamera } from './frameBoxCamera'
import { BOX } from './boxDimensions'
import type { BoxTheme, GiftItemData } from './types'

const FLOOR_Y = 0

function StudioFloor() {
  // Show the shared page backdrop through the floor; only shadows are composited.
  return <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, FLOOR_Y - 0.012, 0]} receiveShadow>
    <planeGeometry args={[200, 200]} />
    <shadowMaterial transparent opacity={0.14} color="#655344" depthWrite={false} />
  </mesh>
}

function CameraAim({ preview, open, fitMargin, zoomFloor }: { preview: boolean; open: boolean; fitMargin: number; zoomFloor: number }) {
  const camera = useThree((state) => state.camera)
  const size = useThree((state) => state.size)
  const lidAngle = useRef(0)

  useLayoutEffect(() => {
    camera.lookAt(0, preview ? 2.15 : 2.3, 0)
    if (camera instanceof PerspectiveCamera) frameBoxCamera(camera, size.width / Math.max(1, size.height), lidAngle.current, fitMargin, zoomFloor)
  }, [camera, preview, size.width, size.height, fitMargin, zoomFloor])

  useFrame((_, delta) => {
    const target = open ? BOX.openAngle : 0
    // Match the lid's damping so framing remains stable through rapid toggles.
    lidAngle.current += (target - lidAngle.current) * (1 - Math.exp(-delta * 3.4))
    if (camera instanceof PerspectiveCamera) frameBoxCamera(camera, size.width / Math.max(1, size.height), lidAngle.current, fitMargin, zoomFloor)
  })

  return null
}

export function GoodieBoxScene({ color, theme = 'botanical', open, items, recipientName, innerNote = '', onToggle, preview = false, ribbon = false, selectedId, onSelectItem, fitMargin = 1.12, zoomFloor = 0 }: { color: string; theme?: BoxTheme; open: boolean; items: GiftItemData[]; recipientName: string; innerNote?: string; onToggle: () => void; preview?: boolean; ribbon?: boolean; selectedId?: string | null; onSelectItem?: (id: string | null) => void; fitMargin?: number; zoomFloor?: number }) {
  return <Canvas
    shadows={{ type: PCFSoftShadowMap }}
    dpr={[1, 1.5]}
    camera={{
      position: BOX.cameraPosition,
      fov: 34,
    }}
    gl={{
      alpha: true,
      antialias: true,
      toneMappingExposure: 1,
    }}
    onCreated={({ gl }) => gl.setClearColor(0x000000, 0)}
  >
    <CameraAim preview={preview} open={open} fitMargin={fitMargin} zoomFloor={zoomFloor} />
    <hemisphereLight args={['#fffdf9', '#c9c5c1', 0.72]} />
    {/* With the camera on -Z, +X matches the backdrop's light on screen left. */}
    <directionalLight position={[5, 14, -8]} intensity={1.38} color="#fffdf9" castShadow shadow-mapSize={[2048, 2048]} shadow-camera-near={0.1} shadow-camera-far={30} shadow-camera-left={-10} shadow-camera-right={10} shadow-camera-top={10} shadow-camera-bottom={-10} shadow-bias={-0.0001} shadow-normalBias={0.025} shadow-radius={10} />
    <directionalLight position={[-5, 5, -3]} intensity={0.34} color="#e8edf2" />
    <directionalLight position={[0, 6, 6]} intensity={0.18} color="#fff3e8" />
    {/* Studio softboxes for the metallic foil lettering; internal scene, no assets. */}
    <Environment resolution={64} frames={1}>
      <Lightformer intensity={1.3} position={[0, 6, -8]} scale={[8, 4, 1]} color="#fffdf9" />
      <Lightformer intensity={0.8} position={[-6, 3, -2]} rotation={[0, Math.PI / 2, 0]} scale={[5, 3, 1]} color="#f6f1ea" />
      <Lightformer intensity={0.6} position={[6, 2, -1]} rotation={[0, -Math.PI / 2, 0]} scale={[5, 3, 1]} color="#efe7dc" />
    </Environment>
    <GoodieBox theme={theme} color={color} open={open} items={items} recipientName={recipientName} innerNote={innerNote} onToggle={onToggle} ribbon={ribbon} selectedId={selectedId} onSelectItem={onSelectItem} />
    <StudioFloor />
    <ContactShadows position={[0, FLOOR_Y + 0.002, 0]} opacity={0.32} scale={9} resolution={1024} blur={1.1} far={1.5} color="#57514d" />
  </Canvas>
}
