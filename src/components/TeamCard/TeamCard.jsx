import { motion } from 'framer-motion'

import Card from '@/components/Card/Card'
import kasoziAloisiusPhoto from '@/assets/team/kasozi-aloisius.jpg'
import mugishaAndrewPhoto from '@/assets/team/mugisha-andrew.jpg'
import placeholderAvatar from '@/assets/team/placeholder-avatar.png'

/**
 * Headshots, keyed by the `id` on TEAM. A member with no entry here falls back
 * to `placeholderAvatar` — so this map is the only place a photo is recorded,
 * and there is no flag on TEAM that could disagree with it.
 *
 * Keyed here rather than on TEAM for the same reason as the project
 * screenshots: constants.js stays a plain data file with no imports the
 * bundler has to resolve.
 *
 * Crop them square and centred on the head before adding them, at 512px. The
 * card draws them into a circle, and `object-cover` will not rescue a portrait
 * whose face is off-centre — it will just cut the top of the head off in a
 * rounder shape.
 */
const TEAM_PHOTOS = {
  'lead-developer': kasoziAloisiusPhoto,
  'software-engineer': mugishaAndrewPhoto,
}

/**
 * Renders one entry from TEAM: circular portrait, name, job title, then what
 * the person actually does.
 *
 * Centred rather than left-aligned. A row of cards reads as people when the
 * portrait sits over the name; the same content flush-left reads as more
 * feature tiles, which is what the rest of this page is already full of.
 *
 * Every card draws a portrait, falling back to the generic placeholder avatar,
 * so a member waiting on a headshot still gets the same circle in the same
 * place rather than a differently-shaped stand-in.
 *
 * A member without a `name` yet leads with the role instead, so the grid stays
 * honest while the client still owes us names — no "Team Member 2" filler and
 * no invented bios.
 */
export const TeamCard = ({ member, index = 0 }) => {
  const photo = TEAM_PHOTOS[member.id]
  const hasName = Boolean(member.name)

  return (
    <motion.li
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{
        duration: 0.45,
        delay: Math.min(index * 0.08, 0.32),
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full"
    >
      <Card hoverable className="group flex h-full flex-col items-center p-8 text-center">
        <img
          src={photo ?? placeholderAvatar}
          /*
            The real photo gets described; the placeholder does not. It carries
            nothing about the person — the name is in the heading directly
            below — so announcing it would only add noise to a screen reader.
            An empty alt is the correct way to say "decorative".
          */
          alt={photo ? `${member.name}, ${member.role} at GenieWep Technologies` : ''}
          width="512"
          height="512"
          loading="lazy"
          decoding="async"
          className="h-28 w-28 rounded-full object-cover ring-4 ring-azure-300/30 transition-all duration-300 ease-[var(--ease-brand)] group-hover:scale-105 group-hover:ring-azure-400/60"
        />

        <h3 className="mt-6 text-lg text-title">
          {hasName ? member.name : member.role}
        </h3>

        {/*
          The title only gets its own line once there is a name above it to be
          the title *of*; otherwise the heading is already the role and this
          would print it twice.
        */}
        {hasName && (
          <p className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-link">
            {member.role}
          </p>
        )}

        <p className="mt-4 text-sm leading-relaxed text-body">{member.focus}</p>
      </Card>
    </motion.li>
  )
}

export default TeamCard
