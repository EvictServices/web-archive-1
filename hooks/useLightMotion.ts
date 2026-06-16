'use client'

import { useSyncExternalStore } from 'react'

function subscribe(onStoreChange: () => void) {
  const mobile = window.matchMedia('(max-width: 640px)')
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)')
  const handler = () => onStoreChange()
  mobile.addEventListener('change', handler)
  reduced.addEventListener('change', handler)
  return () => {
    mobile.removeEventListener('change', handler)
    reduced.removeEventListener('change', handler)
  }
}

function getSnapshot() {
  return (
    window.matchMedia('(max-width: 640px)').matches ||
    window.matchMedia('(prefers-reduced-motion: reduce)').matches
  )
}

function getServerSnapshot() {
  return false
}

/** Faster, opacity-only motion on mobile and when reduced motion is preferred. */
export function useLightMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot)
}
