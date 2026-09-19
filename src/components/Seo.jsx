import { COMPANY, CONTACT } from '@/utils/constants'

/**
 * Per-page document metadata.
 *
 * React 19 hoists <title>, <meta> and <link> rendered anywhere in the tree into
 * <head> and de-duplicates them, so no react-helmet dependency is needed.
 * PROJECT_BRIEF.md §7 predates that: helmet would now be redundant weight.
 */
export const Seo = ({ title, description, path = '/', image }) => {
  const fullTitle = title ? `${title} | ${COMPANY.name}` : COMPANY.name
  const canonical = `${CONTACT.websiteUrl}${path}`
  const ogImage = image ?? `${CONTACT.websiteUrl}/og-image.jpg`

  return (
    <>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonical} />

      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={COMPANY.name} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonical} />
      <meta property="og:image" content={ogImage} />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={ogImage} />
    </>
  )
}

export default Seo
