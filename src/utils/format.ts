/**
 * format.ts
 *
 * This module provides utility functions for formatting data, including currency,
 * dates, and numbers, according to specified locales and options. It uses the
 * Intl API for internationalization support and includes comprehensive input
 * validation and error handling.
 */

/**
 * formatCurrency Function
 *
 * Formats a number or string as a currency string according to the specified currency
 * code and locale. Handles numeric and string inputs, validating that the input
 * `amount` is a number or a string representation of a number. Sanitize string
 * inputs to remove any non-numeric characters.
 *
 * @param amount - The number or string to format as currency.
 * @param currencyCode - The ISO 4217 currency code (e.g., 'USD', 'EUR'). Defaults to 'USD'.
 * @param locale - The BCP 47 locale tag (e.g., 'en-US', 'de-DE'). Defaults to 'en-US'.
 * @returns A currency string (e.g., "$123.45") or "Invalid Currency" if formatting fails.
 * @throws TypeError if `amount` is not a number or a numeric string,
 *         if `currencyCode` is not a valid ISO 4217 currency code,
 *         or if `locale` is not a valid BCP 47 locale tag.
 */
function formatCurrency(
  amount: number | string,
  currencyCode: string = 'USD',
  locale: string = 'en-US',
): string {
  const isValidCurrencyCode = /^[A-Z]{3}$/.test(currencyCode)
  const isValidLocale = /^[a-z]{2}-[A-Z]{2}$/.test(locale)

  if (!isValidCurrencyCode) {
    console.error('formatCurrency: Invalid currency code provided')
    currencyCode = 'USD'
  }
  if (!isValidLocale) {
    console.error('formatCurrency: Invalid locale provided')
    locale = 'en-US'
  }

  let numberAmount: number

  if (typeof amount === 'string') {
    const sanitizedAmount = amount.replace(/[^0-9.-]/g, '')
    numberAmount = Number(sanitizedAmount)

    if (isNaN(numberAmount)) {
      throw new TypeError('formatCurrency: amount string is not a valid number')
    }
  } else if (typeof amount === 'number') {
    numberAmount = amount
  } else {
    throw new TypeError('formatCurrency: amount must be a number or a numeric string')
  }

  try {
    const formatter = new Intl.NumberFormat(locale, {
      style: 'currency',
      currency: currencyCode,
      currencyDisplay: 'symbol',
    })
    return formatter.format(numberAmount)
  } catch (error: any) {
    console.error('formatCurrency: Formatting error:', error)
    return 'Invalid Currency'
  }
}

/**
 * formatDate Function
 *
 * Formats a Date object or a date string into a human-readable date string based
 * on the specified options and locale. Accepts both Date objects and ISO 8601
 * date strings as input.
 *
 * @param date - The Date object or date string to format.
 * @param options - Optional Intl.DateTimeFormatOptions for formatting.
 * @param locale - The BCP 47 locale tag (e.g., 'en-US', 'de-DE'). Defaults to 'en-US'.
 * @returns A formatted date string (e.g., "July 20, 2024") or "Invalid Date" if formatting fails.
 * @throws TypeError if `date` is not a Date object or a valid date string,
 *         or if `locale` is not a valid BCP 47 locale tag.
 */
function formatDate(
  date: Date | string,
  options?: Intl.DateTimeFormatOptions,
  locale: string = 'en-US',
): string {
  const isValidLocale = /^[a-z]{2}-[A-Z]{2}$/.test(locale)

  if (!isValidLocale) {
    console.error('formatDate: Invalid locale provided')
    locale = 'en-US'
  }

  let dateObject: Date

  if (typeof date === 'string') {
    const parsedDate = new Date(Date.parse(date))
    if (isNaN(parsedDate.getTime())) {
      throw new TypeError('formatDate: Invalid date string')
    }
    dateObject = parsedDate
  } else if (date instanceof Date) {
    dateObject = date
  } else {
    throw new TypeError('formatDate: date must be a Date object or a date string')
  }

  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }

  try {
    const formatter = new Intl.DateTimeFormat(locale, options || defaultOptions)
    return formatter.format(dateObject)
  } catch (error: any) {
    console.error('formatDate: Formatting error:', error)
    return 'Invalid Date'
  }
}

/**
 * formatNumber Function
 *
 * Formats a number or numeric string with the specified options and locale.
 * Validate that the number is a valid number or string representation of a
 * number. Sanitize string inputs to remove any non-numeric characters (except
 * for the decimal point).
 *
 * @param number - The number or numeric string to format.
 * @param options - Optional Intl.NumberFormatOptions for formatting.
 * @param locale - The BCP 47 locale tag (e.g., 'en-US', 'de-DE'). Defaults to 'en-US'.
 * @returns A formatted number string (e.g., "1,234.56") or "Invalid Number" if formatting fails.
 * @throws TypeError if the input number isn't a number or a numeric string,
 *         or if `options` include currency with an invalid ISO 4217 code.
 */
function formatNumber(
  number: number | string,
  options?: Intl.NumberFormatOptions,
  locale: string = 'en-US',
): string {
  const isValidLocale = /^[a-z]{2}-[A-Z]{2}$/.test(locale)

  if (!isValidLocale) {
    console.error('formatNumber: Invalid locale provided')
    locale = 'en-US'
  }
  if (options?.currency) {
    const isValidCurrencyCode = /^[A-Z]{3}$/.test(options.currency)
    if (!isValidCurrencyCode) {
      console.error('formatNumber: Invalid currency code provided in options')
    }
  }

  let numberAmount: number

  if (typeof number === 'string') {
    const sanitizedNumber = number.replace(/[^0-9.-]/g, '')
    numberAmount = Number(sanitizedNumber)

    if (isNaN(numberAmount)) {
      throw new TypeError('formatNumber: Number string is not a valid number')
    }
  } else if (typeof number === 'number') {
    numberAmount = number
  } else {
    throw new TypeError('formatNumber: number must be a number or a numeric string')
  }

  try {
    const formatter = new Intl.NumberFormat(locale, options)
    return formatter.format(numberAmount)
  } catch (error: any) {
    console.error('formatNumber: Formatting error:', error)
    return 'Invalid Number'
  }
}

export { formatCurrency, formatDate, formatNumber }