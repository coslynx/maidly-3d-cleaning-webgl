import React, { Suspense, useRef, useEffect, useState } from 'react'
import * as THREE from 'three'
import { Canvas, useFrame } from '@react-three/fiber'
import { GLTF, GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { OrbitControls, Environment } from '@react-three/drei'
import styles from 'src/styles/pages/model-showcase.css'
import {ErrorBoundary} from 'src/App'

interface ModelShowcaseProps {
  modelPath?: string
}

function ModelShowcase({ modelPath }: ModelShowcaseProps): JSX.Element {
  const [model, setModel] = useState<THREE.Group | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)
  const orbitControlsRef = useRef<OrbitControls>(null!)

  useEffect(() => {
    const loadGLTFModel = async (path: string) => {
      setLoading(true)
      setError(null)

      const sanitizedPath = path.replace(/[^a-zA-Z0-9/._-]/g, '')

      try {
        const gltfLoader = new GLTFLoader()
        gltfLoader.load(
          sanitizedPath,
          (gltf: GLTF) => {
            setModel(gltf.scene)
          },
          (progress: ProgressEvent) => {
            // Optional: Implement progress updates
            //console.log('Model loading progress: ', progress)
          },
          (error: any) => {
            console.error('An error occurred while loading the model:', error)
            setError(`Failed to load model from ${path}. Please check the console for details.`)
          },
        )
      } catch (err: any) {
        console.error('An error occurred while loading the model:', err)
        setError(`Failed to load model from ${path}. Please check the console for details.`)
      } finally {
        setLoading(false)
      }
    }

    loadGLTFModel(modelPath || '/models/maid-model.glb')
  }, [modelPath])

  useFrame((state, delta) => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.update(delta)
    }
  })

  return (
    <div className={`flex items-center justify-center h-screen w-screen ${styles.modelShowcasePage}`} aria-label="Model Showcase Page">
      {error && (
        <div className="text-red-500 text-center">
          Error: {error}
        </div>
      )}

      {loading && !error ? (
        <div className="text-center">Loading model...</div>
      ) : (
        <Canvas
          className="!h-[600px] !w-[800px]"
          camera={{ position: [5, 5, 5] }}
        >
            <OrbitControls
              enableDamping
              dampingFactor={0.1}
              minDistance={5}
              maxDistance={15}
              ref={orbitControlsRef}
            />
            <Suspense fallback={null}>
              {model && <primitive object={model} />}
              <Environment preset="sunset" />
            </Suspense>
        </Canvas>
      )}
    </div>
  )
}

export default ModelShowcase