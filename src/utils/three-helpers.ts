import * as THREE from 'three'

/**
 * createBoxGeometry Function
 *
 * Creates a BoxGeometry with specified dimensions and optional segment counts.
 *
 * @param width - The width of the box. Must be a positive number.
 * @param height - The height of the box. Must be a positive number.
 * @param depth - The depth of the box. Must be a positive number.
 * @param widthSegments - Optional number of width segments. Must be a non-negative integer. Defaults to 1.
 * @param heightSegments - Optional number of height segments. Must be a non-negative integer. Defaults to 1.
 * @param depthSegments - Optional number of depth segments. Must be a non-negative integer. Defaults to 1.
 * @returns A THREE.BoxGeometry instance.
 * @throws TypeError if any of the input parameters are invalid.
 */
function createBoxGeometry(
  width: number,
  height: number,
  depth: number,
  widthSegments: number = 1,
  heightSegments: number = 1,
  depthSegments: number = 1,
): THREE.BoxGeometry {
  if (typeof width !== 'number' || width <= 0 || !Number.isFinite(width)) {
    throw new TypeError('createBoxGeometry: width must be a positive number.')
  }

  if (typeof height !== 'number' || height <= 0 || !Number.isFinite(height)) {
    throw new TypeError('createBoxGeometry: height must be a positive number.')
  }

  if (typeof depth !== 'number' || depth <= 0 || !Number.isFinite(depth)) {
    throw new TypeError('createBoxGeometry: depth must be a positive number.')
  }

  if (!Number.isInteger(widthSegments) || widthSegments < 0) {
    throw new TypeError('createBoxGeometry: widthSegments must be a non-negative integer.')
  }

  if (!Number.isInteger(heightSegments) || heightSegments < 0) {
    throw new TypeError('createBoxGeometry: heightSegments must be a non-negative integer.')
  }

  if (!Number.isInteger(depthSegments) || depthSegments < 0) {
    throw new TypeError('createBoxGeometry: depthSegments must be a non-negative integer.')
  }

  return new THREE.BoxGeometry(width, height, depth, widthSegments, heightSegments, depthSegments)
}

/**
 * createSphereGeometry Function
 *
 * Creates a SphereGeometry with specified radius and optional parameters.
 *
 * @param radius - The radius of the sphere. Must be a positive number.
 * @param widthSegments - Optional number of width segments. Must be a non-negative integer. Defaults to 32.
 * @param heightSegments - Optional number of height segments. Must be a non-negative integer. Defaults to 16.
 * @param phiStart - Optional starting angle for first segment. Defaults to 0.
 * @param phiLength - Optional sweep angle size of the first segment. Defaults to Math.PI * 2.
 * @param thetaStart - Optional starting vertical angle. Defaults to 0.
 * @param thetaLength - Optional vertical angle size. Defaults to Math.PI.
 * @returns A THREE.SphereGeometry instance.
 * @throws TypeError if any of the input parameters are invalid.
 */
function createSphereGeometry(
  radius: number,
  widthSegments: number = 32,
  heightSegments: number = 16,
  phiStart: number = 0,
  phiLength: number = Math.PI * 2,
  thetaStart: number = 0,
  thetaLength: number = Math.PI,
): THREE.SphereGeometry {
  if (typeof radius !== 'number' || radius <= 0 || !Number.isFinite(radius)) {
    throw new TypeError('createSphereGeometry: radius must be a positive number.')
  }

  if (!Number.isInteger(widthSegments) || widthSegments < 0) {
    throw new TypeError('createSphereGeometry: widthSegments must be a non-negative integer.')
  }

  if (!Number.isInteger(heightSegments) || heightSegments < 0) {
    throw new TypeError('createSphereGeometry: heightSegments must be a non-negative integer.')
  }

  if (typeof phiStart !== 'number' || !Number.isFinite(phiStart)) {
    throw new TypeError('createSphereGeometry: phiStart must be a number.')
  }

  if (typeof phiLength !== 'number' || !Number.isFinite(phiLength)) {
    throw new TypeError('createSphereGeometry: phiLength must be a number.')
  }

  if (typeof thetaStart !== 'number' || !Number.isFinite(thetaStart)) {
    throw new TypeError('createSphereGeometry: thetaStart must be a number.')
  }

  if (typeof thetaLength !== 'number' || !Number.isFinite(thetaLength)) {
    throw new TypeError('createSphereGeometry: thetaLength must be a number.')
  }

  return new THREE.SphereGeometry(
    radius,
    widthSegments,
    heightSegments,
    phiStart,
    phiLength,
    thetaStart,
    thetaLength,
  )
}

