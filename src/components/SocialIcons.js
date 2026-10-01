import { FaFacebookF, FaInstagram, FaTiktok, FaXTwitter } from 'react-icons/fa6'

/**
 * Maps the `icon` keys on `SOCIAL_LINKS` to components. Kept out of
 * constants.js so the data file never imports React; shared by the header's
 * top bar and the footer.
 */
export const SOCIAL_ICONS = {
  facebook: FaFacebookF,
  instagram: FaInstagram,
  x: FaXTwitter,
  tiktok: FaTiktok,
}
