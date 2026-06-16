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
      <p className="text-[10px] text-white/30">
        Showing <span className="text-white/50">{start}–{end}</span> of{' '}
        <span className="text-white/50">{totalItems}</span>
      </p>

      <nav className="flex items-center gap-1" aria-label="Pagination">
        <PageButton label="Previous" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
          ←
        </PageButton>

        {pages.map((p, i) =>
          p === '…' ? (
            <span key={`ellipsis-${i}`} className="px-1 text-[10px] text-white/20">
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
      className={`min-w-[2rem] rounded-lg border px-2.5 py-1.5 text-[10px] font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-30 ${
        active
          ? 'border-white/[0.14] bg-white/[0.08] text-white'
          : 'border-white/[0.05] bg-white/[0.02] text-white/40 hover:border-white/[0.1] hover:bg-white/[0.04] hover:text-white/65'
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
