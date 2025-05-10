import React from 'react'
import styles from 'src/styles/pages/about.css'
import AboutUsSection from 'src/components/sections/AboutUsSection'

/**
 * AboutPage Component
 *
 * Implements the about page for the BookMaid application, displaying company information.
 * Includes error handling to gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - ./components/sections/AboutUsSection
 * - src/styles/pages/about.css
 *
 * Integration Points:
 * - App.tsx: Renders the AboutPage component as a route.
 */
function AboutPage(): JSX.Element {
  try {
    return (
      <div className={styles.aboutPage} aria-label="About Page">
        <main>
          <AboutUsSection />
        </main>
      </div>
    )
  } catch (error: any) {
    console.error('Error rendering AboutPage component:', error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500" aria-label="About information failed to load.">
            About information failed to load. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}

export default AboutPage