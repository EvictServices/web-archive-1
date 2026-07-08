'use client'

import { useState } from 'react'
import { type EmbedData, type EmbedAuthor, type EmbedFooter, type EmbedField, type EmbedButton } from '@/components/embeds/lib/types'
import { BUTTON_STYLES, BUTTON_STYLE_COLORS } from '@/components/embeds/lib/constants'
import Select from '@/components/embeds/Select'
import VariableInput from '@/components/embeds/VariableInput'

const STYLE_OPTIONS = BUTTON_STYLES.map((s) => ({
  value: s.value,
  label: s.label,
  color: BUTTON_STYLE_COLORS[s.value],
}))

const TABS = ['General', 'Media', 'Author', 'Footer', 'Fields', 'Buttons'] as const
type Tab = (typeof TABS)[number]

function InputField({ label, value, onChange, placeholder, multiline, hint }: {
  label: string
  value: string
  onChange: (v: string) => void
  placeholder?: string
  multiline?: boolean
  hint?: string
}) {
  const className =
    'w-full rounded-xl border border-white/[0.07] bg-black/25 px-3.5 py-2.5 text-base text-white/80 outline-none transition-colors placeholder:text-white/25 focus:border-accent/40 sm:text-[13px]'

  return (
    <div className="space-y-1.5">
      <label className="block text-xs font-medium text-white/50">{label}</label>
      {multiline ? (
        <VariableInput value={value} onChange={onChange} placeholder={placeholder} multiline className={className} />
      ) : (
        <VariableInput value={value} onChange={onChange} placeholder={placeholder} className={className} />
      )}
      {hint && <p className="text-[11px] text-white/30">{hint}</p>}
    </div>
  )
}

