import { useState, useEffect, useRef, useCallback } from 'react'
import * as THREE from 'three'
import { throttle } from 'lodash'
import { useFrame } from '@react-three/fiber'

/**
 * useScrollAnimation Hook
 *
 * Drives animations based on scroll position, providing a scroll progress value.
 *
 * @param sceneRef - A React.RefObject<THREE.Scene> representing the Three.js scene to be animated.
 *
 * @returns An object containing:
 *   - scrollProgress: A number between 0 and 1 representing the scroll progress.
 *   - error: A string or null indicating any errors encountered.
 */
function useScrollAnimation(sceneRef: React.RefObject<THREE.Scene>): {
  scrollProgress: number
  error: string | null
} {
  const [scrollProgress, setScrollProgress] = useState<number>(0)
  const [error, setError] = useState<string | null>(null)
  const throttledSetScrollProgress = useRef(
    throttle((progress: number) => {
      setScrollProgress(progress)
    }, 16),
  ).current

  useEffect(() => {
    if (!sceneRef.current) {
      console.warn(
        'useScrollAnimation: sceneRef.current is null. Ensure the scene is properly initialized.',
      )
      setError(
        'useScrollAnimation: sceneRef.current is null. Ensure the scene is properly initialized.',
      )
    }
  }, [sceneRef])

  useEffect(() => {
    let isMounted = true

    const handleScroll = (): void => {
      try {
        if (!sceneRef.current) {
          console.warn(
            'useScrollAnimation: sceneRef.current is null during scroll calculation. Check scene initialization.',
          )
          setError(
            'useScrollAnimation: sceneRef.current is null during scroll calculation. Check scene initialization.',
          )
          return
        }

        if (
          typeof window.scrollY !== 'number' ||
          typeof document.documentElement.scrollHeight !== 'number' ||
          typeof window.innerHeight !== 'number'
        ) {
          const errorMessage =
            'useScrollAnimation: Required scroll properties are not available.'
          console.warn(errorMessage)
          setError(errorMessage)
          return
        }
        const validatedScrollY = Math.max(0, window.scrollY)
        const validatedScrollHeight = Math.max(0, document.documentElement.scrollHeight)
        const validatedInnerHeight = Math.max(0, window.innerHeight)

        let calculatedScrollProgress =
          validatedScrollY / (validatedScrollHeight - validatedInnerHeight)

        calculatedScrollProgress = Math.max(0, Math.min(1, calculatedScrollProgress))
        if (isMounted) {
          throttledSetScrollProgress(calculatedScrollProgress)
        }
      } catch (err: any) {
        const errorMessage = `useScrollAnimation: Error calculating scroll progress: ${err.message}`
        console.error(errorMessage)
        setError(errorMessage)
      }
    }

    window.addEventListener('scroll', handleScroll)

    return () => {
      window.removeEventListener('scroll', handleScroll)
      throttledSetScrollProgress.cancel()
      isMounted = false
    }
  }, [sceneRef, throttledSetScrollProgress])

  return { scrollProgress, error }
}

export default useScrollAnimation