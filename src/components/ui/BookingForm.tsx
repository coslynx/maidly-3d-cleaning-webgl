import React, { useState, useEffect } from 'react'
import styles from 'src/styles/components/booking-form.css'
import DOMPurify from 'dompurify'

interface BookingFormValues {
  serviceType: string
  preferredDate: string
  timeSlot: string
  name: string
  email: string
  phone: string
}

interface Service {
  id: number
  name: string
  description: string
  imageUrl: string
  price: number
  features: string[]
}

/**
 * BookingForm Component
 *
 * Implements a form for users to book maid services, including service selection,
 * date and time preferences, and contact information. It fetches service data
 * from a local JSON file (src/data/services.json) and includes comprehensive
 * error handling and input validation.
 *
 * Dependencies:
 * - react@19.1.0
 * - src/styles/components/booking-form.css
 * - src/data/services.json
 * - DOMPurify
 */
function BookingForm(): JSX.Element {
  const [services, setServices] = useState<Service[]>([])
  const [bookingValues, setBookingValues] = useState<BookingFormValues>({
    serviceType: '',
    preferredDate: '',
    timeSlot: '',
    name: '',
    email: '',
    phone: '',
  })
  const [errors, setErrors] = useState<{ [key: string]: string }>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    let isMounted = true

    const fetchServices = async (): Promise<void> => {
      try {
        const response = await import('src/data/services.json')
        if (!response) {
          throw new Error('Failed to load services data')
        }
        if (isMounted) {
          setServices(response.default)
          setLoading(false)
        }
      } catch (e: any) {
        console.error('Error fetching services:', e)
        if (isMounted) {
          setErrorMessage('Failed to load services. Please try again later.')
          setLoading(false)
        }
      }
    }

    fetchServices()

    return () => {
      isMounted = false
    }
  }, [])

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {}

    if (!bookingValues.serviceType) {
      newErrors.serviceType = 'Service type is required'
    }
    if (!bookingValues.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required'
    }
    if (!bookingValues.timeSlot) {
      newErrors.timeSlot = 'Time slot is required'
    }
    if (!bookingValues.name) {
      newErrors.name = 'Name is required'
    }
    if (!bookingValues.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(bookingValues.email)) {
      newErrors.email = 'Invalid email format'
    }
    if (!bookingValues.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\\d{10}$/.test(bookingValues.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChange = (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value } = event.target
    setBookingValues({ ...bookingValues, [name]: value })
    setErrors({ ...errors, [name]: '' })
  }

  const handleSubmit = async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()

    if (!validate()) {
      return
    }

    try {
      // Simulate successful booking submission
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccessMessage('Your booking has been submitted successfully!')
      setBookingValues({
        serviceType: '',
        preferredDate: '',
        timeSlot: '',
        name: '',
        email: '',
        phone: '',
      })
      setErrors({})
    } catch (error: any) {
      console.error('Failed to submit booking:', error)
      setErrorMessage('Failed to submit your booking. Please try again later.')
    }
  }

  const sanitize = (html: string): string => DOMPurify.sanitize(html)

  if (loading) {
    return (
      <div className=\"text-center\">Loading booking form...</div>
    )
  }

  if (errorMessage) {
    return <div className=\"text-red-500 text-center\">{sanitize(errorMessage)}</div>
  }

  return (
    <div className=\"container mx-auto p-4\" aria-label=\"Booking Form Section\">
      <h2 className=\"text-2xl font-bold text-primary-dark-gray mb-4 font-roboto\">Book Your Cleaning</h2>
      {successMessage && (
        <div className=\"text-green-500 text-center\">{sanitize(successMessage)}</div>
      )}
      <form onSubmit={handleSubmit} aria-label=\"Booking Form\">
        <div className=\"mb-4\">
          <label htmlFor=\"serviceType\" className=\"block text-primary-dark-gray text-sm font-bold mb-2\">
            Service Type
          </label>
          <select
            id=\"serviceType\"
            name=\"serviceType\"
            className=\"shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline\"
            value={bookingValues.serviceType}
            onChange={handleChange}
            aria-label=\"Service Type\"
          >
            <option value=\"\">Select a service</option>
            {services.map((service) => (
              <option key={service.id} value={service.name}>
                {sanitize(service.name)}
              </option>
            ))}
          </select>
          {errors.serviceType && <p className=\"text-red-500 text-xs italic\">{sanitize(errors.serviceType)}</p>}
        </div>

        <div className=\"mb-4\">
          <label htmlFor=\"preferredDate\" className=\"block text-primary-dark-gray text-sm font-bold mb-2\">
            Preferred Date
          </label>
          <input
            type=\"date\"
            id=\"preferredDate\"
            name=\"preferredDate\"
            className=\"shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline\"
            value={bookingValues.preferredDate}
            onChange={handleChange}
            aria-label=\"Preferred Date\"
          />
          {errors.preferredDate && <p className=\"text-red-500 text-xs italic\">{sanitize(errors.preferredDate)}</p>}
        </div>

        <div className=\"mb-4\">
          <label htmlFor=\"timeSlot\" className=\"block text-primary-dark-gray text-sm font-bold mb-2\">
            Time Slot
          </label>
          <select
            id=\"timeSlot\"
            name=\"timeSlot\"
            className=\"shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline\"
            value={bookingValues.timeSlot}
            onChange={handleChange}
            aria-label=\"Time Slot\"
          >
            <option value=\"\">Select a time slot</option>
            <option value=\"8:00 AM - 10:00 AM\">8:00 AM - 10:00 AM</option>
            <option value=\"10:00 AM - 12:00 PM\">10:00 AM - 12:00 PM</option>
            <option value=\"1:00 PM - 3:00 PM\">1:00 PM - 3:00 PM</option>
            <option value=\"3:00 PM - 5:00 PM\">3:00 PM - 5:00 PM</option>
          </select>
          {errors.timeSlot && <p className=\"text-red-500 text-xs italic\">{sanitize(errors.timeSlot)}</p>}
        </div>

        <div className=\"mb-4\">
          <label htmlFor=\"name\" className=\"block text-primary-dark-gray text-sm font-bold mb-2\">
            Name
          </label>
          <input
            type=\"text\"
            id=\"name\"
            name=\"name\"
            className=\"shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline\"
            placeholder=\"Your Name\"
            value={bookingValues.name}
            onChange={handleChange}
            aria-label=\"Name\"
          />
          {errors.name && <p className=\"text-red-500 text-xs italic\">{sanitize(errors.name)}</p>}
        </div>

        <div className=\"mb-4\">
          <label htmlFor=\"email\" className=\"block text-primary-dark-gray text-sm font-bold mb-2\">
            Email
          </label>
          <input
            type=\"email\"
            id=\"email\"
            name=\"email\"
            className=\"shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline\"
            placeholder=\"Your Email\"
            value={bookingValues.email}
            onChange={handleChange}
            aria-label=\"Email\"
          />
          {errors.email && <p className=\"text-red-500 text-xs italic\">{sanitize(errors.email)}</p>}
        </div>

        <div className=\"mb-4\">
          <label htmlFor=\"phone\" className=\"block text-primary-dark-gray text-sm font-bold mb-2\">
            Phone Number
          </label>
          <input
            type=\"tel\"
            id=\"phone\"
            name=\"phone\"
            className=\"shadow appearance-none border rounded w-full py-2 px-3 text-primary-dark-gray leading-tight focus:outline-none focus:shadow-outline\"
            placeholder=\"Your Phone Number\"
            value={bookingValues.phone}
            onChange={handleChange}
            aria-label=\"Phone Number\"
          />
          {errors.phone && <p className=\"text-red-500 text-xs italic\">{sanitize(errors.phone)}</p>}
        </div>

        <div className=\"flex items-center justify-between\">
          <button
            className=\"inline-block bg-accent-blue text-primary-white py-2 px-4 rounded-md hover:bg-indigo-400 transition-colors duration-200 text-sm font-semibold\"
            type=\"submit\"
            aria-label=\"Submit booking\"
          >
            Submit Booking
          </button>
        </div>
      </form>
    </div>
  )
}

export default BookingForm