import React from 'react'
import styles from 'src/styles/pages/home.css'
import ScrollScene from 'src/components/3d/ScrollScene'

/**
 * ExperiencePage Component
 *
 * Implements the experience page for the BookMaid application, displaying an interactive 3D scroll scene.
 * Includes error handling to gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - ./components/3d/ScrollScene
 * - src/styles/pages/home.css
 *
 * Integration Points:
 * - App.tsx: Renders the ExperiencePage component as a route.
 */
function ExperiencePage(): JSX.Element {
  try {
    return (
      <div className={styles.homePage} aria-label="Experience Page">
        <main>
          <section className="mb-16">
            <ScrollScene />
          </section>
        </main>
      </div>
    )
  } catch (error: any) {
    console.error('Error rendering ExperiencePage component:', error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500" aria-label="Experience failed to load.">
            Experience failed to load. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}

export default ExperiencePage