import { useState, useCallback } from 'react'

/**
 * useToggle Hook
 *
 * A custom React hook that encapsulates boolean state logic, providing a
 * toggle function and explicit setTrue and setFalse functions.
 *
 * @param defaultValue - (optional) The initial boolean value of the state. Defaults to `false`.
 * @returns An array containing:
 *   - `value`: The current boolean state.
 *   - `toggle`: A function to toggle the boolean state.
 *   - `setTrue`: A function to set the boolean state to `true`.
 *   - `setFalse`: A function to set the boolean state to `false`.
 *
 * @example
 * ```typescript
 * const [isOn, toggleIsOn, setOn, setOff] = useToggle(false);
 *
 * // To toggle the state:
 * toggleIsOn();
 *
 * // To explicitly set the state to true:
 * setOn();
 *
 * // To explicitly set the state to false:
 * setOff();
 * ```
 */
function useToggle(defaultValue: boolean = false): [
  boolean,
  () => void,
  () => void,
  () => void,
] {
  const [value, setValue] = useState<boolean>(defaultValue)

  /**
   * Toggles the boolean state.
   */
  const toggle = useCallback(() => {
    setValue((currentValue) => !currentValue)
  }, [])

  /**
   * Sets the boolean state to true.
   */
  const setTrue = useCallback(() => {
    setValue(true)
  }, [])

  /**
   * Sets the boolean state to false.
   */
  const setFalse = useCallback(() => {
    setValue(false)
  }, [])

  return [value, toggle, setTrue, setFalse]
}

export { useToggle }