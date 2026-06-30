'use client'

import { type EmbedData } from '@/components/embeds/lib/types'
import { BUTTON_STYLE_COLORS } from '@/components/embeds/lib/constants'
import { PreviewText } from '@/components/embeds/lib/previewVariables'

export default function EmbedPreview({ data }: { data: EmbedData }) {
  const hasEmbed = data.title || data.description || data.thumbnail || data.image ||
    data.author.name || data.footer.text || data.fields.length > 0

  const timeStr = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' })

  if (!data.content && !hasEmbed && data.buttons.length === 0) {
    return (
      <div className="rounded-lg border border-dashed border-white/[0.06] bg-[#2b2d31]/50 px-4 py-8 text-center">
        <p className="text-[12px] text-[#949ba4]">Your embed preview will appear here</p>
      </div>
    )
  }

  return (
    <div>
      {data.content && (
        <div className="mb-2 break-words text-[14px] leading-[1.375] text-[#dbdee1] whitespace-pre-wrap sm:text-[15px]">
          <PreviewText text={data.content} />
        </div>
      )}

      {hasEmbed && (
        <div className="grid w-full max-w-full grid-cols-[4px_1fr] overflow-hidden rounded-[4px] sm:max-w-[432px]">
          <div className="rounded-l-[4px]" style={{ background: data.color || '#5f828d' }} />
          <div className="min-w-0 rounded-r-[4px] bg-[#2b2d31] p-3 pr-4">
            <div className="flex gap-3">
              <div className="min-w-0 flex-1">
                {data.author.name && (
                  <div className="mb-1 flex items-center gap-2">
                    {data.author.icon_url && (
                      <img src={data.author.icon_url} alt="" className="h-6 w-6 rounded-full object-cover" />
                    )}
                    <span className="text-[13px] font-semibold text-[#f2f3f5]"><PreviewText text={data.author.name} /></span>
                  </div>
                )}

                {data.title && (
                  <div className={`mb-0.5 text-[15px] font-semibold leading-snug ${data.url ? 'text-[#00a8fc]' : 'text-[#f2f3f5]'}`}>
                    <PreviewText text={data.title} />
                  </div>
                )}

                {data.description && (
                  <div className="break-words text-[13px] leading-[1.375] text-[#dbdee1] whitespace-pre-wrap sm:text-[14px]">
                    <PreviewText text={data.description} />
                  </div>
                )}

                {data.fields.length > 0 && (
                  <div className="mt-2 grid grid-cols-1 gap-x-4 gap-y-2 sm:grid-cols-3">
                    {data.fields.map((field, i) => (
                      <div key={i} className={field.inline ? 'col-span-1 sm:col-span-1' : 'col-span-1 sm:col-span-3'}>
                        <div className="mb-0.5 break-words text-[13px] font-semibold text-[#f2f3f5]">
                          {field.name ? <PreviewText text={field.name} /> : '\u200b'}
                        </div>
                        <div className="break-words text-[13px] leading-snug text-[#dbdee1] whitespace-pre-wrap sm:text-[14px]">
                          {field.value ? <PreviewText text={field.value} /> : '\u200b'}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {data.image && (
                  <img src={data.image} alt="" className="mt-2 max-h-[300px] max-w-full rounded object-contain" />
                )}

                {(data.footer.text || data.timestamp) && (
                  <div className="mt-2 flex flex-wrap items-center gap-2">
                    {data.footer.icon_url && (
                      <img src={data.footer.icon_url} alt="" className="h-5 w-5 shrink-0 rounded-full object-cover" />
                    )}
                    <span className="break-words text-[11px] text-[#949ba4] sm:text-[12px]">
                      {data.footer.text && <PreviewText text={data.footer.text} />}
                      {data.footer.text && data.timestamp && ' • '}
                      {data.timestamp && `Today at ${timeStr}`}
                    </span>
                  </div>
                )}
              </div>

              {data.thumbnail && (
                <img src={data.thumbnail} alt="" className="h-16 w-16 shrink-0 rounded object-cover sm:h-20 sm:w-20" />
              )}
            </div>
          </div>
        </div>
      )}

      {data.buttons.length > 0 && (
        <div className="mt-2 flex flex-wrap gap-2">
          {data.buttons.map((btn, i) => (
            <div
              key={i}
              className="flex items-center gap-1.5 rounded-[3px] px-4 py-1.5 text-[13px] font-medium text-white"
              style={{
                background: BUTTON_STYLE_COLORS[btn.style] || '#5865f2',
                opacity: btn.disabled ? 0.45 : 1,
              }}
            >
              {btn.emoji && <span>{btn.emoji}</span>}
              <span>{btn.label ? <PreviewText text={btn.label} /> : 'Button'}</span>
              {btn.style === 'link' && (
                <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" className="opacity-70">
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
