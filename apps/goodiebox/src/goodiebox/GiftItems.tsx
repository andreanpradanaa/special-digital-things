import { RoundedBox, Text } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { Shape, SRGBColorSpace, Texture, TextureLoader } from 'three'
import type { Group } from 'three'
import { getItemLayout, getItemScale, HOVER_SCALE, INSERT_TOP, itemBounds } from './itemLayouts'
import { getItemPalette } from './boxAppearance'
import type { GiftItemData, GiftItemType, LayoutSlot } from './types'

const envelopeFlap = new Shape()
envelopeFlap.moveTo(-0.77, 0.47)
envelopeFlap.lineTo(0.77, 0.47)
envelopeFlap.lineTo(0, -0.34)
envelopeFlap.closePath()

const ticketShape = new Shape()
ticketShape.moveTo(-0.88, -0.47)
ticketShape.lineTo(0.88, -0.47)
ticketShape.lineTo(0.88, -0.15)
ticketShape.lineTo(0.78, 0)
ticketShape.lineTo(0.88, 0.15)
ticketShape.lineTo(0.88, 0.47)
ticketShape.lineTo(-0.88, 0.47)
ticketShape.lineTo(-0.88, 0.15)
ticketShape.lineTo(-0.78, 0)
ticketShape.lineTo(-0.88, -0.15)
ticketShape.closePath()

const playIcon = new Shape()
playIcon.moveTo(-0.1, -0.12)
playIcon.lineTo(0.14, 0)
playIcon.lineTo(-0.1, 0.12)
playIcon.closePath()

const paperMaterial = { roughness: 0.86, metalness: 0 }

// Accents (card bodies, panels, labels) follow the box color; paper and foil
// seals stay constant so items still read as physical keepsakes.
const ItemPalette = createContext(getItemPalette('#D3C3B8'))

function ShortLabel({ children, position, color, width = 1 }: { children: string; position: [number, number, number]; color?: string; width?: number }) {
  const palette = useContext(ItemPalette)
  return <Text position={position} rotation={[-Math.PI / 2, 0, Math.PI]} fontSize={0.105} maxWidth={width} lineHeight={1.1} color={color ?? palette.accentDeep} anchorX="center" anchorY="middle" material-toneMapped={false}>{children.slice(0, 42)}</Text>
}

