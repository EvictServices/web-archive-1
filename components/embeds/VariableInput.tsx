'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { ALL_VARIABLES } from '@/components/embeds/lib/constants'

function getVariableToken(value: string, cursor: number): { query: string; start: number } | null {
  const before = value.slice(0, cursor)
  const match = before.match(/\{[\w.]*$/)
  if (!match) return null
  return { query: match[0], start: cursor - match[0].length }
}

function filterVariables(query: string) {
  const q = query.toLowerCase()
  return ALL_VARIABLES.filter((v) => v.name.toLowerCase().startsWith(q))
}

interface VariableInputProps {
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  className?: string
}

export default function VariableInput({ value, onChange, placeholder, multiline, className }: VariableInputProps) {
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null)
  const [open, setOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(0)
  const [suggestions, setSuggestions] = useState<typeof ALL_VARIABLES>([])
  const pendingCursor = useRef<number | null>(null)

  const updateSuggestions = useCallback((text: string, cursor: number) => {
    const token = getVariableToken(text, cursor)
    if (!token) {
      setOpen(false)
      setSuggestions([])
      return
    }
    const matches = filterVariables(token.query)
    if (matches.length === 0) {
      setOpen(false)
      setSuggestions([])
      return
    }
    setSuggestions(matches)
    setActiveIndex(0)
    setOpen(true)
  }, [])

  useEffect(() => {
    if (pendingCursor.current === null || !inputRef.current) return
    const pos = pendingCursor.current
    pendingCursor.current = null
    inputRef.current.focus()
    inputRef.current.setSelectionRange(pos, pos)
    updateSuggestions(inputRef.current.value, pos)
  }, [value, updateSuggestions])

  const applyVariable = useCallback((variable: string) => {
    const el = inputRef.current
    if (!el) return
    const cursor = el.selectionStart ?? value.length
    const token = getVariableToken(value, cursor)
    if (!token) return

    const newValue = value.slice(0, token.start) + variable + value.slice(cursor)
    pendingCursor.current = token.start + variable.length
    onChange(newValue)
    setOpen(false)
  }, [value, onChange])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const next = e.target.value
    const cursor = e.target.selectionStart ?? next.length
    onChange(next)
    updateSuggestions(next, cursor)
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (!open || suggestions.length === 0) return

    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setActiveIndex((i) => (i + 1) % suggestions.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setActiveIndex((i) => (i - 1 + suggestions.length) % suggestions.length)
    } else if (e.key === 'Tab' || e.key === 'Enter') {
      e.preventDefault()
      applyVariable(suggestions[activeIndex].name)
    } else if (e.key === 'Escape') {
      e.preventDefault()
      setOpen(false)
    }
  }

  const handlePointer = (el: HTMLInputElement | HTMLTextAreaElement) => {
    updateSuggestions(el.value, el.selectionStart ?? el.value.length)
  }

  const menu = open && suggestions.length > 0 && (
    <div className="absolute z-50 mt-1.5 w-full overflow-hidden rounded-xl border border-white/[0.1] bg-overlay py-1 shadow-[0_12px_40px_rgba(0,0,0,0.45)]">
      {suggestions.map((item, i) => (
        <button
          key={item.name}
          type="button"
          onMouseDown={(e) => {
            e.preventDefault()
            applyVariable(item.name)
          }}
          className={`flex w-full items-center justify-between gap-3 px-3.5 py-2 text-left transition-colors ${
            i === activeIndex
              ? 'bg-white/[0.06] text-white/90'
              : 'text-white/50 hover:bg-white/[0.04] hover:text-white/75'
          }`}
        >
          <span className="font-mono text-xs">{item.name}</span>
          <span className="hidden truncate text-[11px] text-white/30 sm:inline">{item.desc}</span>
        </button>
      ))}
    </div>
  )

  return (
    <div className="relative">
      {multiline ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          rows={3}
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={(e) => handlePointer(e.currentTarget)}
          onFocus={(e) => handlePointer(e.currentTarget)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder={placeholder}
          className={className + ' resize-y min-h-[80px]'}
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type="text"
          value={value}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          onClick={(e) => handlePointer(e.currentTarget)}
          onFocus={(e) => handlePointer(e.currentTarget)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          placeholder={placeholder}
          className={className}
        />
      )}
      {menu}
    </div>
  )
}
