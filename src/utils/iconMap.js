/**
 * Maps the string `icon` keys stored in `constants.js` to react-icons
 * components. Keeping constants free of JSX means the catalogue data stays
 * plain, serializable and easy to move to a CMS or API later.
 */

import {
  FiAward,
  FiBriefcase,
  FiCode,
  FiCreditCard,
  FiGlobe,
  FiMail,
  FiMonitor,
  FiPenTool,
  FiSearch,
  FiServer,
  FiShield,
  FiSmartphone,
  FiTool,
  FiZap,
} from 'react-icons/fi'

export const ICONS = {
  globe: FiGlobe,
  building: FiBriefcase,
  code: FiCode,
  mobile: FiSmartphone,
  desktop: FiMonitor,
  design: FiPenTool,
  maintenance: FiTool,
  server: FiServer,
  mail: FiMail,
  search: FiSearch,
  award: FiAward,
  shield: FiShield,
  bolt: FiZap,
  wallet: FiCreditCard,
}

/** Returns the icon component for a key, falling back to a neutral glyph. */
export const getIcon = (key) => ICONS[key] ?? FiCode
