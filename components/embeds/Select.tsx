'use client'

import { useState, useRef, useEffect } from 'react'

export interface SelectOption {
  value: string
  label: string
  color?: string
}

interface SelectProps {
  value: string
  onChange: (value: string) => void
  options: SelectOption[]
  label?: string
}

export default function Select({ value, onChange, options, label }: SelectProps) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  const selected = options.find((o) => o.value === value)

  useEffect(() => {
    if (!open) return

    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false)
    }
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }

    document.addEventListener('mousedown', onPointerDown)
    document.addEventListener('keydown', onKeyDown)
    return () => {
      document.removeEventListener('mousedown', onPointerDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }, [open])

  return (
    <div ref={ref} className="relative space-y-1.5">
      {label && <label className="block text-xs font-medium text-white/50">{label}</label>}

      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex w-full items-center justify-between rounded-xl border border-white/[0.07] bg-black/25 px-3.5 py-2.5 text-left text-[13px] text-white/80 transition-colors hover:border-white/[0.13] focus:border-accent/40 focus:outline-none"
      >
        <span className="flex items-center gap-2.5">
          {selected?.color && (
            <span className="h-2.5 w-2.5 shrink-0 rounded-full" style={{ backgroundColor: selected.color }} />
          )}
          <span>{selected?.label ?? 'Select...'}</span>
        </span>
        <svg
          className={`h-3.5 w-3.5 shrink-0 text-white/30 transition-transform ${open ? 'rotate-180' : ''}`}
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path d="M6 9l6 6 6-6" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-white/[0.1] bg-overlay py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]"
        >
          {options.map((opt) => {
            const active = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="option"
                aria-selected={active}
                onClick={() => {
                  onChange(opt.value)
                  setOpen(false)
                }}
                className={`flex w-full items-center gap-2.5 px-3.5 py-2 text-left text-[13px] transition-colors ${
                  active
                    ? 'bg-white/[0.06] text-white/90'
                    : 'text-white/50 hover:bg-white/[0.04] hover:text-white/75'
                }`}
              >
                {opt.color && (
                  <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: opt.color }} />
                )}
                <span className="flex-1">{opt.label}</span>
                {active && (
                  <svg className="h-3.5 w-3.5 text-accent/70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
