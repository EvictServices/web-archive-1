'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import { defaultEmbed, generateScript, type EmbedData, type EmbedAuthor, type EmbedFooter, type EmbedField, type EmbedButton } from '@/components/embeds/lib/types'
import EmbedEditor from '@/components/embeds/EmbedEditor'
import EmbedPreview from '@/components/embeds/EmbedPreview'
import VariablesPaginator from '@/components/embeds/VariablesPaginator'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'

export default function EmbedBuilderPage() {
  const [data, setData] = useState<EmbedData>(defaultEmbed)
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
    const newValue = el.value.slice(0, start) + variable + el.value.slice(end)
    const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
    const setter = Object.getOwnPropertyDescriptor(proto, 'value')?.set
    if (setter) {
      setter.call(el, newValue)
      el.dispatchEvent(new Event('input', { bubbles: true }))
    }
    el.focus()
    const cursor = start + variable.length
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

      <div className="relative flex-1">
        {/* Hero */}
        <div className="mx-auto max-w-6xl px-6 pt-24 pb-12">
          <div className="flex items-center gap-3">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/[0.06]" />
            <span className="text-[9px] font-medium tracking-[0.2em] text-white/60 uppercase">Tools</span>
            <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/[0.06]" />
          </div>
          <h1 className="mt-6 text-center text-3xl font-bold tracking-tight text-white sm:text-4xl">
            Embed Builder
          </h1>
          <p className="mt-3 text-center text-[11px] text-white/60">
            Build Discord embeds visually and copy the generated script
          </p>
        </div>

        {/* Grid */}
        <div className="mx-auto max-w-6xl px-6 pb-24">
          <div className="grid gap-4 lg:grid-cols-2">
            {/* Left column */}
            <div className="flex flex-col gap-4">
              {/* Editor */}
              <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <div className="flex items-center gap-2 border-b border-white/[0.04] px-5 py-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60" />
                  <span className="text-[11px] font-semibold text-white/40">Editor</span>
                </div>
                <div className="max-h-[calc(100vh-12rem)] overflow-y-auto p-5 scrollbar-hide" onFocusCapture={handleEditorFocus}>
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
              </div>

              {/* Variables */}
              <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <div className="flex items-center gap-2 border-b border-white/[0.04] px-5 py-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60" />
                  <span className="text-[11px] font-semibold text-white/40">Variables</span>
                </div>
                <div className="p-4">
                  <VariablesPaginator onInsert={insertVariable} />
                </div>
              </div>
            </div>

            {/* Right column */}
            <div className="flex flex-col gap-4">
              {/* Preview */}
              <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-[#313338]">
                <div className="flex items-center gap-2 border-b border-white/[0.06] px-5 py-3">
                  <span className="inline-block h-1.5 w-1.5 rounded-full bg-green-400/60" />
                  <span className="text-[11px] font-semibold text-white/40">Preview</span>
                </div>
                <div className="p-4">
                  <div className="flex gap-3">
                    <img src="/evict.png" alt="" className="h-10 w-10 flex-shrink-0 rounded-full object-cover" />
                    <div className="min-w-0 flex-1">
                      <div className="mb-1 flex items-center gap-2">
                        <span className="text-[13px] font-semibold text-white">evict</span>
                        <span className="rounded bg-[#5865f2] px-1 py-0.5 text-[8px] font-bold text-white">BOT</span>
                        {timeStr && <span className="text-[11px] text-white/25">Today at {timeStr}</span>}
                      </div>
                      <EmbedPreview data={data} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Script */}
              <div className="overflow-hidden rounded-xl border border-white/[0.04] bg-white/[0.02]">
                <div className="flex items-center justify-between border-b border-white/[0.04] px-5 py-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-accent/60" />
                    <span className="text-[11px] font-semibold text-white/40">Script Output</span>
                  </div>
                  <button
                    onClick={copyScript}
                    className={`rounded-lg px-3 py-1 text-[10px] font-semibold transition-all ${
                      copied
                        ? 'border border-green-400/20 bg-green-400/10 text-green-400/70'
                        : 'border border-white/[0.06] bg-white/[0.03] text-white/30 hover:bg-white/[0.06] hover:text-white/50'
                    }`}
                  >
                    {copied ? 'Copied!' : 'Copy'}
                  </button>
                </div>
                <div className="p-4">
                  <pre className="max-h-[180px] overflow-y-auto rounded-lg border border-white/[0.04] bg-black/30 p-3 text-[11px] leading-relaxed text-white/35 scrollbar-hide">
                    {script || '// Start building your embed...'}
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}
