import { DataTexture, DoubleSide, FrontSide, LinearFilter, LinearMipmapLinearFilter, RepeatWrapping, RGBAFormat } from 'three'

type PaperFinish = 'outer' | 'lining' | 'cloth'

function createPaperMaps() {
  const size = 256
  const heightData = new Uint8Array(size * size * 4)
  const roughnessData = new Uint8Array(size * size * 4)
  let seed = 8147

  for (let y = 0; y < size; y += 1) {
    for (let x = 0; x < size; x += 1) {
      seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0
      const noise = (seed >>> 24) / 255 - 0.5
      const horizontalFiber = Math.sin(y * 1.42 + Math.sin(x * 0.09) * 0.8)
      const verticalFiber = Math.sin(x * 1.7 + Math.sin(y * 0.07) * 0.65)
      const broadFiber = Math.sin((x + y) * 0.17) * 0.22
      const weave = horizontalFiber * 0.46 + verticalFiber * 0.36 + broadFiber
      const height = Math.max(80, Math.min(176, Math.round(128 + weave * 19 + noise * 13)))
      const roughness = Math.max(205, Math.min(250, Math.round(232 - weave * 7 + noise * 8)))
      const offset = (y * size + x) * 4
      heightData.set([height, height, height, 255], offset)
      roughnessData.set([roughness, roughness, roughness, 255], offset)
    }
  }

  const configure = (texture: DataTexture) => {
    texture.wrapS = texture.wrapT = RepeatWrapping
    texture.repeat.set(12, 9)
    texture.magFilter = LinearFilter
    texture.minFilter = LinearMipmapLinearFilter
    texture.generateMipmaps = true
    texture.anisotropy = 8
    texture.needsUpdate = true
    return texture
  }

  return {
    height: configure(new DataTexture(heightData, size, size, RGBAFormat)),
    roughness: configure(new DataTexture(roughnessData, size, size, RGBAFormat)),
  }
}

// Shared maps keep every wrapped panel consistent and avoid duplicate GPU textures.
const paperMaps = createPaperMaps()

export function PaperMaterial({ color, roughness, finish = 'outer' }: { color: string; roughness?: number; finish?: PaperFinish }) {
  const settings = finish === 'lining'
    ? { roughness: 0.94, bumpScale: 0.006, sheen: 0.035 }
    : finish === 'cloth'
      ? { roughness: 0.96, bumpScale: 0.014, sheen: 0.025 }
      : { roughness: 0.88, bumpScale: 0.011, sheen: 0.075 }

  return <meshPhysicalMaterial
    color={color}
    roughness={roughness ?? settings.roughness}
    roughnessMap={paperMaps.roughness}
    metalness={0}
    bumpMap={paperMaps.height}
    bumpScale={settings.bumpScale}
    sheen={settings.sheen}
    sheenColor="#fff8f0"
    sheenRoughness={0.82}
    specularIntensity={0.24}
    side={finish === 'cloth' ? DoubleSide : FrontSide}
  />
}
