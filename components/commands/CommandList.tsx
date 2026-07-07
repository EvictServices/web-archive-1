'use client'

import { memo } from 'react'
import { motion } from 'framer-motion'
import { type Command } from '@/types/command'
import CommandCard from '@/components/commands/CommandCard'

interface CommandListProps {
  commands: Command[]
  lightMotion?: boolean
}

const ease = [0.23, 1, 0.32, 1] as const

function CommandList({ commands, lightMotion = false }: CommandListProps) {
  return (
    <motion.div
      className="grid grid-cols-1 gap-3 sm:grid-cols-2 [&>*]:min-w-0"
      variants={{
        show: {
          transition: {
            staggerChildren: lightMotion ? 0 : 0.02,
            delayChildren: lightMotion ? 0 : 0.03,
          },
        },
      }}
      initial="hidden"
      animate="show"
    >
      {commands.map((cmd) => (
        <motion.div
          key={cmd.name}
          className="min-w-0"
          variants={{
            hidden: { opacity: 0, y: lightMotion ? 0 : 6 },
            show: {
              opacity: 1,
              y: 0,
              transition: { duration: lightMotion ? 0.1 : 0.18, ease },
            },
          }}
        >
          <CommandCard cmd={cmd} />
        </motion.div>
      ))}
    </motion.div>
  )
}

export default memo(CommandList)
