'use client'

import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

export default function TiltCard({
  children,
  className,
  delay = 0,
  initialX = 0,
  initialY = 0,
  float = true,
}: {
  children: React.ReactNode
  className: string
  delay?: number
  initialX?: number
  initialY?: number
  float?: boolean
}) {
  const ref = useRef<HTMLDivElement>(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)

  const springX = useSpring(x, { stiffness: 120, damping: 20 })
  const springY = useSpring(y, { stiffness: 120, damping: 20 })

  const rotateX = useTransform(springY, [-0.5, 0.5], ['3deg', '-3deg'])
  const rotateY = useTransform(springX, [-0.5, 0.5], ['-3deg', '3deg'])

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!ref.current) return
    const rect = ref.current.getBoundingClientRect()
    const cx = (e.clientX - rect.left) / rect.width - 0.5
    const cy = (e.clientY - rect.top) / rect.height - 0.5
    x.set(cx)
    y.set(cy)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  const content = (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }}
      className={`${className} will-change-transform`}
    >
      {children}
    </motion.div>
  )

  if (!float) return content

  return (
    <motion.div
      animate={{ y: [0, -3, 0] }}
      transition={{ repeat: Infinity, duration: 5 + delay, ease: 'easeInOut' }}
      style={{ transformStyle: 'preserve-3d' }}
    >
      {content}
    </motion.div>
  )
}
