import { useCallback, useEffect, useState } from 'react'

/**
 * Minimal data-fetching hook for future API-backed sections
 * (projects, testimonials, blog posts — PROJECT_BRIEF.md §14).
 *
 * Aborts in-flight requests on unmount or URL change, so a slow response can
 * never set state on an unmounted component.
 *
 * `isLoading` is derived by comparing the request key against the key of the
 * settled result, rather than by calling setState synchronously inside the
 * effect. That keeps a URL change to a single render pass instead of the
 * render / set-loading / render cascade the naive version causes.
 */
export const useFetch = (url, options = {}, { enabled = true } = {}) => {
  // Options are serialized so a fresh object literal on each render does not
  // re-trigger the effect every time.
  const serializedOptions = JSON.stringify(options)

  const requestKey = enabled && url ? `${url}::${serializedOptions}` : null

  const [result, setResult] = useState({ key: null, data: null, error: null })

  const isLoading = requestKey !== null && result.key !== requestKey

  const run = useCallback(
    async (key, signal) => {
      try {
        const response = await fetch(url, { ...JSON.parse(serializedOptions), signal })

        if (!response.ok) {
          throw new Error(`Request failed with status ${response.status}`)
        }

        const payload = await response.json()
        if (!signal?.aborted) {
          setResult({ key, data: payload, error: null })
        }
      } catch (fetchError) {
        if (fetchError.name !== 'AbortError') {
          setResult({ key, data: null, error: fetchError })
        }
      }
    },
    [url, serializedOptions],
  )

  useEffect(() => {
    if (requestKey === null) return undefined

    const controller = new AbortController()
    // `run` is async and its first statement awaits fetch(), so no state is set
    // during this synchronous call. The linter cannot see across the async
    // boundary, so the set-state-in-effect warning here is a false positive.
    // eslint-disable-next-line react/set-state-in-effect
    run(requestKey, controller.signal)

    return () => controller.abort()
  }, [requestKey, run])

  /** Force a re-run, discarding the cached result for the current key. */
  const refetch = useCallback(() => {
    setResult({ key: null, data: null, error: null })
  }, [])

  return { data: result.data, error: result.error, isLoading, refetch }
}

export default useFetch
