// Shared by the lid, cloth hinge, and camera fit to keep moving edges aligned.
export const BOX = {
  width: 3,
  depth: 10.5,
  height: 3.22,
  lidWidth: 6.18,
  lidDepth: 4.66,
  hingeY: 1.645,
  hingeZ: 2.33,
  // Past vertical so the open lid leans back instead of facing the camera square-on.
  openAngle: 110 * Math.PI / 180,
  // Frontal view: centered, elevated, closer with a wider fov so the box
  // reads with real perspective instead of near-orthographic.
  cameraPosition: [0, 17.5, -24.5] as [number, number, number],
} as const
