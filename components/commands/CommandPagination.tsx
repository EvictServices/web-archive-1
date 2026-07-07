'use client'

import { memo } from 'react'

interface CommandPaginationProps {
  page: number
  totalPages: number
  totalItems: number
  pageSize: number
  onPageChange: (page: number) => void
}

function CommandPagination({
  page,
  totalPages,
  totalItems,
  pageSize,
  onPageChange,
}: CommandPaginationProps) {
  if (totalPages <= 1) return null

  const start = (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  const pages = getPageNumbers(page, totalPages)

  return (
    <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
      <p className="text-xs text-white/40">
        Showing <span className="text-white/65">{start}–{end}</span> of{' '}
        <span className="text-white/65">{totalItems}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <PageButton label="Previous" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ←
        </PageButton>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-xs text-white/25">
              …
            </span>
          ) : (
            <PageButton
              key={p}
              label={`Page ${p}`}
              active={p === page}
              onClick={() => onPageChange(p)}
            >
              {p}
            </PageButton>
          )
        )}

        <PageButton label="Next" disabled={page >= totalPages} onClick={() => onPageChange(page + 1)}>
          →
        </PageButton>
      </nav>
    </div>
  )
}

function PageButton({
  children,
  label,
  active,
  disabled,
  onClick,
}: {
  children: React.ReactNode
  label: string
  active?: boolean
  disabled?: boolean
  onClick: () => void
}) {
  return (
    <button
      type="button"
      aria-label={label}
      aria-current={active ? 'page' : undefined}
      disabled={disabled}
      onClick={onClick}
      className={`min-w-[2.25rem] rounded-lg border px-2.5 py-2 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'border-accent/40 bg-accent/12 text-accent'
          : 'border-white/[0.06] bg-card text-white/45 hover:border-white/[0.12] hover:text-white/75'
      }`}
    >
      {children}
    </button>
  )
}

function getPageNumbers(current: number, total: number): (number | '…')[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1)

  const pages: (number | '…')[] = [1]
  if (current > 3) pages.push('…')

  const start = Math.max(2, current - 1)
  const end = Math.min(total - 1, current + 1)
  for (let i = start; i <= end; i++) pages.push(i)

  if (current < total - 2) pages.push('…')
  pages.push(total)
  return pages
}

export default memo(CommandPagination)
