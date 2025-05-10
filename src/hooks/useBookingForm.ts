import { useState, useCallback } from 'react'
import DOMPurify from 'dompurify'

interface BookingFormValues {
  serviceType: string
  preferredDate: string
  timeSlot: string
  name: string
  email: string
  phone: string
}

interface BookingFormErrors {
  serviceType?: string
  preferredDate?: string
  timeSlot?: string
  name?: string
  email?: string
  phone?: string
}

const initialValues: BookingFormValues = {
  serviceType: '',
  preferredDate: '',
  timeSlot: '',
  name: '',
  email: '',
  phone: '',
}

function useBookingForm(): [
  BookingFormValues,
  BookingFormErrors,
  (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void,
  (event: React.FormEvent) => Promise<void>,
  string | null,
  string | null,
] {
  const [formValues, setFormValues] = useState<BookingFormValues>(initialValues)
  const [errors, setErrors] = useState<BookingFormErrors>({})
  const [successMessage, setSuccessMessage] = useState<string | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)

  const validateForm = useCallback((): boolean => {
    const newErrors: BookingFormErrors = {}

    if (!formValues.serviceType) {
      newErrors.serviceType = 'Service type is required'
    }

    if (!formValues.preferredDate) {
      newErrors.preferredDate = 'Preferred date is required'
    }

    if (!formValues.timeSlot) {
      newErrors.timeSlot = 'Time slot is required'
    }

    if (!formValues.name) {
      newErrors.name = 'Name is required'
    }

    if (!formValues.email) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(formValues.email)) {
      newErrors.email = 'Invalid email format'
    }

    if (!formValues.phone) {
      newErrors.phone = 'Phone number is required'
    } else if (!/^\\d{10}$/.test(formValues.phone)) {
      newErrors.phone = 'Invalid phone number format'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }, [formValues])

  const handleChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
      const { name, value } = event.target
      setFormValues((prevValues) => ({
        ...prevValues,
        [name]: DOMPurify.sanitize(value),
      }))
      setErrors((prevErrors) => ({ ...prevErrors, [name]: undefined }))
    },
    [],
  )

  const handleSubmit = useCallback(async (event: React.FormEvent): Promise<void> => {
    event.preventDefault()

    if (!validateForm()) {
      return
    }

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000))

      setSuccessMessage('Your booking has been submitted successfully!')
      setFormValues(initialValues)
      setErrors({})
      setErrorMessage(null)
    } catch (error: any) {
      console.error('Failed to submit booking:', error)
      setErrorMessage('Failed to submit your booking. Please try again later.')
      setSuccessMessage(null)
    }
  }, [validateForm])

  return [formValues, errors, handleChange, handleSubmit, successMessage, errorMessage]
}

export default useBookingForm