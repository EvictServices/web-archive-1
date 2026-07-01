'use client'

import { useEffect } from 'react'

const FIXED_SELECTOR = '[data-fixed-chrome]'

export function useBodyScrollLock(locked: boolean) {
  useEffect(() => {
    if (!locked) return

    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth
    const { body, documentElement: html } = document
    const fixed = Array.from(document.querySelectorAll<HTMLElement>(FIXED_SELECTOR))

    const prev = {
      bodyOverflow: body.style.overflow,
      htmlOverflow: html.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      fixedPadding: fixed.map((el) => el.style.paddingRight),
    }

    body.style.overflow = 'hidden'
    html.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${scrollbarWidth}px`
      fixed.forEach((el) => {
        el.style.paddingRight = `${scrollbarWidth}px`
      })
    }

    return () => {
      body.style.overflow = prev.bodyOverflow
      html.style.overflow = prev.htmlOverflow
      body.style.paddingRight = prev.bodyPaddingRight
      fixed.forEach((el, i) => {
        el.style.paddingRight = prev.fixedPadding[i] ?? ''
      })
    }
  }, [locked])
}
