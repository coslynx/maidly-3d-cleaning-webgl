import React from 'react'
import styles from 'src/styles/pages/home.css'
import LandingHero from 'src/components/sections/LandingHero'
import ServicesSection from 'src/components/sections/ServicesSection'
import AboutUsSection from 'src/components/sections/AboutUsSection'
import ContactSection from 'src/components/sections/ContactSection'
import TestimonialsSection from 'src/components/sections/TestimonialsSection'

/**
 * HomePage Component
 *
 * Implements the main landing page for the BookMaid application, displaying key sections
 * including a 3D hero section, services overview, about us information, a contact
 * section, and customer testimonials.
 *
 * Dependencies:
 * - react@19.1.0
 * - ./components/sections/LandingHero
 * - ./components/sections/ServicesSection
 * - ./components/sections/AboutUsSection
 * - ./components/sections/ContactSection
 * - ./components/sections/TestimonialsSection
 * - src/styles/pages/home.css
 *
 * Integration Points:
 * - App.tsx: Renders the HomePage component as the main route.
 */
function HomePage(): JSX.Element {
  return (
    <div className={styles.homePage} aria-label="Home Page">
      <main>
        <section className="mb-16">
          <LandingHero />
        </section>
        <section className="mb-16">
          <ServicesSection />
        </section>
        <section className="mb-16">
          <AboutUsSection />
        </section>
        <section className="mb-16">
          <ContactSection />
        </section>
        <section className="mb-16">
          <TestimonialsSection />
        </section>
      </main>
    </div>
  )
}

export default HomePage