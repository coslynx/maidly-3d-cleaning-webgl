import React, { useState } from 'react'
import styles from 'src/styles/components/contact-section.css'
import { BookingForm } from 'src/components/ui/BookingForm'
import emailjs from '@emailjs/browser'
import DOMPurify from 'dompurify'

interface ContactFormValues {
  name: string
  email: string
  message: string
}

/**
 * ContactSection Component
 *
 * Implements a contact form and displays contact information for BookMaid.
 * Utilizes EmailJS for sending emails and includes comprehensive error handling and input validation.
 *
 * Dependencies:
 * - react@19.1.0
 * - @emailjs/browser@4.4.1
 * - src/styles/components/contact-section.css
 * - src/components/ui/BookingForm.tsx
 * - DOMPurify
 *
 * Dependencies and paths are verified according to the package.json versions.
 */
function ContactSection(): JSX.Element {
  const [formValues, setFormValues] = useState<ContactFormValues>({
    name: '',
    email: '',
    message: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!formValues.name) {
      newErrors.name = 'Name is required'
    } else if (!/^[a-zA-Z\s]*$/.test(formValues.name)) {
      newErrors.name = 'Name can only contain letters and spaces'
    }

    if (!formValues.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formValues.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formValues.message) {
      newErrors.message = 'Message is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = event.target
    setFormValues({ ...formValues, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()
    if (isLoading) return

    if (!validate()) {
      return
    }

    setIsSubmitting(true)
    setErrorMessage(null)
    setSuccessMessage(null)

    try {
      setIsLoading(true)
      const serviceId = 'service_id'
      const templateId = 'template_id'
      const publicKey = 'publicKey'

      if (!serviceId || !templateId || !publicKey) {
        throw new Error('EmailJS configuration missing')
      }

      await emailjs.sendForm(serviceId, templateId, event.target as HTMLFormElement, publicKey)

      setSuccessMessage('Your message has been sent successfully!')
      setFormValues({ name: '', email: '', message: '' })
      setErrors({})
    } catch (error: any) {
      console.error('Failed to send email:', error)
      setErrorMessage('Failed to send your message. Please try again later.')
    } finally {
      setIsSubmitting(false)
      setIsLoading(false)
    }
  }

  const sanitize = (html: string): string => DOMPurify.sanitize(html)

  return (
    <section className="py-12" aria-label="Contact BookMaid">
      <div className="container mx-auto">
        <h2 className="text-3xl font-bold text-primary-dark-gray mb-8 text-center font-roboto">Contact Us</h2>

        {errorMessage && (
          <div className="text-center">
            <p className="text-red-500">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="text-center">
            <p className="text-green-500">{successMessage}</p>
          </div>
        )}

        {isLoading ? (
          <div className="flex justify-center items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-accent-blue"></div>
          </div>
        ) : (
          <form className="max-w-lg mx-auto" onSubmit={handleSubmit} aria-label="Contact Form">
            <div className="mb-4">
              <label htmlFor="name" className="block text-primary-dark-gray text-sm font-bold mb-2">
                Name
              </label>
              <input
                type="text"
                id="name"
                name="name"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your Name"
                value={formValues.name}
                onChange={handleChange}
                aria-label="Name"
              />
              {errors.name && <p className="text-red-500 text-xs italic">{errors.name}</p>}
            </div>

            <div className="mb-4">
              <label htmlFor="email" className="block text-primary-dark-gray text-sm font-bold mb-2">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your Email"
                value={formValues.email}
                onChange={handleChange}
                aria-label="Email"
              />
              {errors.email && <p className="text-red-500 text-xs italic">{errors.email}</p>}
            </div>

            <div className="mb-6">
              <label htmlFor="message" className="block text-primary-dark-gray text-sm font-bold mb-2">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                className="shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline"
                placeholder="Your Message"
                value={formValues.message}
                onChange={handleChange}
                aria-label="Message"
              />
              {errors.message && <p className="text-red-500 text-xs italic">{errors.message}</p>}
            </div>

            <div className="flex items-center justify-between">
              <button
                className="inline-block bg-accent-blue text-primary-white py-2 px-4 rounded-md hover:bg-indigo-400 transition-colors duration-200 text-sm font-semibold"
                type="submit"
                disabled={isSubmitting}
                aria-label="Send message"
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </div>
          </form>
        )}
        <div className="mt-8">
          <BookingForm />
        </div>
      </div>
    </section>
  )
}

export default ContactSection