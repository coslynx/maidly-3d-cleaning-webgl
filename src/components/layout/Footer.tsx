import React from 'react'
import styles from 'src/styles/layout/footer.css'

/**
 * Footer Component
 *
 * Implements the footer for the application, displaying copyright information.
 *
 * Dependencies:
 * - react@19.1.0
 * - src/styles/layout/footer.css
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function Footer(): JSX.Element {
  try {
    const currentYear = new Date().getFullYear()

    return (
      <footer className="bg-primary-white py-4">
        <div className="container mx-auto text-center">
          <p>© {currentYear} BookMaid. All rights reserved.</p>
        </div>
      </footer>
    )
  } catch (error: any) {
    console.error('Error rendering Footer component:', error)
    return (
      <footer className="bg-primary-white py-4">
        <div className="container mx-auto text-center">
          <p className="text-red-500">Footer failed to load. Please try again later.</p>
        </div>
      </footer>
    )
  }
}

export default Footer