function Toggle({ label, checked, onChange }: { label: string; checked: boolean; onChange: (v: boolean) => void }) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-white/[0.06] bg-black/20 px-3.5 py-2.5">
      <span className="text-[13px] text-white/55">{label}</span>
      <button
        type="button"
        role="switch"
        aria-checked={checked}
        onClick={() => onChange(!checked)}
        className={`relative h-5 w-9 rounded-full transition-colors ${checked ? 'bg-accent' : 'bg-white/10'}`}
      >
        <span className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white transition-transform ${checked ? 'translate-x-4' : ''}`} />
      </button>
    </label>
  )
}

function ItemCard({ index, label, onRemove, children }: {
  index: number
  label: string
  onRemove: () => void
  children: React.ReactNode
}) {
  return (
    <div className="rounded-2xl border border-white/[0.06] bg-black/25 p-4">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-xs font-medium text-white/45">{label} {index + 1}</span>
        <button
          type="button"
          onClick={onRemove}
          className="rounded-md px-2 py-1 text-xs font-medium text-white/35 transition-colors hover:bg-white/[0.05] hover:text-red-300"
        >
          Remove
        </button>
      </div>
      <div className="space-y-3">{children}</div>
    </div>
  )
}

function AddButton({ onClick, label }: { onClick: () => void; label: string }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded-xl border border-dashed border-white/[0.1] py-2.5 text-xs font-medium text-white/40 transition-colors hover:border-accent/40 hover:text-accent"
    >
      + {label}
    </button>
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
  const [tab, setTab] = useState<Tab>('General')

  return (
    <>
      <div className="flex gap-1.5 overflow-x-auto border-b border-white/[0.06] px-4 py-3 scrollbar-hide [-webkit-overflow-scrolling:touch] sm:px-5">
        {TABS.map((t) => {
          const count =
            t === 'Fields' ? data.fields.length : t === 'Buttons' ? data.buttons.length : 0
          const active = tab === t
          return (
            <button
              key={t}
              type="button"
              onClick={() => setTab(t)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
                active
                  ? 'bg-accent/15 text-accent'
                  : 'text-white/45 hover:bg-white/[0.04] hover:text-white/75'
              }`}
            >
              {t}
              {count > 0 && (
                <span
                  className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold ${
                    active ? 'bg-accent/15 text-accent' : 'bg-white/[0.06] text-white/40'
                  }`}
                >
                  {count}
                </span>
              )}
            </button>
          )
        })}
      </div>

      <div className="p-4 sm:p-5 lg:max-h-[calc(100vh-16rem)] lg:overflow-y-auto lg:scrollbar-hide">
        {tab === 'General' && (
          <div className="space-y-4">
            <InputField label="Message content" value={data.content} onChange={v => update('content', v)} placeholder="Text shown above the embed" multiline />
            <div className="grid gap-4 sm:grid-cols-[1fr_72px]">
              <InputField label="Title" value={data.title} onChange={v => update('title', v)} placeholder="Embed title" />
              <div className="space-y-1.5">
                <label className="block text-xs font-medium text-white/50">Color</label>
                <input
                  type="color"
                  value={data.color}
                  onChange={e => update('color', e.target.value)}
                  className="h-[42px] w-full cursor-pointer rounded-xl border border-white/[0.07] bg-black/25 p-1"
                />
              </div>
            </div>
            <InputField label="URL" value={data.url} onChange={v => update('url', v)} placeholder="https://..." hint="Makes the title clickable" />
            <InputField label="Description" value={data.description} onChange={v => update('description', v)} placeholder="Main embed body text" multiline />
          </div>
        )}

        {tab === 'Media' && (
          <div className="space-y-4">
            <InputField label="Thumbnail" value={data.thumbnail} onChange={v => update('thumbnail', v)} placeholder="https://..." hint="Small image in the top-right corner" />
            <InputField label="Image" value={data.image} onChange={v => update('image', v)} placeholder="https://..." hint="Large image at the bottom of the embed" />
          </div>
        )}

        {tab === 'Author' && (
          <div className="space-y-4">
            <InputField label="Name" value={data.author.name} onChange={v => updateAuthor('name', v)} placeholder="Author name" />
            <InputField label="Icon URL" value={data.author.icon_url} onChange={v => updateAuthor('icon_url', v)} placeholder="https://..." />
            <InputField label="URL" value={data.author.url} onChange={v => updateAuthor('url', v)} placeholder="https://..." hint="Makes the author name clickable" />
          </div>
        )}

        {tab === 'Footer' && (
          <div className="space-y-4">
            <InputField label="Text" value={data.footer.text} onChange={v => updateFooter('text', v)} placeholder="Footer text" />
            <InputField label="Icon URL" value={data.footer.icon_url} onChange={v => updateFooter('icon_url', v)} placeholder="https://..." />
            <Toggle label="Show timestamp" checked={data.timestamp} onChange={v => update('timestamp', v)} />
          </div>
        )}

        {tab === 'Fields' && (
          <div className="space-y-3">
            {data.fields.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-white/35">No fields yet. Add up to 25 inline or full-width fields.</p>
            ) : (
              data.fields.map((field, i) => (
                <ItemCard key={i} index={i} label="Field" onRemove={() => removeField(i)}>
                  <InputField label="Name" value={field.name} onChange={v => updateField(i, 'name', v)} placeholder="Field name" />
                  <InputField label="Value" value={field.value} onChange={v => updateField(i, 'value', v)} placeholder="Field value" multiline />
                  <Toggle label="Inline" checked={field.inline} onChange={v => updateField(i, 'inline', v)} />
                </ItemCard>
              ))
            )}
            <AddButton onClick={addField} label="Add field" />
          </div>
        )}

        {tab === 'Buttons' && (
          <div className="space-y-3">
            {data.buttons.length === 0 ? (
              <p className="py-6 text-center text-[13px] text-white/35">No buttons yet. Add link or styled buttons below the embed.</p>
            ) : (
              data.buttons.map((btn, i) => (
                <ItemCard key={i} index={i} label="Button" onRemove={() => removeButton(i)}>
                  <Select
                    label="Style"
                    value={btn.style}
                    onChange={(v) => updateButton(i, 'style', v)}
                    options={STYLE_OPTIONS}
                  />
                  <InputField label="Label" value={btn.label} onChange={v => updateButton(i, 'label', v)} placeholder="Button text" />
                  <InputField label="URL" value={btn.url} onChange={v => updateButton(i, 'url', v)} placeholder="https://..." />
                  <InputField label="Emoji" value={btn.emoji} onChange={v => updateButton(i, 'emoji', v)} placeholder="Optional emoji" />
                  <Toggle label="Disabled" checked={btn.disabled} onChange={v => updateButton(i, 'disabled', v)} />
                </ItemCard>
              ))
            )}
            <AddButton onClick={addButton} label="Add button" />
          </div>
        )}
      </div>
    </>
  )
}
