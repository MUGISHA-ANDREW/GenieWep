/**
 * Maps the string `icon` keys stored in `constants.js` to react-icons
 * components. Keeping constants free of JSX means the catalogue data stays
 * plain, serializable and easy to move to a CMS or API later.
 */

import {
  FiAward,
  FiBriefcase,
  FiLayers,
  FiMapPin,
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
  FiTrendingUp,
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
  briefcase: FiBriefcase,
  layers: FiLayers,
  pin: FiMapPin,
  /* `rocket` is the launch stage of the process. react-icons/fi has no rocket,
     and a rising trend line says the same thing in the same line weight — a
     glyph borrowed from a second icon family would not. */
  rocket: FiTrendingUp,
}

/** Returns the icon component for a key, falling back to a neutral glyph. */
export const getIcon = (key) => ICONS[key] ?? FiCode