function Letter({ item }: { item: Extract<GiftItemData, { type: 'letter' }> }) {
  return <>
    <RoundedBox args={[1.65, 0.06, 1.15]} radius={0.025} smoothness={2} castShadow receiveShadow><meshStandardMaterial color="#f3ebdd" {...paperMaterial} /></RoundedBox>
    <mesh position={[0, 0.038, -0.02]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <shapeGeometry args={[envelopeFlap]} /><meshStandardMaterial color="#ead9c5" {...paperMaterial} />
    </mesh>
    <mesh position={[0, 0.045, 0.17]} rotation={[-Math.PI / 2, 0, 0]} castShadow>
      <circleGeometry args={[0.105, 28]} /><meshStandardMaterial color="#b87962" roughness={0.76} metalness={0} />
    </mesh>
    <ShortLabel position={[0, 0.079, -0.25]} width={1.18}>{item.title}</ShortLabel>
  </>
}

function PhotoImage({ src }: { src?: string }) {
  const [texture, setTexture] = useState<Texture | null>(null)
  useEffect(() => {
    if (!src) { setTexture(null); return }
    const absoluteSrc = src.startsWith('/') ? window.location.origin + src : src
    const loader = new TextureLoader()
    const loaded = loader.load(
      absoluteSrc,
      (next) => {
        next.colorSpace = SRGBColorSpace
        next.flipY = false
        setTexture(next)
      },
      undefined,
      (err) => console.error('Failed to load photo texture:', absoluteSrc, err)
    )
    return () => loaded.dispose()
  }, [src])
  if (!texture) return <RoundedBox args={[1.14, 0.018, 1.03]} radius={0.01} smoothness={1} position={[0, 0.046, 0.14]} castShadow><meshStandardMaterial color={useContext(ItemPalette).accent} roughness={0.82} metalness={0} /></RoundedBox>
  return <mesh position={[0, 0.051, 0.14]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[1.14, 1.03]} /><meshBasicMaterial map={texture} toneMapped={false} /></mesh>
}

function Polaroid({ item }: { item: Extract<GiftItemData, { type: 'photo' }> }) {
  return <>
    <RoundedBox args={[1.35, 0.07, 1.55]} radius={0.02} smoothness={2} castShadow receiveShadow><meshStandardMaterial color="#f8f4ec" {...paperMaterial} /></RoundedBox>
    <PhotoImage src={item.imageUrl} />
    <ShortLabel position={[0, 0.058, -0.55]} color="#786080" width={1.03}>{item.title || 'Kenangan'}</ShortLabel>
  </>
}

function MusicCard({ item }: { item: Extract<GiftItemData, { type: 'music' }> }) {
  return <>
    <RoundedBox args={[1.35, 0.065, 1.25]} radius={0.032} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={useContext(ItemPalette).accent} {...paperMaterial} /></RoundedBox>
    <mesh position={[0, 0.045, 0.13]} rotation={[-Math.PI / 2, 0, 0]} castShadow><circleGeometry args={[0.29, 36]} /><meshStandardMaterial color="#f3ebdd" roughness={0.83} metalness={0} /></mesh>
    <mesh position={[0, 0.051, 0.13]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.055, 20]} /><meshBasicMaterial color="#786080" /></mesh>
    <mesh position={[0, 0.045, -0.39]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.72, 0.034]} /><meshBasicMaterial color={useContext(ItemPalette).accentSoft} /></mesh>
    <mesh position={[-0.12, 0.045, -0.29]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.48, 0.023]} /><meshBasicMaterial color={useContext(ItemPalette).accentSoft} /></mesh>
    <ShortLabel position={[0, 0.053, -0.46]} color="#f8f4ec" width={1.02}>{item.title}</ShortLabel>
  </>
}

function Voucher({ item }: { item: Extract<GiftItemData, { type: 'voucher' }> }) {
  return <>
    <mesh position={[0, -0.028, 0]} rotation={[-Math.PI / 2, 0, 0]} castShadow receiveShadow>
      <extrudeGeometry args={[ticketShape, { depth: 0.055, bevelEnabled: true, bevelSegments: 1, bevelSize: 0.012, bevelThickness: 0.012 }]} />
      <meshStandardMaterial color="#f1dfbd" {...paperMaterial} />
    </mesh>
    <mesh position={[0.45, 0.038, 0]} castShadow><boxGeometry args={[0.018, 0.012, 0.67]} /><meshStandardMaterial color="#c5a778" roughness={0.84} metalness={0} /></mesh>
    <mesh position={[-0.16, 0.042, 0]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.34, 0.034]} /><meshBasicMaterial color="#b18b5d" /></mesh>
    <mesh position={[-0.16, 0.042, -0.12]} rotation={[-Math.PI / 2, 0, 0]}><planeGeometry args={[0.48, 0.022]} /><meshBasicMaterial color="#c5a778" /></mesh>
    <ShortLabel position={[-0.2, 0.055, 0.16]} color="#8f704a" width={0.7}>{item.title}</ShortLabel>
  </>
}

