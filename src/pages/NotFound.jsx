import { FiArrowLeft } from 'react-icons/fi'

import Button from '@/components/Button/Button'
import Seo from '@/components/Seo'
import { NAV_LINKS } from '@/utils/constants'

const NotFound = () => (
  <>
    <Seo
      title="Page not found"
      description="The page you are looking for does not exist."
      path="/404"
    />

    <div className="flex min-h-[70vh] items-center justify-center bg-tint px-5 py-20">
      <div className="max-w-lg text-center">
        <p className="text-5xl font-extrabold text-azure-500 md:text-6xl">404</p>
        <h1 className="mt-4 text-2xl text-title">Page not found</h1>
        <p className="mt-4 text-base text-body">
          The page you are looking for may have moved or no longer exists.
        </p>

        <div className="mt-8">
          <Button to="/" size="lg">
            <FiArrowLeft aria-hidden="true" className="h-4 w-4" />
            Back to home
          </Button>
        </div>

        <nav aria-label="Site sections" className="mt-10">
          <p className="mb-3 text-sm font-semibold text-title">
            Or jump to a section
          </p>
          <ul className="flex flex-wrap justify-center gap-x-5 gap-y-2">
            {NAV_LINKS.filter((link) => link.to !== '/').map((link) => (
              <li key={link.to}>
                <Button to={link.to} variant="ghost" size="sm">
                  {link.label}
                </Button>
              </li>
            ))}
          </ul>
        </nav>
      </div>
    </div>
  </>
)

export default NotFound
