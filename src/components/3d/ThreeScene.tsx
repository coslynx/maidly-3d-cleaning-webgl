import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * ThreeScene Component
 *
 * Initializes and manages a basic Three.js scene using React Three Fiber.
 * Includes renderer setup, camera, and basic lighting. Provides a
 * fallback mechanism in case of rendering errors.
 *
 * Dependencies:
 * - three@0.176.0
 * - @react-three/fiber@9.1.2
 *
 * Integration Points:
 * - LandingHero.tsx: Integrates the ThreeScene component into the landing page.
 */
function ThreeScene(): JSX.Element {
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100),
  )
  const rendererRef = useRef<THREE.WebGLRenderer>(
    new THREE.WebGLRenderer({ antialias: true }),
  )

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

      const handleResize = (): void => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
      }
    } catch (error: any) {
      console.error('Error initializing Three.js scene:', error)
    }
  }, [])

  useFrame(() => {
    try {
      // Animation loop (no actions for the base MVP)
    } catch (error: any) {
      console.error('Error in animation loop:', error)
    }
  })

  return <></>
}

export { ThreeScene }