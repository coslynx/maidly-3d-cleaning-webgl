import * as THREE from 'three'
import { loadAsset } from './assetLoader'

/**
 * loadSampleModel Function
 *
 * Asynchronously loads a 3D model from the specified modelPath using THREE.GLTFLoader,
 * handling Draco compression.
 *
 * @param modelPath - The path to the 3D model to load.
 * @param dracoCompression - Optional configuration for Draco compression.
 * @param onProgress - Optional callback function for tracking loading progress.
 * @returns A Promise that resolves with the loaded THREE.Group.
 * @throws Error if the model path is invalid or loading fails.
 */
async function loadSampleModel(
  modelPath: string,
  dracoCompression?: { decoderPath?: string },
  onProgress?: (progress: number) => void,
): Promise<THREE.Group> {
  if (!modelPath) {
    throw new Error('loadSampleModel: Model path cannot be empty.')
  }

  if (modelPath.startsWith('.') || modelPath.includes('..')) {
    throw new Error('loadSampleModel: Relative paths and ".." are not allowed.')
  }

  const sanitizedModelPath = modelPath.replace(/[^a-zA-Z0-9/._-]/g, '')

  try {
    const model = await loadAsset(
      sanitizedModelPath,
      'gltf',
      onProgress,
      dracoCompression,
    )

    if (!(model instanceof THREE.Group)) {
      throw new Error(
        `loadSampleModel: Loaded asset is not a THREE.Group. Check the model format and assetType.`,
      )
    }

    return model
  } catch (error: any) {
    console.error('loadSampleModel: Error loading model:', error)
    throw new Error(`Failed to load model from ${modelPath}: ${error.message}`)
  }
}

/**
 * setupModelProperties Function
 *
 * Configures the properties of a 3D model, setting its position, scale, and rotation.
 *
 * @param model - The 3D model (THREE.Group) to configure.
 * @param position - Optional position (THREE.Vector3) for the model.
 * @param scale - Optional scale (THREE.Vector3) for the model.
 * @param rotation - Optional rotation (THREE.Euler) for the model.
 */
function setupModelProperties(
  model: THREE.Group,
  position?: THREE.Vector3,
  scale?: THREE.Vector3,
  rotation?: THREE.Euler,
): void {
  if (!model) {
    throw new Error('setupModelProperties: Model cannot be null or undefined.')
  }

  try {
    if (position) {
      model.position.copy(position)
    }

    if (scale) {
      model.scale.copy(scale)
    }

    if (rotation) {
      model.rotation.copy(rotation)
    }
  } catch (error: any) {
    console.error('setupModelProperties: Error setting model properties:', error)
    throw new Error(`Failed to setup model properties: ${error.message}`)
  }
}

/**
 * configureModelMaterial Function
 *
 * Configures the material properties of a 3D model.
 *
 * @param model - The 3D model (THREE.Group) to configure.
 * @param materialProperties - An object containing material property names and values.
 */
function configureModelMaterial(
  model: THREE.Group,
  materialProperties: { [key: string]: any },
): void {
  if (!model) {
    throw new Error('configureModelMaterial: Model cannot be null or undefined.')
  }

  try {
    model.traverse((child: any) => {
      if (child.isMesh && child.material) {
        const material = Array.isArray(child.material) ? child.material : [child.material]
        material.forEach((mat: THREE.Material) => {
          for (const key in materialProperties) {
            if (mat.hasOwnProperty(key)) {
              try {
                (mat as any)[key] = materialProperties[key]
              } catch (setPropertyError: any) {
                console.warn(
                  `configureModelMaterial: Could not set property "${key}" on material "${mat.name}":`,
                  setPropertyError.message,
                )
              }
            } else {
              console.warn(`configureModelMaterial: Material "${mat.name}" does not have property "${key}".`)
            }
          }
        })
      }
    })
  } catch (error: any) {
    console.error('configureModelMaterial: Error configuring model material:', error)
    throw new Error(`Failed to configure model material: ${error.message}`)
  }
}

/**
 * addSampleModelToScene Function
 *
 * Adds a 3D model to a Three.js scene.
 *
 * @param scene - The Three.js scene to add the model to.
 * @param model - The 3D model (THREE.Group) to add to the scene.
 */
function addSampleModelToScene(scene: THREE.Scene, model: THREE.Group): void {
  if (!scene) {
    throw new Error('addSampleModelToScene: Scene cannot be null or undefined.')
  }

  if (!model) {
    throw new Error('addSampleModelToScene: Model cannot be null or undefined.')
  }

  try {
    scene.add(model)
  } catch (error: any) {
    console.error('addSampleModelToScene: Error adding model to scene:', error)
    throw new Error(`Failed to add model to scene: ${error.message}`)
  }
}

export { loadSampleModel, setupModelProperties, configureModelMaterial, addSampleModelToScene }