function AudioCard({ item }: { item: Extract<GiftItemData, { type: 'audio' }> }) {
  const wave = [0.13, 0.28, 0.42, 0.24, 0.36, 0.18]
  return <>
    <RoundedBox args={[1.45, 0.065, 1.05]} radius={0.027} smoothness={2} castShadow receiveShadow><meshStandardMaterial color="#f3ebdd" {...paperMaterial} /></RoundedBox>
    <RoundedBox args={[1.22, 0.014, 0.58]} radius={0.012} smoothness={1} position={[0.05, 0.044, 0.12]}><meshStandardMaterial color={useContext(ItemPalette).accentSoft} roughness={0.88} metalness={0} /></RoundedBox>
    {wave.map((height, index) => <mesh key={index} position={[-0.2 + index * 0.11, 0.055, 0.12]} castShadow>
      <boxGeometry args={[0.035, 0.012, height]} /><meshStandardMaterial color={useContext(ItemPalette).accentDeep} roughness={0.84} metalness={0} />
    </mesh>)}
    <mesh position={[-0.5, 0.052, -0.3]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.13, 28]} /><meshStandardMaterial color={useContext(ItemPalette).accent} roughness={0.8} metalness={0} /></mesh>
    <mesh position={[-0.48, 0.06, -0.3]} rotation={[-Math.PI / 2, 0, 0]}><shapeGeometry args={[playIcon]} /><meshBasicMaterial color="#f8f4ec" /></mesh>
    <ShortLabel position={[0.18, 0.055, -0.32]} width={0.72}>{item.title}</ShortLabel>
  </>
}

function VideoCard({ item }: { item: Extract<GiftItemData, { type: 'video' }> }) {
  const sprockets = [-0.34, 0, 0.34]
  return <>
    <RoundedBox args={[1.68, 0.07, 1.05]} radius={0.024} smoothness={2} castShadow receiveShadow><meshStandardMaterial color={useContext(ItemPalette).accentDeep} {...paperMaterial} /></RoundedBox>
    <RoundedBox args={[1.38, 0.015, 0.7]} radius={0.01} smoothness={1} position={[0, 0.048, 0]}><meshStandardMaterial color={useContext(ItemPalette).accentSoft} roughness={0.84} metalness={0} /></RoundedBox>
    {sprockets.flatMap((z) => [-0.73, 0.73].map((x) => <mesh key={`${x}-${z}`} position={[x, 0.054, z]}>
      <boxGeometry args={[0.11, 0.012, 0.1]} /><meshBasicMaterial color="#f3ebdd" />
    </mesh>))}
    <mesh position={[0, 0.059, 0]} rotation={[-Math.PI / 2, 0, 0]}><circleGeometry args={[0.21, 32]} /><meshStandardMaterial color="#f8f4ec" roughness={0.86} metalness={0} /></mesh>
    <mesh position={[0.02, 0.067, 0]} rotation={[-Math.PI / 2, 0, 0]}><shapeGeometry args={[playIcon]} /><meshBasicMaterial color="#b87962" /></mesh>
    <ShortLabel position={[0, 0.073, -0.38]} color="#f8f4ec" width={1.25}>{item.title}</ShortLabel>
  </>
}

function GiftItemModel({ item }: { item: GiftItemData }) {
  if (item.type === 'letter') return <Letter item={item} />
  if (item.type === 'photo') return <Polaroid item={item} />
  if (item.type === 'music') return <MusicCard item={item} />
  if (item.type === 'voucher') return <Voucher item={item} />
  if (item.type === 'audio') return <AudioCard item={item} />
  return <VideoCard item={item} />
}

