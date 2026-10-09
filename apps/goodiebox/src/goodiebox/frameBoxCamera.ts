import { PerspectiveCamera, Vector3 } from 'three'
import { BOX } from './boxDimensions'

const point = new Vector3()

// Fit the visible body and animated lid, including space for the contact shadow.
// The camera stays in place so the tabletop perspective does not change.
// zoomFloor (0 = off) mencegah zoom mengecil saat tutup terbuka: batas bawah
// dihitung dari silhouette badan kotak saja, kelebihan di atasnya memotong
// sedikit ruang kosong/tepi atas canvas — bukan mengecilkan kotak.
export function frameBoxCamera(camera: PerspectiveCamera, aspect: number, angle: number, margin = 1.12, zoomFloor = 0) {
  camera.aspect = aspect
  camera.zoom = 1
  camera.updateProjectionMatrix()
  camera.updateMatrixWorld()
  const point = new Vector3()
  let left = Infinity, right = -Infinity, bottom = Infinity, top = -Infinity
  const include = (x: number, y: number, z: number) => {
    point.set(x, y, z).multiplyScalar(margin).project(camera)
    left = Math.min(left, point.x)
    right = Math.max(right, point.x)
    bottom = Math.min(bottom, point.y)
    top = Math.max(top, point.y)
  }
  for (const x of [-3.16, 3.16]) for (const y of [-0.1, BOX.height]) for (const z of [-2.4, 2.4]) include(x, y, z)
  for (const x of [-BOX.lidWidth / 2, BOX.lidWidth / 2]) for (const y of [-0.5, 0.224]) for (const z of [-BOX.lidDepth, 0]) {
    include(x, BOX.hingeY + y * Math.cos(angle) - z * Math.sin(angle), BOX.hingeZ + y * Math.sin(angle) + z * Math.cos(angle))
  }
  let zoom = Math.min(3.8, 1.72 / (right - left), 1.72 / (top - bottom))
  if (zoomFloor > 0) {
    // Silhouette badan kotak saja (tanpa tutap terbuka) sebagai batas bawah zoom.
    let bodyLeft = Infinity, bodyRight = -Infinity, bodyBottom = Infinity, bodyTop = -Infinity
    const includeBody = (x: number, y: number, z: number) => {
      point.set(x, y, z).multiplyScalar(margin).project(camera)
      bodyLeft = Math.min(bodyLeft, point.x)
      bodyRight = Math.max(bodyRight, point.x)
      bodyBottom = Math.min(bodyBottom, point.y)
      bodyTop = Math.max(bodyTop, point.y)
    }
    for (const x of [-3.16, 3.16]) for (const y of [-0.1, BOX.height]) for (const z of [-2.4, 2.4]) includeBody(x, y, z)
    const bodyZoom = Math.min(3.8, 1.72 / (bodyRight - bodyLeft), 1.72 / (bodyTop - bodyBottom))
    // Naikkan zoom ke arah ukuran badan, tetap batasi agar tidak memotong >~15%.
    zoom = Math.max(zoom, Math.min(bodyZoom * zoomFloor, zoom * 1.15))
  }
  camera.zoom = zoom
  camera.updateProjectionMatrix()
  // Shift the projection to center the silhouette instead of the empty hinge space.
  camera.projectionMatrix.elements[8] = (left + right) * camera.zoom / 2
  camera.projectionMatrix.elements[9] = (bottom + top) * camera.zoom / 2
  camera.projectionMatrixInverse.copy(camera.projectionMatrix).invert()
}
