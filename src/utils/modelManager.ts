import * as THREE from 'three'
import { SimplifyModifier } from 'three/examples/jsm/modifiers/SimplifyModifier'

/**
 * simplifyModel Function
 *
 * Reduces the polygon count of a given 3D model (THREE.Object3D).
 * It takes the model and a targetReduction parameter (a float between 0 and 1, where 1 is 100% reduction) as input.
 * Utilizes THREE.BufferGeometry.computeVertexNormals() after simplification.
 *
 * @param model - The 3D model (THREE.Object3D) to simplify.
 * @param targetReduction - A float between 0 and 1 representing the target reduction percentage.
 * @returns The simplified 3D model (THREE.Object3D).
 * @throws Error if the model is null or undefined, or if targetReduction is out of range.
 */
function simplifyModel(model: THREE.Object3D, targetReduction: number): THREE.Object3D {
  if (!model) {
    throw new Error('simplifyModel: Model cannot be null or undefined.')
  }

  if (typeof targetReduction !== 'number' || targetReduction < 0 || targetReduction > 1) {
    throw new Error(
      'simplifyModel: targetReduction must be a number between 0 and 1.',
    )
  }

  try {
    model.traverse((child: any) => {
      if (child.isMesh && child.geometry instanceof THREE.BufferGeometry) {
        const originalGeometry = child.geometry
        const simplify = new SimplifyModifier()
        const simplifiedGeometry = simplify.modify(
          originalGeometry,
          Math.floor(originalGeometry.attributes.position.count * targetReduction),
        )

        simplifiedGeometry.computeVertexNormals()

        child.geometry.dispose()
        child.geometry = simplifiedGeometry
      }
    })
    return model
  } catch (error: any) {
    console.error('simplifyModel: Error during model simplification:', error)
    throw new Error(`Failed to simplify model: ${error.message}`)
  }
}

/**
 * disposeModel Function
 *
 * Disposes of the resources used by a 3D model (THREE.Object3D), including geometries, materials, and textures.
 * Traverse the model's hierarchy. For each mesh, dispose of the geometry and material.
 * If a material has a texture, dispose of the texture before disposing of the material.
 *
 * @param model - The 3D model (THREE.Object3D) to dispose.
 */
function disposeModel(model: THREE.Object3D): void {
  if (!model) {
    console.warn('disposeModel: Model is null or undefined, skipping disposal.')
    return
  }

  try {
    model.traverse((child: any) => {
      if (child.isMesh) {
        if (child.geometry) {
          child.geometry.dispose()
          console.log('disposeModel: Disposed geometry for mesh:', child.name)
        } else {
          console.warn('disposeModel: Mesh has no geometry to dispose:', child.name)
        }

        if (child.material) {
          const material = child.material

          if (Array.isArray(material)) {
            material.forEach((mat) => {
              disposeMaterial(mat)
            })
          } else {
            disposeMaterial(material)
          }
        } else {
          console.warn('disposeModel: Mesh has no material to dispose:', child.name)
        }
      }
    })
  } catch (error: any) {
    console.error('disposeModel: Error during model disposal:', error)
  }
}

function disposeMaterial(material: THREE.Material): void {
  if ((material as THREE.MeshStandardMaterial).map) {
    (material as THREE.MeshStandardMaterial).map!.dispose()
    console.log('disposeModel: Disposed texture for material:', material.name)
  }
  material.dispose()
  console.log('disposeModel: Disposed material:', material.name)
}

export { simplifyModel, disposeModel }