import { useCallback, useEffect, useState } from 'react'

/**
 * State backed by localStorage, safe for private browsing and blocked storage:
 * every access is wrapped, and a failure degrades to plain in-memory state.
 */
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const stored = window.localStorage.getItem(key)
      return stored !== null ? JSON.parse(stored) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Storage unavailable (private window, quota, blocked cookies).
      // In-memory state still works, so there is nothing to recover from.
    }
  }, [key, value])

  const remove = useCallback(() => {
    try {
      window.localStorage.removeItem(key)
    } catch {
      // ignore
    }
    setValue(initialValue)
  }, [key, initialValue])

  return [value, setValue, remove]
}

export default useLocalStorage