/**
 * createPlaneGeometry Function
 *
 * Creates a PlaneGeometry with specified dimensions and optional segment counts.
 *
 * @param width - The width of the plane. Must be a positive number.
 * @param height - The height of the plane. Must be a positive number.
 * @param widthSegments - Optional number of width segments. Must be a non-negative integer. Defaults to 1.
 * @param heightSegments - Optional number of height segments. Must be a non-negative integer. Defaults to 1.
 * @returns A THREE.PlaneGeometry instance.
 * @throws TypeError if any of the input parameters are invalid.
 */
function createPlaneGeometry(
  width: number,
  height: number,
  widthSegments: number = 1,
  heightSegments: number = 1,
): THREE.PlaneGeometry {
  if (typeof width !== 'number' || width <= 0 || !Number.isFinite(width)) {
    throw new TypeError('createPlaneGeometry: width must be a positive number.')
  }

  if (typeof height !== 'number' || height <= 0 || !Number.isFinite(height)) {
    throw new TypeError('createPlaneGeometry: height must be a positive number.')
  }

  if (!Number.isInteger(widthSegments) || widthSegments < 0) {
    throw new TypeError('createPlaneGeometry: widthSegments must be a non-negative integer.')
  }

  if (!Number.isInteger(heightSegments) || heightSegments < 0) {
    throw new TypeError('createPlaneGeometry: heightSegments must be a non-negative integer.')
  }

  return new THREE.PlaneGeometry(width, height, widthSegments, heightSegments)
}

/**
 * createMeshStandardMaterial Function
 *
 * Creates a MeshStandardMaterial with specified properties.
 *
 * @param color - Optional color of the material (CSS color string or number). Defaults to white.
 * @param roughness - Optional roughness of the material (0 to 1). Defaults to 0.5.
 * @param metalness - Optional metalness of the material (0 to 1). Defaults to 0.
 * @param side - Optional side rendering setting (THREE.Side). Defaults to THREE.FrontSide.
 * @returns A THREE.MeshStandardMaterial instance.
 * @throws TypeError if any of the input parameters are invalid.
 */
function createMeshStandardMaterial(
  color: string | number = 'white',
  roughness: number = 0.5,
  metalness: number = 0,
  side: THREE.Side = THREE.FrontSide,
): THREE.MeshStandardMaterial {
  if (typeof color !== 'string' && typeof color !== 'number') {
    throw new TypeError('createMeshStandardMaterial: color must be a valid CSS color string or number.')
  }

  if (typeof roughness !== 'number' || roughness < 0 || roughness > 1 || !Number.isFinite(roughness)) {
    throw new TypeError('createMeshStandardMaterial: roughness must be a number between 0 and 1.')
  }

  if (typeof metalness !== 'number' || metalness < 0 || metalness > 1 || !Number.isFinite(metalness)) {
    throw new TypeError('createMeshStandardMaterial: metalness must be a number between 0 and 1.')
  }

  if (!Object.values(THREE.Side).includes(side)) {
    throw new TypeError('createMeshStandardMaterial: side must be a valid THREE.Side enum value.')
  }

  return new THREE.MeshStandardMaterial({ color, roughness, metalness, side })
}

