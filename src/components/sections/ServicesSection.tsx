import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import styles from 'src/styles/components/services-section.css'

interface Service {
  id: number
  name: string
  description: string
  imageUrl: string
  price: number
  features: string[]
}

/**
 * ServicesSection Component
 *
 * Implements a section displaying a list of cleaning services offered by BookMaid.
 * It fetches service data from a local JSON file and presents each service as a card.
 * Includes error handling to gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - react-router-dom@6.0.0
 * - src/styles/components/services-section.css
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function ServicesSection(): JSX.Element {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchServices = async (): Promise<void> => {
      try {
        const response = await import('src/data/services.json')
        if (!response) {
          throw new Error('Failed to load services data')
        }
        setServices(response.default)
        setLoading(false)
      } catch (e: any) {
        console.error('Error fetching services:', e)
        setError('Failed to load services. Please try again later.')
        setLoading(false)
      }
    }

    fetchServices()
  }, [])

  if (loading) {
    return (
      <section className=\"py-12\">
        <div className=\"container mx-auto text-center\">Loading services...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className=\"py-12\">
        <div className=\"container mx-auto text-center\">
          <p className=\"text-red-500\">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className=\"py-12\" aria-label=\"Cleaning Services\">
      <div className=\"container mx-auto\">
        <h2 className=\"text-3xl font-bold text-primary-dark-gray mb-8 text-center font-roboto\">Our Services</h2>
        <div className=\"grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6\">
          {services.map((service) => (
            <div
              key={service.id}
              className=\"bg-primary-white rounded-lg shadow-md overflow-hidden flex flex-col justify-between\"
              aria-label={`Service: ${service.name}`}
            >
              <div>
                <img
                  src={service.imageUrl.startsWith('/') ? service.imageUrl : `/images/basic-cleaning.jpg`}
                  alt={service.name}
                  className=\"w-full h-48 object-cover\"
                  onError={(e: any) => {
                    e.target.onerror = null
                    e.target.src = '/images/basic-cleaning.jpg'
                  }}
                />
                <div className=\"p-4\">
                  <h3 className=\"text-xl font-semibold text-primary-dark-gray mb-2 font-roboto\">{service.name}</h3>
                  <p className=\"text-secondary-gray text-sm mb-4\">{service.description}</p>
                  <ul className=\"list-disc pl-5 text-secondary-gray text-sm mb-4\">
                    {service.features.map((feature, index) => (
                      <li key={index}>{feature}</li>
                    ))}
                  </ul>
                </div>
              </div>
              <div className=\"p-4\">
                <Link
                  to={{
                    pathname: '/contact',
                    search: `?prefill=${encodeURIComponent(`I am interested in the ${service.name} service.`)}`,
                  }}
                  className=\"inline-block bg-accent-blue text-primary-white py-2 px-4 rounded-md hover:bg-indigo-400 transition-colors duration-200 text-sm font-semibold text-center\"
                  aria-label={`Book ${service.name} Now`}
                >
                  Book Now - ${service.price}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default ServicesSection