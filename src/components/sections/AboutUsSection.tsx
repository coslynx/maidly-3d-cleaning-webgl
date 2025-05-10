import React, { useState, useEffect } from 'react'
import styles from 'src/styles/components/about-us-section.css'
import DOMPurify from 'dompurify'

interface AboutUsData {
  title: string
  mission: string
  values: string[]
  history: {
    year: number
    event: string
  }[]
  teamMembers: {
    name: string
    role: string
    imageUrl: string
    bio: string
  }[]
}

/**
 * AboutUsSection Component
 *
 * Implements a section displaying information about BookMaid, including the
 * company's mission, values, and a brief history. Includes error handling to
 * gracefully handle any rendering issues.
 *
 * Dependencies:
 * - react@19.1.0
 * - src/styles/components/about-us-section.css
 * - src/data/about-us.json
 * - DOMPurify
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function AboutUsSection(): JSX.Element {
  const [aboutUsData, setAboutUsData] = useState<AboutUsData | null>(null)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    const fetchAboutUsData = async (): Promise<void> => {
      try {
        const response = await import('src/data/about-us.json')
        if (!response) {
          throw new Error('Failed to load about us data')
        }
        if (isMounted) {
          setAboutUsData(response.default)
          setLoading(false)
        }
      } catch (e: any) {
        console.error('Error fetching about us data:', e)
        if (isMounted) {
          setError('Failed to load about us. Please try again later.')
          setLoading(false)
        }
      }
    }

    fetchAboutUsData()

    return () => {
      isMounted = false
    }
  }, [])

  const sanitize = (html: string): string => DOMPurify.sanitize(html)

  if (loading) {
    return (
      <section className="py-12">
        <div className="container mx-auto text-center">Loading about us information...</div>
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
    <section className="py-12" aria-label="About BookMaid">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-primary-dark-gray mb-8 text-center font-roboto">
          {sanitize(aboutUsData.title)}
        </h2>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-primary-dark-gray mb-4 font-roboto">Our Mission</h3>
          <p className="text-secondary-gray">{sanitize(aboutUsData.mission)}</p>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-primary-dark-gray mb-4 font-roboto">Our Values</h3>
          <ul className="list-disc pl-5 text-secondary-gray">
            {aboutUsData.values.map((value, index) => (
              <li key={index}>{sanitize(value)}</li>
            ))}
          </ul>
        </div>

        <div className="mb-8">
          <h3 className="text-2xl font-semibold text-primary-dark-gray mb-4 font-roboto">Our History</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {aboutUsData.history.map((historyEvent) => (
              <div key={historyEvent.year} className="bg-primary-white rounded-lg shadow-md p-4">
                <h4 className="text-xl font-semibold text-primary-dark-gray font-roboto">{historyEvent.year}</h4>
                <p className="text-secondary-gray">{sanitize(historyEvent.event)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-semibold text-primary-dark-gray mb-4 text-center font-roboto">Our Team</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutUsData.teamMembers.map((teamMember) => (
              <div
                key={teamMember.name}
                className="bg-primary-white rounded-lg shadow-md overflow-hidden"
                aria-label={`Team Member: ${teamMember.name}`}
              >
                <img
                  src={teamMember.imageUrl.startsWith('/') ? teamMember.imageUrl : `/images/default-team-member.jpg`}
                  alt={teamMember.name}
                  className="w-full h-48 object-cover"
                  onError={(e: any) => {
                    e.target.onerror = null
                    e.target.src = '/images/default-team-member.jpg'
                  }}
                />
                <div className="p-4">
                  <h4 className="text-xl font-semibold text-primary-dark-gray mb-2 font-roboto">{sanitize(teamMember.name)}</h4>
                  <p className="text-secondary-gray text-sm mb-2">{sanitize(teamMember.role)}</p>
                  <p
                    className="text-secondary-gray text-sm"
                    dangerouslySetInnerHTML={{ __html: sanitize(teamMember.bio) }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}

export default AboutUsSection