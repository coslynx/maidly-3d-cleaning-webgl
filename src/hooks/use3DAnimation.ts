import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'

/**
 * AnimationControls Interface
 *
 * Defines the methods for controlling 3D animations.
 */
interface AnimationControls {
  play(name: string): void
  pause(name: string): void
  stop(name: string): void
  setWeight(name: string, weight: number): void
}

/**
 * use3DAnimation Hook
 *
 * Manages 3D animations within a Three.js scene using React Three Fiber.
 * Provides controls for playing, pausing, stopping, and setting the weight of animations.
 * Includes error handling and resource management.
 *
 * Dependencies:
 *   - react@19.1.0
 *   - three@0.176.0
 *   - @react-three/fiber@9.1.2
 *
 * Integration Points:
 *   - AdvancedScene.tsx: Integrates the animation controls into the advanced scene.
 */
function use3DAnimation(object: THREE.Object3D | THREE.Group | null): {
  controls: AnimationControls | null
  isInitialized: boolean
} {
  const mixerRef = useRef<THREE.AnimationMixer | null>(null)
  const clipsRef = useRef<{ [clipName: string]: THREE.AnimationClip }>({})
  const actionsRef = useRef<{ [actionName: string]: THREE.AnimationAction }>({})
  const [isInitialized, setIsInitialized] = useState<boolean>(false)

  useEffect(() => {
    if (!object) {
      console.warn('use3DAnimation: Object is null, cannot initialize animations.')
      return
    }

    try {
      const mixer = new THREE.AnimationMixer(object)
      mixerRef.current = mixer

      const animationClips = (object as any).animations as THREE.AnimationClip[] | undefined

      if (!animationClips || animationClips.length === 0) {
        console.warn('use3DAnimation: Object has no animations.')
        return
      }

      const newClips: { [clipName: string]: THREE.AnimationClip } = {}
      const newActions: { [actionName: string]: THREE.AnimationAction } = {}

      animationClips.forEach((clip) => {
        newClips[clip.name] = clip
        const action = mixer.clipAction(clip)
        newActions[clip.name] = action
      })

      clipsRef.current = newClips
      actionsRef.current = newActions
      setIsInitialized(true)
    } catch (error: any) {
      console.error('use3DAnimation: Error initializing animations:', error)
    }

    return () => {
      // Clean up resources on unmount
      setIsInitialized(false)
      for (const actionName in actionsRef.current) {
        if (actionsRef.current.hasOwnProperty(actionName)) {
          try {
            actionsRef.current[actionName].stop()
            actionsRef.current[actionName].reset()
          } catch (error: any) {
            console.error(`use3DAnimation: Error stopping action "${actionName}":`, error)
          }
        }
      }
      mixerRef.current?.uncacheRoot(object)
      mixerRef.current = null
      clipsRef.current = {}
      actionsRef.current = {}
    }
  }, [object])

  useFrame((_, delta) => {
    try {
      mixerRef.current?.update(delta)
    } catch (error: any) {
      console.error('use3DAnimation: Error in animation loop:', error)
    }
  })

  const controls = useCallback<AnimationControls>(
    () => ({
      play: (name: string) => {
        if (!actionsRef.current[name]) {
          console.warn(`use3DAnimation: Animation "${name}" not found.`)
          return
        }
        try {
          actionsRef.current[name].reset().fadeIn(0.25).play()
        } catch (error: any) {
          console.error(`use3DAnimation: Error playing animation "${name}":`, error)
        }
      },
      pause: (name: string) => {
        if (!actionsRef.current[name]) {
          console.warn(`use3DAnimation: Animation "${name}" not found.`)
          return
        }
        try {
          actionsRef.current[name].pause()
        } catch (error: any) {
          console.error(`use3DAnimation: Error pausing animation "${name}":`, error)
        }
      },
      stop: (name: string) => {
        if (!actionsRef.current[name]) {
          console.warn(`use3DAnimation: Animation "${name}" not found.`)
          return
        }
        try {
          actionsRef.current[name].stop().reset()
        } catch (error: any) {
          console.error(`use3DAnimation: Error stopping animation "${name}":`, error)
        }
      },
      setWeight: (name: string, weight: number) => {
        if (!actionsRef.current[name]) {
          console.warn(`use3DAnimation: Animation "${name}" not found.`)
          return
        }
        const sanitizedWeight = Math.max(0, Math.min(1, weight))
        try {
          actionsRef.current[name].weight = sanitizedWeight
        } catch (error: any) {
          console.error(`use3DAnimation: Error setting weight for animation "${name}":`, error)
        }
      },
    }),
    [],
  )

  return { controls: isInitialized ? controls() : null, isInitialized }
}

export default use3DAnimation