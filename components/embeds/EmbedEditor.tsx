'use client'

import { useState } from 'react'
import { type EmbedData, type EmbedAuthor, type EmbedFooter, type EmbedField, type EmbedButton } from '@/components/embeds/lib/types'
import { BUTTON_STYLES } from '@/components/embeds/lib/constants'

function InputField({ label, value, onChange, placeholder, multiline }: {
  label: string; value: string; onChange: (v: string) => void; placeholder?: string; multiline?: boolean
}) {
  const className =
    'w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[12px] text-white/60 outline-none transition-all placeholder:text-white/20 focus:border-accent/30 focus:bg-white/[0.05]'

  return (
    <div className="mb-2.5">
      <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-white/30">
        {label}
      </label>
      {multiline ? (
        <textarea rows={3} value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className + ' resize-y'} />
      ) : (
        <input type="text" value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className={className} />
      )}
    </div>
  )
}

function Section({ title, children, defaultOpen }: {
  title: string; children: React.ReactNode; defaultOpen?: boolean
}) {
  const [open, setOpen] = useState(defaultOpen ?? false)
  return (
    <div className="mb-2.5 overflow-hidden rounded-xl border border-white/[0.05] bg-white/[0.015]">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between px-3.5 py-2.5 text-left text-[12px] font-semibold text-white/50 transition-colors hover:bg-white/[0.02]"
      >
        <span>{title}</span>
        <span className={`inline-block text-[10px] text-white/20 transition-transform ${open ? 'rotate-180' : ''}`}>▼</span>
      </button>
      {open && <div className="border-t border-white/[0.04] px-3.5 py-3">{children}</div>}
    </div>
  )
}

interface EmbedEditorProps {
  data: EmbedData
  update: <K extends keyof EmbedData>(key: K, value: EmbedData[K]) => void
  updateAuthor: (key: keyof EmbedAuthor, value: string) => void
  updateFooter: (key: keyof EmbedFooter, value: string) => void
  addField: () => void
  updateField: (index: number, key: keyof EmbedField, value: string | boolean) => void
  removeField: (index: number) => void
  addButton: () => void
  updateButton: (index: number, key: keyof EmbedButton, value: string | boolean) => void
  removeButton: (index: number) => void
}

export default function EmbedEditor({
  data, update, updateAuthor, updateFooter,
  addField, updateField, removeField,
  addButton, updateButton, removeButton,
}: EmbedEditorProps) {
  return (
    <>
      <InputField label="Message Content" value={data.content} onChange={v => update('content', v)} placeholder="Text outside the embed" multiline />

      <Section title="Embed Body" defaultOpen>
        <div className="mb-2.5 flex gap-3">
          <div className="flex-1">
            <InputField label="Title" value={data.title} onChange={v => update('title', v)} placeholder="Embed title" />
          </div>
          <div className="w-16">
            <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-white/30">Color</label>
            <input
              type="color"
              value={data.color}
              onChange={e => update('color', e.target.value)}
              className="h-8 w-full cursor-pointer rounded-lg border border-white/[0.06] bg-white/[0.03] p-0.5"
            />
          </div>
        </div>
        <InputField label="URL" value={data.url} onChange={v => update('url', v)} placeholder="https://..." />
        <InputField label="Description" value={data.description} onChange={v => update('description', v)} placeholder="Embed description" multiline />
      </Section>

      <Section title="Images">
        <InputField label="Thumbnail URL" value={data.thumbnail} onChange={v => update('thumbnail', v)} placeholder="Small image (top right)" />
        <InputField label="Image URL" value={data.image} onChange={v => update('image', v)} placeholder="Large image (bottom)" />
      </Section>

      <Section title="Author">
        <InputField label="Name" value={data.author.name} onChange={v => updateAuthor('name', v)} placeholder="Author name" />
        <InputField label="Icon URL" value={data.author.icon_url} onChange={v => updateAuthor('icon_url', v)} placeholder="https://..." />
        <InputField label="URL" value={data.author.url} onChange={v => updateAuthor('url', v)} placeholder="https://..." />
      </Section>

      <Section title="Footer">
        <InputField label="Text" value={data.footer.text} onChange={v => updateFooter('text', v)} placeholder="Footer text" />
        <InputField label="Icon URL" value={data.footer.icon_url} onChange={v => updateFooter('icon_url', v)} placeholder="https://..." />
        <label className="mt-1 flex items-center gap-2 text-[12px] text-white/40">
          <input type="checkbox" checked={data.timestamp} onChange={e => update('timestamp', e.target.checked)} className="accent-accent" />
          Show timestamp
        </label>
      </Section>

      <Section title={`Fields (${data.fields.length})`}>
        {data.fields.map((field, i) => (
          <div key={i} className="mb-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/30">Field {i + 1}</span>
              <button onClick={() => removeField(i)} className="text-[10px] font-semibold text-red-400/60 transition-colors hover:text-red-400">Remove</button>
            </div>
            <InputField label="Name" value={field.name} onChange={v => updateField(i, 'name', v)} placeholder="Field name" />
            <InputField label="Value" value={field.value} onChange={v => updateField(i, 'value', v)} placeholder="Field value" />
            <label className="flex items-center gap-2 text-[12px] text-white/40">
              <input type="checkbox" checked={field.inline} onChange={e => updateField(i, 'inline', e.target.checked)} className="accent-accent" />
              Inline
            </label>
          </div>
        ))}
        <button onClick={addField} className="w-full rounded-lg border border-dashed border-accent/20 bg-accent/[0.03] py-2 text-[11px] font-semibold text-accent/50 transition-all hover:bg-accent/[0.06] hover:text-accent/70">
          + Add Field
        </button>
      </Section>

      <Section title={`Buttons (${data.buttons.length})`}>
        {data.buttons.map((btn, i) => (
          <div key={i} className="mb-2.5 rounded-lg border border-white/[0.04] bg-white/[0.02] p-3">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-[10px] font-semibold text-white/30">Button {i + 1}</span>
              <button onClick={() => removeButton(i)} className="text-[10px] font-semibold text-red-400/60 transition-colors hover:text-red-400">Remove</button>
            </div>
            <div className="mb-2.5">
              <label className="mb-1.5 block text-[9px] font-semibold uppercase tracking-wider text-white/30">Style</label>
              <select
                value={btn.style}
                onChange={e => updateButton(i, 'style', e.target.value)}
                className="w-full rounded-lg border border-white/[0.06] bg-white/[0.03] px-3 py-2 text-[12px] text-white/60 outline-none"
              >
                {BUTTON_STYLES.map(s => <option key={s.value} value={s.value}>{s.label}</option>)}
              </select>
            </div>
            <InputField label="Label" value={btn.label} onChange={v => updateButton(i, 'label', v)} placeholder="Button text" />
            <InputField label="URL" value={btn.url} onChange={v => updateButton(i, 'url', v)} placeholder="https://..." />
            <InputField label="Emoji" value={btn.emoji} onChange={v => updateButton(i, 'emoji', v)} placeholder="Optional emoji" />
            <label className="flex items-center gap-2 text-[12px] text-white/40">
              <input type="checkbox" checked={btn.disabled} onChange={e => updateButton(i, 'disabled', e.target.checked)} className="accent-accent" />
              Disabled
            </label>
          </div>
        ))}
        <button onClick={addButton} className="w-full rounded-lg border border-dashed border-accent/20 bg-accent/[0.03] py-2 text-[11px] font-semibold text-accent/50 transition-all hover:bg-accent/[0.06] hover:text-accent/70">
          + Add Button
        </button>
      </Section>
    </>
  )
}