function GiftItem({ item, slot, open, index, present, selected, onSelect }: { item: GiftItemData; slot: LayoutSlot; open: boolean; index: number; present: boolean; selected: boolean; onSelect?: (id: string | null) => void }) {
  const group = useRef<Group>(null)
  const [hovered, setHovered] = useState(false)
  const fittedScale = getItemScale(item.type, slot.scale)
  const bottom = itemBounds[item.type].bottom
  useFrame((state, delta) => {
    if (!group.current) return
    const reveal = open && present ? 1 : 0
    const delayed = Math.max(0, Math.min(1, reveal - index * 0.075))
    const k = 1 - Math.exp(-delta * 4.6)
    group.current.position.x += (slot.position[0] - group.current.position.x) * k
    group.current.position.z += (slot.position[2] - group.current.position.z) * k
    group.current.rotation.x += (slot.rotation[0] - group.current.rotation.x) * k
    group.current.rotation.y += (slot.rotation[1] + (selected ? Math.sin(state.clock.elapsedTime * 1.2) * 0.06 : 0) - group.current.rotation.y) * k
    group.current.rotation.z += (slot.rotation[2] - group.current.rotation.z) * k
    const scaled = fittedScale * (0.9 + delayed * 0.1) * (hovered && reveal ? HOVER_SCALE : 1) * (selected ? 1.06 : 1)
    group.current.scale.x += (scaled - group.current.scale.x) * k
    group.current.scale.y += (scaled - group.current.scale.y) * k
    group.current.scale.z += (scaled - group.current.scale.z) * k
    // Anchor the lower face during scaling so items stay seated on the insert.
    group.current.position.y = INSERT_TOP - bottom * group.current.scale.y
    const opacity = reveal ? 1 : 0
    group.current.traverse((child) => {
      const mesh = child as typeof child & { isMesh?: boolean; material?: { transparent: boolean; opacity: number } | Array<{ transparent: boolean; opacity: number }> }
      if (!mesh.isMesh || !mesh.material) return
      const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material]
      materials.forEach((material) => {
        material.transparent = true
        material.opacity += (opacity - material.opacity) * k
      })
    })
  })
  return <group ref={group} position={[slot.position[0], INSERT_TOP - bottom * fittedScale * 0.92, slot.position[2]]} rotation={slot.rotation} scale={fittedScale * 0.92}
    onPointerOver={() => { setHovered(true); if (present && onSelect) document.body.style.cursor = 'pointer' }}
    onPointerOut={() => { setHovered(false); document.body.style.cursor = 'auto' }}
    onClick={(event) => { event.stopPropagation(); if (present && onSelect) onSelect(selected ? null : item.id) }}
  >
    <GiftItemModel item={item} />
  </group>
}

export function GiftItems({ items, open, color = '#D3C3B8', selectedId, onSelect }: { items: GiftItemData[]; open: boolean; color?: string; selectedId?: string | null; onSelect?: (id: string | null) => void }) {
  const [renderedItems, setRenderedItems] = useState(items)
  useEffect(() => {
    setRenderedItems((current) => {
      const currentIds = new Set(current.map((item) => item.id))
      const retained = current
        .filter((item) => items.some((next) => next.id === item.id))
        .map((item) => items.find((next) => next.id === item.id) ?? item)
      return [...retained, ...items.filter((item) => !currentIds.has(item.id))]
    })
  }, [items])
  useEffect(() => {
    const activeIds = new Set(items.map((item) => item.id))
    const hasLeavingItem = renderedItems.some((item) => !activeIds.has(item.id))
    if (!hasLeavingItem) return
    const timer = window.setTimeout(() => setRenderedItems((current) => current.filter((item) => activeIds.has(item.id))), 380)
    return () => window.clearTimeout(timer)
  }, [items, renderedItems])

  const layout = useMemo(() => getItemLayout(items), [items])
  const palette = useMemo(() => getItemPalette(color), [color])
  return <ItemPalette.Provider value={palette}><group>{renderedItems.slice(0, 6).map((item, renderIndex) => {
    const activeIndex = items.findIndex((active) => active.id === item.id)
    const present = activeIndex !== -1
    const slot = present ? layout[activeIndex] : layout[Math.min(renderIndex, layout.length - 1)] ?? getItemLayout(1)[0]
    return <GiftItem key={item.id} item={item} slot={slot} index={Math.max(activeIndex, renderIndex)} open={open} present={present} selected={present && selectedId === item.id} onSelect={onSelect} />
  })}</group></ItemPalette.Provider>
}
