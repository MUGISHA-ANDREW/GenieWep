import { useEffect } from 'react'

/**
 * Locks body scrolling while the mobile menu or a modal is open, compensating
 * for the scrollbar width so the page behind does not shift horizontally.
 *
 * Replaces the `useForm` hook listed in PROJECT_BRIEF.md §10: form state is
 * handled by react-hook-form, so a hand-rolled equivalent would be dead code,
 * while scroll locking is genuinely needed by the nav and modal.
 */
export const useScrollLock = (isLocked) => {
  useEffect(() => {
    if (!isLocked) return undefined

    const { body } = document
    const previousOverflow = body.style.overflow
    const previousPaddingRight = body.style.paddingRight

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth

    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
    }

    return () => {
      body.style.overflow = previousOverflow
      body.style.paddingRight = previousPaddingRight
    }
  }, [isLocked])
}

export default useScrollLock
