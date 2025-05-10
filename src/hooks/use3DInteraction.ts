import { useState, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { useFrame, useThree } from '@react-three/fiber'
import { throttle } from 'lodash'

/**
 * InteractionResult Interface
 *
 * Defines the structure for the interaction result, including the intersected object
 * and the intersection point.
 */
interface InteractionResult {
  intersectedObject: THREE.Object3D | null
  intersectionPoint: THREE.Vector3 | null
}

/**
 * use3DInteraction Hook
 *
 * Implements raycasting for 3D object interaction within a Three.js scene managed by React Three Fiber.
 * Handles pointer down and move events to detect intersections. Includes error handling and input validation.
 *
 * Dependencies:
 *   - react@19.1.0
 *   - three@0.176.0
 *   - @react-three/fiber@9.1.2
 *   - lodash.throttle
 *
 * Integration Points:
 *   - ThreeScene.tsx, ScrollScene.tsx, AdvancedScene.tsx: Integrates the interaction logic into the 3D scenes.
 */
function use3DInteraction(
  sceneRef: React.RefObject<THREE.Scene>,
  cameraRef: React.RefObject<THREE.Camera>,
): {
  interactionResult: InteractionResult
  handlePointerDown: (event: React.MouseEvent) => void
  handlePointerMove: (event: React.MouseEvent) => void
  handlePointerOut: () => void
} {
  const [interactionResult, setInteractionResult] = useState<InteractionResult>({
    intersectedObject: null,
    intersectionPoint: null,
  })
  const raycasterRef = useRef<THREE.Raycaster>(new THREE.Raycaster())

  const handlePointer = useCallback(
    throttle((event: React.MouseEvent, checkIntersection: boolean) => {
      if (!sceneRef.current || !cameraRef.current) {
        console.warn(
          'use3DInteraction: Scene or camera not initialized. Ensure sceneRef and cameraRef are properly set.',
        )
        return
      }

      try {
        const rect = (event.target as HTMLCanvasElement).getBoundingClientRect()
        const x = ((event.clientX - rect.left) / rect.width) * 2 - 1
        const y = -((event.clientY - rect.top) / rect.height) * 2 + 1

        if (isNaN(x) || isNaN(y)) {
          console.error('use3DInteraction: Invalid coordinates. Ensure valid mouse position.')
          return
        }

        const raycaster = raycasterRef.current
        const mouseVector = new THREE.Vector2(x, y)

        raycaster.setFromCamera(mouseVector, cameraRef.current)

        const intersects = raycaster.intersectObjects(sceneRef.current.children, true)

        if (intersects.length > 0 && checkIntersection) {
          setInteractionResult({
            intersectedObject: intersects[0].object,
            intersectionPoint: intersects[0].point,
          })
        } else {
          setInteractionResult({
            intersectedObject: null,
            intersectionPoint: null,
          })
        }
      } catch (error: any) {
        console.error('use3DInteraction: Error during raycasting: ' + error.message)
      }
    }, 16),
    [sceneRef, cameraRef],
  )

  const handlePointerDown = useCallback(
    (event: React.MouseEvent) => {
      handlePointer(event, true)
    },
    [handlePointer],
  )

  const handlePointerMove = useCallback(
    (event: React.MouseEvent) => {
      handlePointer(event, true)
    },
    [handlePointer],
  )

  const handlePointerOut = useCallback(() => {
    setInteractionResult({
      intersectedObject: null,
      intersectionPoint: null,
    })
  }, [])

  return { interactionResult, handlePointerDown, handlePointerMove, handlePointerOut }
}

export default use3DInteraction