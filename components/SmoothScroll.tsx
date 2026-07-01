'use client'

import { useEffect, useState } from 'react'
import { ReactLenis } from 'lenis/react'
import 'lenis/dist/lenis.css'

const LENIS_OPTIONS = {
  duration: 1.4,
  easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
  smoothWheel: true,
  touchMultiplier: 1.2,
} as const

export default function SmoothScroll({ children }: { children: React.ReactNode }) {
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(!window.matchMedia('(prefers-reduced-motion: reduce)').matches)
  }, [])

  if (!enabled) return children

  return (
    <ReactLenis root options={LENIS_OPTIONS}>
      {children}
    </ReactLenis>
  )
}
