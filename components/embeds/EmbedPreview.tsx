'use client'

import { type EmbedData } from '@/components/embeds/lib/types'
import { BUTTON_STYLE_COLORS } from '@/components/embeds/lib/constants'

export default function EmbedPreview({ data }: { data: EmbedData }) {
  const hasEmbed = data.title || data.description || data.thumbnail || data.image ||
    data.author.name || data.footer.text || data.fields.length > 0

  const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  return (
    <div>
      {data.content && (
        <div className="mb-2 text-[13px] leading-relaxed text-[#dcddde] whitespace-pre-wrap">
          {data.content}
        </div>
      )}

      {hasEmbed && (
        <div
          className="flex max-w-[520px] overflow-hidden rounded"
          style={{
            background: '#2b2d31',
            borderLeft: `4px solid ${data.color || '#2b2d31'}`,
          }}
        >
          <div className="min-w-0 flex-1 p-3 px-4">
            {data.author.name && (
              <div className="mb-1 flex items-center gap-2">
                {data.author.icon_url && (
                  <img src={data.author.icon_url} alt="" className="h-6 w-6 rounded-full" />
                )}
                <span className="text-[13px] font-semibold text-white">
                  {data.author.name}
                </span>
              </div>
            )}

            {data.title && (
              <div
                className={`mb-1 text-[15px] font-bold ${data.url ? 'cursor-pointer text-[#00aff4]' : 'text-white'}`}
              >
                {data.title}
              </div>
            )}

            {data.description && (
              <div className="mb-2 text-[13px] leading-relaxed text-[#dcddde] whitespace-pre-wrap">
                {data.description}
              </div>
            )}

            {data.fields.length > 0 && (
              <div className="mb-2 grid grid-cols-3 gap-2">
                {data.fields.map((field, i) => (
                  <div key={i} className={field.inline ? 'col-span-1' : 'col-span-3'}>
                    <div className="mb-0.5 text-[13px] font-semibold text-white">
                      {field.name}
                    </div>
                    <div className="text-[13px] leading-snug text-[#dcddde]">
                      {field.value}
                    </div>
                  </div>
                ))}
              </div>
            )}

            {data.image && (
              <img
                src={data.image}
                alt=""
                className="mb-2 max-h-[300px] max-w-full rounded object-contain"
              />
            )}

            {(data.footer.text || data.timestamp) && (
              <div className="mt-1 flex items-center gap-2">
                {data.footer.icon_url && (
                  <img src={data.footer.icon_url} alt="" className="h-5 w-5 rounded-full" />
                )}
                <span className="text-[12px] text-[#a3a6aa]">
                  {data.footer.text}
                  {data.footer.text && data.timestamp && ' • '}
                  {data.timestamp && timeStr}
                </span>
              </div>
            )}
          </div>

          {data.thumbnail && (
            <div className="flex-shrink-0 p-3 pr-4">
              <img src={data.thumbnail} alt="" className="h-20 w-20 rounded object-cover" />
            </div>
          )}
        </div>
      )}

      {data.buttons.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {data.buttons.map((btn, i) => (
            <div
              key={i}
              className="flex items-center gap-1 rounded px-4 py-1.5 text-[13px] font-medium text-white"
              style={{
                background: BUTTON_STYLE_COLORS[btn.style] || '#5865f2',
                opacity: btn.disabled ? 0.5 : 1,
              }}
            >
              {btn.emoji && <span>{btn.emoji}</span>}
              {btn.label}
              {btn.style === 'link' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 opacity-70">
                  <path d="M10 5V3H5.375C4.06519 3 3 4.06519 3 5.375V18.625C3 19.936 4.06519 21 5.375 21H18.625C19.936 21 21 19.936 21 18.625V14H19V19H5V5H10Z" />
                  <path d="M21 2.99902H14V4.99902H17.586L9.29297 13.292L10.707 14.706L19 6.41302V9.99902H21V2.99902Z" />
                </svg>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
