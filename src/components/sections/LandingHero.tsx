import React from 'react'
import styles from 'src/styles/components/landing-hero.css'
import { ThreeScene } from 'src/components/3d/ThreeScene'
import { AdvancedScene } from 'src/components/3d/AdvancedScene'
import { useToggle } from 'src/hooks/useToggle'

/**
 * LandingHero Component
 *
 * Implements the hero section of the landing page, integrating a 3D scene and
 * presenting key information to capture user attention. Includes error handling
 * to gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - ./3d/ThreeScene
 * - ./3d/AdvancedScene
 * - src/styles/components/landing-hero.css
 * - src/hooks/useToggle
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function LandingHero(): JSX.Element {
  try {
    const [useAdvancedScene, toggleAdvancedScene] = useToggle(false)

    return (
      <section className={styles.landingHero}>
        <div className="relative isolate overflow-hidden bg-gray-900 py-24 sm:py-32">
          <div className="mx-auto max-w-7xl px-6 lg:px-8">
            <div className="mx-auto max-w-2xl">
              <h2 className="text-3xl font-bold tracking-tight text-white sm:text-4xl">
                BookMaid Simple Cleaning Scheduling
              </h2>
              <p className="mt-6 text-lg leading-8 text-gray-300">
                Schedule your house cleaning easily with our online platform! Experience a new level of clean with our maid service
              </p>
            </div>
            <div className="mt-10 flex items-center justify-center">
              <button
                id="advanced-button"
                className="inline-flex items-center rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
                onClick={toggleAdvancedScene}
                aria-label="Enable/Disable Advanced Scene"
              >
                {useAdvancedScene ? 'Disable Advanced Scene' : 'Enable Advanced Scene'}
              </button>
            </div>
            <div className="absolute inset-0 -z-10 h-full w-full object-cover" aria-hidden="true">
              {useAdvancedScene ? (
                <AdvancedScene key="advanced" />
              ) : (
                <ThreeScene key="basic" />
              )}
            </div>
          </div>
        </div>
      </section>
    )
  } catch (error: any) {
    console.error('Error rendering LandingHero component:', error)
    return (
      <section className="bg-gray-100 py-12">
        <div className="container mx-auto text-center">
          <p className="text-red-500">An error occurred while loading the hero section. Please try again later.</p>
        </div>
      </section>
    )
  }
}

export default LandingHero