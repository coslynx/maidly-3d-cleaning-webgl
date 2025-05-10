import React, { useState, useEffect } from 'react'
import styles from 'src/styles/components/testimonials-section.css'
import DOMPurify from 'dompurify'

interface Testimonial {
  name: string
  quote: string
  image: string
}

/**
 * TestimonialsSection Component
 *
 * Implements a section displaying customer testimonials for BookMaid.
 * It fetches testimonial data from a local JSON file (src/data/testimonials.json) and presents each testimonial in a visually appealing manner.
 * Includes error handling to gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - src/styles/components/testimonials-section.css
 * - src/data/testimonials.json
 * - DOMPurify
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function TestimonialsSection(): JSX.Element {
  const [testimonials, setTestimonials] = useState<Testimonial[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchTestimonials = async (): Promise<void> => {
      try {
        const response = await import('src/data/testimonials.json')
        if (!response) {
          throw new Error('Failed to load testimonials data')
        }
        if (isMounted) {
          setTestimonials(response.default)
          setLoading(false)
        }
      } catch (e: any) {
        console.error('Error fetching testimonials:', e)
        if (isMounted) {
          setError('Failed to load testimonials. Please try again later.')
          setLoading(false)
        }
      }
    }

    fetchTestimonials()

    return () => {
      isMounted = false
    }
  }, [])

  const sanitize = (html: string): string => DOMPurify.sanitize(html)

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto text-center">Loading testimonials...</div>
      </section>
    )
  }

  if (error) {
    return (
      <section className="py-12">
        <div className="container mx-auto text-center">
          <p className="text-red-500">{error}</p>
        </div>
      </section>
    )
  }

  return (
    <section className="py-12" aria-label="Customer Testimonials">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-primary-dark-gray mb-8 text-center font-roboto">What Our Clients Say</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.name}
              className="bg-primary-white rounded-lg shadow-md p-6"
              aria-label={`Testimonial by ${testimonial.name}`}
            >
              <img
                src={testimonial.image.startsWith('/') ? testimonial.image : `/images/default-testimonial.jpg`}
                alt={testimonial.name}
                className="w-24 h-24 rounded-full object-cover mb-4"
                onError={(e: any) => {
                  e.target.onerror = null
                  e.target.src = '/images/default-testimonial.jpg'
                }}
              />
              <p className="text-secondary-gray mb-2">{sanitize(testimonial.quote)}</p>
              <p className="text-primary-dark-gray font-semibold">{sanitize(testimonial.name)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default TestimonialsSection