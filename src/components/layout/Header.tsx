import React from 'react'
import { Link } from 'react-router-dom'
import styles from 'src/styles/layout/header.css'

/**
 * Header Component
 *
 * Implements the main navigation header for the application.
 *
 * Dependencies:
 * - react@19.1.0
 * - react-router-dom
 * - src/styles/layout/header.css
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function Header(): JSX.Element {
  try {
    return (
      <header className="bg-primary-white shadow-md py-4">
        <div className="container mx-auto flex items-center justify-between">
          <Link to="/" className="text-2xl font-bold text-primary-dark-gray font-roboto" aria-label="BookMaid Home">
            BookMaid
          </Link>
          <nav aria-label="Main Navigation">
            <ul className="flex space-x-6">
              <li>
                <Link to="/" className="text-primary-dark-gray hover:text-accent-blue transition-colors duration-200" aria-label="Home page">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="text-primary-dark-gray hover:text-accent-blue transition-colors duration-200" aria-label="About us page">
                  About
                </Link>
              </li>
              <li>
                <Link to="/experience" className="text-primary-dark-gray hover:text-accent-blue transition-colors duration-200" aria-label="Experience page">
                  Experience
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-primary-dark-gray hover:text-accent-blue transition-colors duration-200" aria-label="Contact us page">
                  Contact
                </Link>
              </li>
            </ul>
          </nav>
        </div>
      </header>
    )
  } catch (error: any) {
    console.error('Error rendering Header component:', error)
    return (
      <header className="bg-primary-white shadow-md py-4">
        <div className="container mx-auto flex items-center justify-center">
          <p className="text-red-500">Navigation failed to load. Please try again later.</p>
        </div>
      </header>
    )
  }
}

export default Header