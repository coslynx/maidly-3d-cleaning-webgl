import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { useFrame, extend } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import styles from 'src/styles/components/scroll-scene.css'

extend({ OrbitControls })

/**
 * ScrollScene Component
 *
 * Creates a 3D scene with a cube that rotates based on the user's scroll position.
 * It uses React Three Fiber for rendering and integrates with a CSS module for styling.
 *
 * Dependencies:
 *   - react@19.1.0
 *   - three@0.176.0
 *   - @react-three/fiber@9.1.2
 *   - src/styles/components/scroll-scene.css
 *   - three/examples/jsm/controls/OrbitControls
 *
 * Integration Points:
 *   - ExperiencePage.tsx: Renders the ScrollScene component within the experience page.
 */
function ScrollScene(): JSX.Element {
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100),
  )
  const rendererRef = useRef<THREE.WebGLRenderer>(new THREE.WebGLRenderer({ antialias: true }))
  const cubeRef = useRef<THREE.Mesh>(null)
  const controlsRef = useRef<OrbitControls>(null!)

  useEffect(() => {
    try {
      const scene = sceneRef.current
      const camera = cameraRef.current
      const renderer = rendererRef.current

      camera.position.set(0, 0, 3)
      renderer.setSize(window.innerWidth, window.innerHeight)
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      renderer.setClearColor(0x808080)

      const ambientLight = new THREE.AmbientLight(0xffffff, 0.5)
      scene.add(ambientLight)

      const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5)
      directionalLight.position.set(1, 1, 1)
      scene.add(directionalLight)

      const geometry = new THREE.BoxGeometry(1, 1, 1)
      const material = new THREE.MeshStandardMaterial({ color: 0x0077be, roughness: 0.8 })
      const cube = new THREE.Mesh(geometry, material)
      scene.add(cube)
      cubeRef.current = cube

      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controlsRef.current = controls

      const handleResize = (): void => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
      }

      window.addEventListener('resize', handleResize)

      return () => {\
        window.removeEventListener('resize', handleResize)
        renderer.dispose()
      }
    } catch (error: any) {
      console.error('Error initializing Three.js scene:', error)
    }
  }, [])

  useFrame(() => {
    try {
      if (cubeRef.current) {
        const scrollProgress = window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)
        cubeRef.current.rotation.x = scrollProgress * Math.PI * 2
        cubeRef.current.rotation.y = scrollProgress * Math.PI * 2
      }

      if (controlsRef.current) {
        controlsRef.current.update()
      }
    } catch (error: any) {
      console.error('Error in animation loop:', error)
    }
  })

  return (
    <div className={styles.scrollScene} aria-label="3D Scroll Scene">
      <scene ref={sceneRef} />
      <perspectiveCamera ref={cameraRef} />
      <webGLRenderer ref={rendererRef} />
    </div>
  )
}

export default ScrollScene