/**
 * createDirectionalLight Function
 *
 * Creates a DirectionalLight with specified properties.
 *
 * @param color - Optional color of the light (CSS color string or number). Defaults to white.
 * @param intensity - Optional intensity of the light. Must be a non-negative number. Defaults to 1.
 * @param position - Optional position of the light (THREE.Vector3). Defaults to (1, 1, 1).
 * @returns A THREE.DirectionalLight instance.
 * @throws TypeError if any of the input parameters are invalid.
 */
function createDirectionalLight(
  color: string | number = 'white',
  intensity: number = 1,
  position: THREE.Vector3 = new THREE.Vector3(1, 1, 1),
): THREE.DirectionalLight {
  if (typeof color !== 'string' && typeof color !== 'number') {
    throw new TypeError('createDirectionalLight: color must be a valid CSS color string or number.')
  }

  if (typeof intensity !== 'number' || intensity < 0 || !Number.isFinite(intensity)) {
    throw new TypeError('createDirectionalLight: intensity must be a non-negative number.')
  }

  if (!(position instanceof THREE.Vector3)) {
    throw new TypeError('createDirectionalLight: position must be a THREE.Vector3.')
  }

  const light = new THREE.DirectionalLight(color, intensity)
  light.position.copy(position)
  return light
}

/**
 * createAmbientLight Function
 *
 * Creates an AmbientLight with specified properties.
 *
 * @param color - Optional color of the light (CSS color string or number). Defaults to white.
 * @param intensity - Optional intensity of the light. Must be a non-negative number. Defaults to 0.5.
 * @returns A THREE.AmbientLight instance.
 * @throws TypeError if any of the input parameters are invalid.
 */
function createAmbientLight(
  color: string | number = 'white',
  intensity: number = 0.5,
): THREE.AmbientLight {
  if (typeof color !== 'string' && typeof color !== 'number') {
    throw new TypeError('createAmbientLight: color must be a valid CSS color string or number.')
  }

  if (typeof intensity !== 'number' || intensity < 0 || !Number.isFinite(intensity)) {
    throw new TypeError('createAmbientLight: intensity must be a non-negative number.')
  }

  return new THREE.AmbientLight(color, intensity)
}

/**
 * disposeMesh Function
 *
 * Safely disposes of a mesh's geometry and material to prevent memory leaks.
 * Checks if the mesh and its geometry and material exist before disposing.
 * Implements specific disposal logic for different material types (e.g., checking for and disposing of textures).
 * Handles cases where a mesh may have multiple materials (e.g., an array of materials) and correctly disposes of each one.
 * Logs warnings for any errors encountered during disposal, without halting the process.
 *
 * @param mesh - The THREE.Mesh to dispose of.
 */
function disposeMesh(mesh: THREE.Mesh): void {
  if (!mesh) {
    console.warn('disposeMesh: Mesh is null or undefined, skipping disposal.')
    return
  }

  try {
    if (mesh.geometry) {
      mesh.geometry.dispose()
      console.log('disposeMesh: Disposed geometry for mesh:', mesh.name)
    } else {
      console.warn('disposeMesh: Mesh has no geometry to dispose:', mesh.name)
    }

    if (mesh.material) {
      const material = mesh.material

      if (Array.isArray(material)) {
        material.forEach((mat) => {
          disposeMaterial(mat)
        })
      } else {
        disposeMaterial(material)
      }
    } else {
      console.warn('disposeMesh: Mesh has no material to dispose:', mesh.name)
    }
  } catch (error: any) {
    console.error('disposeMesh: Error during mesh disposal:', error)
  }
}

function disposeMaterial(material: THREE.Material): void {
  try{
    if ((material as THREE.MeshStandardMaterial).map) {
      (material as THREE.MeshStandardMaterial).map!.dispose()
      console.log('disposeMaterial: Disposed texture for material:', material.name)
    }
    material.dispose()
    console.log('disposeMaterial: Disposed material:', material.name)
  } catch (error: any) {
    console.warn('disposeMaterial: Could not dispose of materials:', error);
  }
}

export {
  createBoxGeometry,
  createSphereGeometry,
  createPlaneGeometry,
  createMeshStandardMaterial,
  createDirectionalLight,
  createAmbientLight,
  disposeMesh,
}