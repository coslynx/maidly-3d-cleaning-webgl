import React, { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader'
import { DRACOLoader } from 'three/examples/jsm/loaders/DRACOLoader'
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader'
import { useFrame, extend } from '@react-three/fiber'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'
import {
  EffectComposer,
  RenderPass,
  ShaderPass,
} from 'three/examples/jsm/postprocessing/EffectComposer'
import { FXAAShader } from 'three/examples/jsm/shaders/FXAAShader'

extend({ OrbitControls })

/**
 * AdvancedScene Component
 *
 * Initializes and manages an advanced Three.js scene using React Three Fiber,
 * extending the basic scene with model loading, advanced lighting, and
 * post-processing effects. Includes error handling and performance
 * optimization.
 *
 * Dependencies:
 *   - react@19.1.0
 *   - three@0.176.0
 *   - @react-three/fiber@9.1.2
 *   - three/examples/jsm/controls/OrbitControls
 *   - three/examples/jsm/loaders/GLTFLoader
 *   - three/examples/jsm/loaders/DRACOLoader
 *   - three/examples/jsm/loaders/KTX2Loader
 *   - three/examples/jsm/postprocessing/EffectComposer
 *   - three/examples/jsm/shaders/FXAAShader
 *
 * Integration Points:
 *   - LandingHero.tsx: Renders the AdvancedScene component within the
 *     landing page.
 */
function AdvancedScene(): JSX.Element {
  const sceneRef = useRef<THREE.Scene>(new THREE.Scene())
  const cameraRef = useRef<THREE.PerspectiveCamera>(
    new THREE.PerspectiveCamera(
      75,
      window.innerWidth / window.innerHeight,
      0.1,
      100,
    ),
  )
  const rendererRef = useRef<THREE.WebGLRenderer>(
    new THREE.WebGLRenderer({ antialias: true }),
  )
  const modelRef = useRef<THREE.Group | null>(null)
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const controlsRef = useRef<OrbitControls>(null!)
  const composerRef = useRef<EffectComposer | null>(null)

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

      // Model loading
      const gltfLoader = new GLTFLoader()
      const dracoLoader = new DRACOLoader()
      dracoLoader.setDecoderPath('/draco/')
      gltfLoader.setDRACOLoader(dracoLoader)

      const ktx2Loader = new KTX2Loader()
      ktx2Loader.setTranscoderPath('/ktx2/')
      ktx2Loader.detectSupport(renderer)
      gltfLoader.setKTX2Loader(ktx2Loader)

      gltfLoader.load(
        '/models/room.glb',
        (gltf) => {
          const model = gltf.scene
          model.traverse((node: any) => {
            if (node.isMesh) {
              node.castShadow = true
              node.receiveShadow = true
            }
          })
          modelRef.current = model
          scene.add(model)

          if (gltf.animations.length > 0) {
            const mixer = new THREE.AnimationMixer(model)
            mixerRef.current = mixer
            gltf.animations.forEach((clip) => {
              mixer.clipAction(clip).play()
            })
          }
        },
        undefined,
        (error) => {
          console.error('An error happened during model loading', error)
        },
      )

      // Post processing
      const composer = new EffectComposer(renderer)
      composerRef.current = composer
      const renderPass = new RenderPass(scene, camera)
      composer.addPass(renderPass)

      const fxaaPass = new ShaderPass(FXAAShader)
      const pixelRatio = renderer.getPixelRatio()
      fxaaPass.material.uniforms['resolution'].value.x =
        1 / (window.innerWidth * pixelRatio)
      fxaaPass.material.uniforms['resolution'].value.y =
        1 / (window.innerHeight * pixelRatio)
      composer.addPass(fxaaPass)

      // Orbit controls
      const controls = new OrbitControls(camera, renderer.domElement)
      controls.enableDamping = true
      controls.dampingFactor = 0.1
      controlsRef.current = controls

      const handleResize = (): void => {
        camera.aspect = window.innerWidth / window.innerHeight
        camera.updateProjectionMatrix()
        renderer.setSize(window.innerWidth, window.innerHeight)
        composer.setSize(window.innerWidth, window.innerHeight)
        fxaaPass.material.uniforms['resolution'].value.x =
          1 / (window.innerWidth * pixelRatio)
        fxaaPass.material.uniforms['resolution'].value.y =
          1 / (window.innerHeight * pixelRatio)
      }

      window.addEventListener('resize', handleResize)

      return () => {
        window.removeEventListener('resize', handleResize)
        renderer.dispose()

        if (modelRef.current) {
          modelRef.current.traverse((child: any) => {
            if (child.isMesh) {
              child.geometry.dispose()
              if (child.material.map) {
                child.material.map.dispose()
              }
              child.material.dispose()
            }
          })
        }

        if (composerRef.current) {
          composerRef.current.dispose()
        }
      }
    } catch (error: any) {
      console.error('Error initializing Three.js scene:', error)
    }
  }, [])

  useFrame((state, delta) => {
    try {
      if (mixerRef.current) {
        mixerRef.current.update(delta)
      }

      if (controlsRef.current) {
        controlsRef.current.update()
      }
      if (composerRef.current) {
        composerRef.current.render()
      }
    } catch (error: any) {
      console.error('Error in animation loop:', error)
    }
  })

  return <></>
}

export { AdvancedScene }