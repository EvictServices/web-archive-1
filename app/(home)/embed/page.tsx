'use client'

import { useState, useCallback, useRef, useEffect } from 'react'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import PageHeader from '@/components/ui/PageHeader'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'
import { createDefaultEmbed, generateScript, type EmbedData, type EmbedAuthor, type EmbedFooter, type EmbedField, type EmbedButton } from '@/components/embeds/lib/types'
import EmbedEditor from '@/components/embeds/EmbedEditor'
import EmbedPreview from '@/components/embeds/EmbedPreview'
import VariablesPaginator from '@/components/embeds/VariablesPaginator'

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
      <Navbar />

      <div className="relative flex-1 overflow-x-hidden">
        <div className={`mx-auto max-w-7xl pb-16 sm:pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
          <PageHeader
            label="Tools"
            title="Embed Builder"
            description="Design embeds visually and copy the generated script for your server."
          />

          <div className="mt-8 grid min-w-0 gap-4 sm:mt-12 sm:gap-6 lg:grid-cols-[1fr_400px] xl:grid-cols-[1fr_440px]">
            <div className="min-w-0 flex flex-col gap-4">
              <div
                className="rounded-3xl border border-white/[0.07] bg-card"
                onFocusCapture={handleEditorFocus}
              >
                <div className="flex items-center justify-between gap-3 border-b border-white/[0.06] px-4 py-3 sm:px-5">
                  <p className="text-xs font-medium text-white/40">Editor</p>
                  <button
                    type="button"
                    onClick={reset}
                    className="rounded-full border border-white/[0.08] px-3.5 py-1.5 text-xs font-medium text-white/50 transition-colors hover:border-red-400/30 hover:text-red-300"
                  >
                    Reset
                  </button>
                </div>
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

              <div className="rounded-3xl border border-white/[0.07] bg-card p-4 sm:p-5">
                <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
                  <p className="text-xs font-medium text-white/40">Variables</p>
                  <p className="text-[11px] text-white/30">
                    Click to insert, or type <code className="rounded bg-white/[0.06] px-1 font-mono text-white/45">{'{'}</code> in any field
                  </p>
                </div>
                <VariablesPaginator onInsert={insertVariable} />
              </div>
            </div>

            <div className="min-w-0 flex flex-col gap-4 lg:sticky lg:top-24 lg:self-start">
              <div className="overflow-hidden rounded-3xl border border-white/[0.08] bg-[#1e1f22]">
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] bg-[#111214] px-4 py-3 sm:px-5">
                  <div className="flex min-w-0 items-center gap-2">
                    <span className="text-sm text-white/30">#</span>
                    <span className="truncate text-[13px] font-semibold text-white/60">general</span>
                  </div>
                  <span className="flex shrink-0 items-center gap-1.5 text-[11px] text-white/30">
                    <span className="h-1.5 w-1.5 rounded-full bg-green-400/70" />
                    Live preview
                  </span>
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

              <div className="overflow-hidden rounded-3xl border border-white/[0.07] bg-card">
                <div className="flex items-center justify-between gap-2 border-b border-white/[0.06] px-4 py-3 sm:px-5">
                  <span className="text-xs font-medium text-white/40">Generated script</span>
                  <button
                    type="button"
                    onClick={copyScript}
                    className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition-colors ${
                      copied
                        ? 'bg-green-400/10 text-green-300'
                        : 'bg-accent/12 text-accent hover:bg-accent/20'
                    }`}
                  >
                    {copied ? 'Copied' : 'Copy script'}
                  </button>
                </div>
                <pre className="max-h-[180px] overflow-auto p-4 font-mono text-[11px] leading-relaxed break-all text-white/45 scrollbar-hide sm:max-h-[220px] sm:p-5 sm:text-xs">
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
