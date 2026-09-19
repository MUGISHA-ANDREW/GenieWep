/** Suspense fallback for lazily-loaded routes. */
export const PageLoader = () => (
  <div
    role="status"
    aria-live="polite"
    className="flex min-h-[60vh] items-center justify-center"
  >
    <span
      aria-hidden="true"
      className="h-10 w-10 animate-spin rounded-full border-3 border-line border-t-accent-500"
    />
    <span className="sr-only">Loading page…</span>
  </div>
)

export default PageLoader
