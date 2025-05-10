import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'

/**
 * DracoCompression interface to support custom decoder path
 */
interface DracoCompression {
  decoderPath?: string
}

/**
 * loadAsset Function
 *
 * Asynchronously loads assets (GLTF/GLB models, textures, etc.) using Three.js loaders.
 * Handles Draco compression and KTX2 textures for GLTF models.
 *
 * @param assetPath - The path to the asset to load.
 * @param assetType - The type of asset to load ('gltf', 'texture', or 'other').
 * @param onProgress - Optional callback function for tracking loading progress.
 * @param dracoCompression - Optional configuration for Draco compression (for GLTF models).
 *
 * @returns A Promise that resolves with the loaded asset or rejects with an error.
 */
async function loadAsset(
  assetPath: string,
  assetType: 'gltf' | 'texture' | 'other',
  onProgress?: (progress: number) => void,
  dracoCompression?: DracoCompression,
): Promise<THREE.Group | THREE.Texture | any> {
  if (!assetPath) {
    throw new Error('Asset path cannot be empty.')
  }

  if (assetPath.startsWith('.') || assetPath.includes('..')) {
    throw new Error('Invalid asset path: Relative paths and ".." are not allowed.')
  }

  const sanitizedAssetPath = assetPath.replace(/[^a-zA-Z0-9/._-]/g, '')

  return new Promise((resolve, reject) => {
    try {
      switch (assetType) {
        case 'gltf': {
          const gltfLoader = new GLTFLoader()

          const dracoLoader = new DRACOLoader()
          dracoLoader.setDecoderPath(dracoCompression?.decoderPath || '/draco/gltf/')
          dracoLoader.setDecoderConfig({ type: 'js' })
          gltfLoader.setDRACOLoader(dracoLoader)

          const ktx2Loader = new KTX2Loader()
          ktx2Loader.setTranscoderPath('/ktx2/')
          ktx2Loader.detectSupport(new THREE.WebGLRenderer())
          gltfLoader.setKTX2Loader(ktx2Loader)

          gltfLoader.load(
            sanitizedAssetPath,
            (gltf: GLTF) => {
              resolve(gltf.scene)
            },
            (xhr: ProgressEvent) => {
              const progress = (xhr.loaded / xhr.total) * 100
              onProgress?.(progress)
            },
            (error: any) => {
              console.error('An error occurred while loading the GLTF model:', error)
              reject(
                `Failed to load GLTF model from ${assetPath}. Please check the console for details.`,
              )
            },
          )
          break
        }
        case 'texture': {
          const textureLoader = new THREE.TextureLoader()
          textureLoader.load(
            sanitizedAssetPath,
            (texture: THREE.Texture) => {
              resolve(texture)
            },
            (xhr: ProgressEvent) => {
              const progress = (xhr.loaded / xhr.total) * 100
              onProgress?.(progress)
            },
            (error: any) => {
              console.error('An error occurred while loading the texture:', error)
              reject(`Failed to load texture from ${assetPath}. Please check the console for details.`)
            },
          )
          break
        }
        default:
          reject(`Unsupported asset type: ${assetType}. Cannot load asset from ${assetPath}.`)
      }
    } catch (error: any) {
      console.error('An error occurred while loading the asset:', error)
      reject(`Failed to load asset from ${assetPath}. Please check the console for details.`)
    }
  })
}

export { loadAsset }