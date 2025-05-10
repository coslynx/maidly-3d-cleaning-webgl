import React from 'react'
import styles from 'src/styles/pages/contact.css'
import ContactSection from 'src/components/sections/ContactSection'

/**
 * ContactPage Component
 *
 * Implements the contact page for the BookMaid application, displaying a contact form.
 * Includes error handling to gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - ./components/sections/ContactSection
 * - src/styles/pages/contact.css
 *
 * Integration Points:
 * - App.tsx: Renders the ContactPage component as a route.
 */
function ContactPage(): JSX.Element {
  try {
    return (
      <div className={styles.contactPage} aria-label="Contact Page">
        <main>
          <ContactSection />
        </main>
      </div>
    )
  } catch (error: any) {
    console.error('Error rendering ContactPage component:', error)
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <p className="text-red-500" aria-label="Contact form failed to load.">
            Contact form failed to load. Please try again later.
          </p>
        </div>
      </div>
    )
  }
}

export default ContactPage