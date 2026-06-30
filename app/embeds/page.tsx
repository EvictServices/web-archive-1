'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { createDefaultEmbed, generateScript, type EmbedData, type EmbedAuthor, type EmbedFooter, type EmbedField, type EmbedButton } from '@/components/embeds/lib/types'
import EmbedEditor from '@/components/embeds/EmbedEditor'
import EmbedPreview from '@/components/embeds/EmbedPreview'
import VariablesPaginator from '@/components/embeds/VariablesPaginator'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

export default function EmbedBuilderPage() {
  const [data, setData] = useState<EmbedData>(createDefaultEmbed)
  const [copied, setCopied] = useState(false)
  const [timeStr, setTimeStr] = useState('')
  const lastInputRef = useRef<HTMLInputElement | HTMLTextAreaElement | null>(null)

  useEffect(() => {
    setTimeStr(new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' }))
  }, [])

  const handleEditorFocus = useCallback((e: React.FocusEvent) => {
    const target = e.target as HTMLElement
    if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') {
      lastInputRef.current = target as HTMLInputElement | HTMLTextAreaElement
    }
  }, [])

  const insertVariable = useCallback((variable: string) => {
    const el = lastInputRef.current
    if (!el) return
    const start = el.selectionStart ?? el.value.length
    const end = el.selectionEnd ?? el.value.length
    const before = el.value.slice(0, start)
    const tokenMatch = before.match(/\{[\w.]*$/)
    const insertStart = tokenMatch ? start - tokenMatch[0].length : start
    const newValue = el.value.slice(0, insertStart) + variable + el.value.slice(end)
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
    if (setter) {
      setter.call(el, newValue)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
    el.focus()
    const cursor = insertStart + variable.length
    el.setSelectionRange(cursor, cursor)
  }, [])

  const update = useCallback(<K extends keyof EmbedData>(key: K, value: EmbedData[K]) => {
    setData(prev => ({ ...prev, [key]: value }))
  }, [])

  const updateAuthor = useCallback((key: keyof EmbedAuthor, value: string) => {
    setData(prev => ({ ...prev, author: { ...prev.author, [key]: value } }))
  }, [])

  const updateFooter = useCallback((key: keyof EmbedFooter, value: string) => {
    setData(prev => ({ ...prev, footer: { ...prev.footer, [key]: value } }))
  }, [])

  const addField = useCallback(() => {
    setData(prev => ({ ...prev, fields: [...prev.fields, { name: '', value: '', inline: false }] }))
  }, [])

  const updateField = useCallback((index: number, key: keyof EmbedField, value: string | boolean) => {
    setData(prev => ({ ...prev, fields: prev.fields.map((f, i) => i === index ? { ...f, [key]: value } : f) }))
  }, [])

  const removeField = useCallback((index: number) => {
    setData(prev => ({ ...prev, fields: prev.fields.filter((_, i) => i !== index) }))
  }, [])

  const addButton = useCallback(() => {
    setData(prev => ({ ...prev, buttons: [...prev.buttons, { style: 'link', label: '', url: '', emoji: '', disabled: false }] }))
  }, [])

  const updateButton = useCallback((index: number, key: keyof EmbedButton, value: string | boolean) => {
    setData(prev => ({ ...prev, buttons: prev.buttons.map((b, i) => i === index ? { ...b, [key]: value } : b) }))
  }, [])

  const removeButton = useCallback((index: number) => {
    setData(prev => ({ ...prev, buttons: prev.buttons.filter((_, i) => i !== index) }))
  }, [])

  const reset = useCallback(() => setData(createDefaultEmbed()), [])

  const script = generateScript(data)

  const copyScript = useCallback(() => {
    navigator.clipboard.writeText(script)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }, [script])

  return (
    <div className="relative flex min-h-screen flex-col">
      <div className="line-grid absolute inset-0 opacity-10" />
      <Navbar />

      <div className="relative flex-1 overflow-x-hidden">
        <div className="mx-auto max-w-7xl px-4 pt-20 pb-16 sm:px-6 sm:pt-24 sm:pb-24">
          <motion.header
            className="text-center"
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: [0.23, 1, 0.32, 1] }}
          >
            <div className="flex items-center gap-3">
              <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
              <span className="text-[9px] font-medium tracking-[0.2em] text-white/60 uppercase">Tools</span>
              <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
            </div>
            <h1 className="mt-6 text-2xl font-bold tracking-tight text-white sm:text-3xl lg:text-4xl">Embed Builder</h1>
            <p className="mx-auto mt-3 max-w-md text-[11px] leading-relaxed text-white/60">
              Design embeds visually and copy the generated script for your server.
            </p>
          </motion.header>

          <div className="mb-4 mt-8 flex justify-end sm:mb-6 sm:mt-12">
            <button
              type="button"
              onClick={reset}
              className="rounded-lg border border-white/[0.06] bg-white/[0.02] px-3.5 py-1.5 text-[11px] font-medium text-white/40 transition-colors hover:bg-white/[0.04] hover:text-white/60"
            >
              Reset
            </button>
          </div>

          <div className="grid min-w-0 gap-4 sm:gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
            {/* Editor column */}
            <div className="min-w-0 flex flex-col gap-4">
              <div
                className="rounded-2xl border border-white/[0.06] bg-white/[0.02]"
                onFocusCapture={handleEditorFocus}
              >
                <EmbedEditor
                  data={data}
                  update={update}
                  updateAuthor={updateAuthor}
                  updateFooter={updateFooter}
                  addField={addField}
                  updateField={updateField}
                  removeField={removeField}
                  addButton={addButton}
                  updateButton={updateButton}
                  removeButton={removeButton}
                />
              </div>

              <div className="rounded-2xl border border-white/[0.06] bg-white/[0.02] p-3.5 sm:p-4">
                <p className="mb-3 text-[10px] font-medium tracking-wider text-white/35 uppercase">Variables</p>
                <VariablesPaginator onInsert={insertVariable} />
              </div>
            </div>

            {/* Preview column */}
            <div className="min-w-0 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-[#1e1f22]">
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] bg-[#111214] px-3 py-2.5 sm:px-4 sm:py-3">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-[12px] text-white/30">#</span>
                    <span className="truncate text-[12px] font-medium text-white/50">general</span>
                  </div>
                  <span className="shrink-0 text-[10px] text-white/20">Live preview</span>
                </div>
                <div className="p-3 sm:p-4">
                  <div className="flex gap-2.5 sm:gap-3">
                    <img src="/evict.png" alt="" className="h-8 w-8 shrink-0 rounded-full object-cover sm:h-9 sm:w-9" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5">
                        <span className="text-[13px] font-semibold text-[#f2f3f5] sm:text-[14px]">evict</span>
                        <span className="rounded bg-[#5865f2] px-1 py-px text-[9px] font-bold text-white">BOT</span>
                        {timeStr && <span className="text-[10px] text-[#949ba4] sm:text-[11px]">Today at {timeStr}</span>}
                      </div>
                      <EmbedPreview data={data} />
                    </div>
                  </div>
                </div>
              </div>

              <div className="overflow-hidden rounded-2xl border border-white/[0.06] bg-white/[0.02]">
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.04] px-3 py-2.5 sm:px-4 sm:py-3">
                  <span className="text-[11px] font-medium text-white/40">Script</span>
                  <button
                    type="button"
                    onClick={copyScript}
                    className={`shrink-0 rounded-lg border px-3 py-1.5 text-[11px] font-medium transition-colors ${
                      copied
                        ? 'border-green-400/20 bg-green-400/5 text-green-400/70'
                        : 'border-white/[0.06] bg-white/[0.02] text-white/40 hover:bg-white/[0.04] hover:text-white/60'
                    }`}
                  >
                    {copied ? 'Copied' : 'Copy'}
                  </button>
                </div>
                <pre className="max-h-[180px] overflow-auto p-3 font-mono text-[10px] leading-relaxed break-all text-white/40 scrollbar-hide sm:max-h-[220px] sm:p-4 sm:text-[11px]">
                  {script || '// Start building your embed...'}
                </pre>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
