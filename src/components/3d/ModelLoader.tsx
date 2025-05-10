import React, { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { MeshoptDecoder } from 'three/examples/jsm/libs/meshopt_decoder.module'

/**
 * DracoCompression interface to support custom decoder path
 */
interface DracoCompression {
  decoderPath?: string
}

/**
 * ModelLoader Component
 *
 * Asynchronously loads 3D models (GLTF/GLB format) using Three.js and
 * handles Draco compression and KTX2 textures.
 *
 * Dependencies:
 * - three@0.176.0
 * - three/examples/jsm/loaders/GLTFLoader
 * - three/examples/jsm/loaders/DRACOLoader
 * - three/examples/jsm/loaders/KTX2Loader
 * - three/examples/jsm/libs/meshopt_decoder.module
 */
function ModelLoader(): JSX.Element {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const loadModel = useCallback(
    async (
      modelPath: string,
      progressCallback?: (progress: number) => void,
      dracoCompression?: DracoCompression,
    ): Promise<void> => {
      if (!modelPath) {
        setError('Model path cannot be empty.')
        return
      }

      if (modelPath.startsWith('.') || modelPath.includes('..')) {
        setError('Invalid model path: Relative paths and ".." are not allowed.')
        return
      }

      const sanitizedModelPath = modelPath.replace(/[^a-zA-Z0-9/._-]/g, '')

      const gltfLoader = new GLTFLoader()

      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath(dracoCompression?.decoderPath || '/draco/gltf/')
      dracoLoader.setDecoderConfig({ type: 'js' })
      gltfLoader.setDRACOLoader(dracoLoader)

      const ktx2Loader = new KTX2Loader()
      ktx2Loader.setTranscoderPath('/ktx2/')
      ktx2Loader.detectSupport(rendererRef.current)
      gltfLoader.setKTX2Loader(ktx2Loader)
      gltfLoader.setMeshoptDecoder(MeshoptDecoder)

      try {
        gltfLoader.load(
          sanitizedModelPath,
          (gltf: GLTF) => {
            setModel(gltf.scene)
          },
          (xhr: ProgressEvent) => {
            const progress = (xhr.loaded / xhr.total) * 100
            setLoadingProgress(progress)
            progressCallback?.(progress)
          },
          (err: any) => {
            console.error('An error occurred while loading the model:', err)
            setError(`Failed to load model from ${modelPath}. Please check the console for details.`)
          },
        )
      } catch (err: any) {
        console.error('An error occurred while loading the model:', err)
        setError(`Failed to load model from ${modelPath}. Please check the console for details.`)
      }
    },
    [],
  )

  const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer())

  useEffect(() => {
    rendererRef.current = new THREE.WebGLRenderer() // Corrected line

    loadModel('/models/maid-model.glb')
      .then(() => console.log('Model loaded successfully'))
      .catch((err) => console.error('Failed to load model:', err))

    return () => {
      // Clean up resources
      rendererRef.current.dispose()

      if (model) {
        model.traverse((child: any) => {
          if (child.isMesh) {
            child.geometry.dispose()
            if (child.material.map) {
              child.material.map.dispose()
            }
            child.material.dispose()
          }
        })
      }
    }
  }, [loadModel])

  const useModel = (): { model: THREE.Group | null; error: string | null } => {
    return { model, error }
  }

  if (error) {
    return (
      <div className="text-red-500">
        Error: {error}
      </div>
    )
  }

  return (
    <div>
      {loadingProgress < 100 && (
        <div className="progress-bar">
          Loading Model: {loadingProgress.toFixed(2)}%
        </div>
      )}
    </div>
  )
}

export { ModelLoader }