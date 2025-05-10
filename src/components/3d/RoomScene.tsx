import React, { useState, useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { GLTF } from 'three/examples/jsm/loaders/GLTFLoader'
import { ModelLoader } from 'src/components/3d/ModelLoader'

/**
 * RoomScene Component
 *
 * Renders a 3D room environment with a dynamically loaded maid model using
 * Three.js and React Three Fiber. Utilizes ModelLoader to asynchronously load
 * models and includes error handling and resource management.
 *
 * Dependencies:
 *   - react@19.1.0
 *   - three@0.176.0
 *   - @react-three/fiber@9.1.2
 *   - src/components/3d/ModelLoader.tsx
 */
function RoomScene(): JSX.Element {
  const [room, setRoom] = useState<THREE.Group | null>(null)
  const [maid, setMaid] = useState<THREE.Group | null>(null)
  const [loadingProgress, setLoadingProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)

  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100),
  )
  const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer({ antialias: true }))
  const roomRef = useRef<THREE.Group | null>(null)
  const maidRef = useRef<THREE.Group | null>(null)

  useEffect(() => {
    try {
      const scene = sceneRef.current
      const camera = cameraRef.current
      const renderer = rendererRef.current

      camera.position.set(5, 5, 5)
      camera.lookAt(0, 0, 0)

      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(window.devicePixelRatio)
      renderer.setClearColor(0x808080)
      renderer.shadowMap.enabled = true
      renderer.shadowMap.type = THREE.PCFSoftShadowMap

      const ambientLight = new THREE.AmbientLight(0x404040)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
      directionalLight.position.set(1, 1, 1)
      directionalLight.castShadow = true
      scene.add(directionalLight)

      const loadRoom = async (): Promise<void> => {
        const modelPath = '/models/room.glb'

        if (modelPath.startsWith('.') || modelPath.includes('..')) {
          throw new Error('Invalid model path: Relative paths and ".." are not allowed.')
        }

        const sanitizedModelPath = modelPath.replace(/[^a-zA-Z0-9/._-]/g, '')

        const gltfLoader = new THREE.GLTFLoader()
        try {
          gltfLoader.load(
            sanitizedModelPath,
            (gltf: GLTF) => {
              const loadedRoom = gltf.scene
              loadedRoom.traverse((node: any) => {
                if (node.isMesh) {
                  node.castShadow = true
                  node.receiveShadow = true
                }
              })
              scene.add(loadedRoom)
              roomRef.current = loadedRoom
              setRoom(loadedRoom)
            },
            (xhr: ProgressEvent) => {
              const progress = (xhr.loaded / xhr.total) * 100
              setLoadingProgress(progress)
            },
            (error: any) => {
              console.error('An error occurred while loading the room model:', error)
              setError(`Failed to load room model from ${modelPath}.`)
            },
          )
        } catch (err: any) {
          console.error('An error occurred while loading the room model:', err)
          setError(`Failed to load room model from ${modelPath}.`)
        }
      }

      const loadMaid = async (): Promise<void> => {
        const modelPath = '/models/maid-model.glb'

        if (modelPath.startsWith('.') || modelPath.includes('..')) {
          throw new Error('Invalid model path: Relative paths and ".." are not allowed.')
        }

        const sanitizedModelPath = modelPath.replace(/[^a-zA-Z0-9/._-]/g, '')

        const gltfLoader = new THREE.GLTFLoader()
        try {
          gltfLoader.load(
            sanitizedModelPath,
            (gltf: GLTF) => {
              const loadedMaid = gltf.scene
              loadedMaid.traverse((node: any) => {
                if (node.isMesh) {
                  node.castShadow = true
                  node.receiveShadow = true
                }
              })

              loadedMaid.scale.set(0.5, 0.5, 0.5)

              if (roomRef.current) {
                loadedMaid.position.set(-1, 0, 0)
              }
              scene.add(loadedMaid)
              maidRef.current = loadedMaid
              setMaid(loadedMaid)
            },
            (xhr: ProgressEvent) => {
              const progress = (xhr.loaded / xhr.total) * 100
              setLoadingProgress(progress)
            },
            (error: any) => {
              console.error('An error occurred while loading the maid model:', error)
              setError(`Failed to load maid model from ${modelPath}.`)
            },
          )
        } catch (err: any) {
          console.error('An error occurred while loading the maid model:', err)
          setError(`Failed to load maid model from ${modelPath}.`)
        }
      }

      loadRoom()
        .then(() => loadMaid())
        .catch((err) => console.error('Failed to load models:', err))

      const handleResize = (): void => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        renderer.dispose()

        if (roomRef.current) {
          roomRef.current.traverse((child: any) => {
            if (child.isMesh) {
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
              }
              child.material.dispose()
            }
          })
        }

        if (maidRef.current) {
          maidRef.current.traverse((child: any) => {
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
    } catch (error: any) {
      console.error('Error initializing Three.js scene:', error)
      setError('Failed to initialize 3D scene.')
    }
  }, [])

  useFrame(() => {
    try {
      // Animation loop (no actions for the base MVP)
    } catch (error: any) {
      console.error('Error in animation loop:', error)
    }
  })

  if (error) {
    return <div className="text-red-500">Error: {error}</div>
  }

  return (
    <div>
      {loadingProgress < 100 && (
        <div className="progress-bar">Loading: {loadingProgress.toFixed(2)}%</div>
      )}
    </div>
  )
}

export default RoomScene