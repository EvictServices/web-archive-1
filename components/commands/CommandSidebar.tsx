'use client'

import { memo } from 'react'
import { motion, LayoutGroup } from 'framer-motion'
import type { IconType } from 'react-icons'
import { categoryIcon, formatCategory } from '@/lib/commands/categoryStyles'

interface CommandSidebarProps {
  search: string
  activeCategory: string
  categories: string[]
  displayCounts: Record<string, string>
  categoryCounts: Record<string, number>
  isSearchPending: boolean
  resultCount: number
  lightMotion: boolean
  searchRef: React.RefObject<HTMLInputElement | null>
  onSearchChange: (value: string) => void
  onCategoryChange: (category: string) => void
}

function CommandSidebar({
  search,
  activeCategory,
  categories,
  displayCounts,
  categoryCounts,
  isSearchPending,
  resultCount,
  lightMotion,
  searchRef,
  onSearchChange,
  onCategoryChange,
}: CommandSidebarProps) {
  return (
    <aside className="min-w-0 lg:w-52 lg:shrink-0">
      <div className="lg:sticky lg:top-24">
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/15"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden
          >
            <circle cx="11" cy="11" r="8" />
            <line x1="21" y1="21" x2="16.65" y2="16.65" />
          </svg>
          <input
            ref={searchRef}
            type="search"
            placeholder="Search commands..."
            value={search}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full rounded-xl border border-white/[0.08] bg-card px-4 py-2.5 pr-9 pl-9 text-[13px] text-white/75 outline-none transition-colors placeholder:text-white/30 focus:border-accent/40 [&::-webkit-search-cancel-button]:hidden"
          />
          <kbd className="pointer-events-none absolute top-1/2 right-3 hidden -translate-y-1/2 rounded-md border border-white/[0.1] bg-white/[0.04] px-1.5 py-0.5 font-mono text-[10px] text-white/35 lg:block">
            /
          </kbd>
        </div>

        {search && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.12 }}
            className="mt-2 text-center text-xs text-accent lg:text-left"
          >
            {isSearchPending
              ? 'Searching…'
              : `${resultCount} result${resultCount !== 1 ? 's' : ''} across all categories`}
          </motion.p>
        )}

        <div className="relative mt-4 -mx-6 border-b border-white/[0.06] lg:hidden">
          <LayoutGroup id="mobile-categories">
            <nav
              className="flex gap-0 overflow-x-auto px-6 scrollbar-hide"
              aria-label="Categories"
            >
              {categories.map((cat) => (
                <MobileCategoryItem
                  key={cat}
                  category={cat}
                  label={formatCategory(cat)}
                  active={activeCategory === cat}
                  onCategoryChange={onCategoryChange}
                />
              ))}
            </nav>
          </LayoutGroup>
        </div>

        <div className="mt-4 hidden lg:block">
          <LayoutGroup id="desktop-categories">
            <nav className="flex flex-col gap-1.5" aria-label="Categories">
              {categories.map((cat) => (
                <DesktopCategoryButton
                  key={cat}
                  category={cat}
                  label={formatCategory(cat)}
                  count={displayCounts[cat] ?? String(categoryCounts[cat] ?? 0)}
                  active={activeCategory === cat}
                  icon={categoryIcon(cat)}
                  lightMotion={lightMotion}
                  onCategoryChange={onCategoryChange}
                />
              ))}
            </nav>
          </LayoutGroup>
        </div>
      </div>
    </aside>
  )
}

const MobileCategoryItem = memo(function MobileCategoryItem({
  category,
  label,
  active,
  onCategoryChange,
}: {
  category: string
  label: string
  active: boolean
  onCategoryChange: (category: string) => void
}) {
  return (
    <button
      type="button"
      onClick={() => onCategoryChange(category)}
      className={`relative shrink-0 px-3.5 py-2.5 text-xs font-medium whitespace-nowrap transition-colors ${
        active ? 'text-white' : 'text-white/40'
      }`}
    >
      {label}
      {active && (
        <motion.span
          layoutId="command-category-bar"
          className="absolute right-3.5 bottom-0 left-3.5 h-0.5 rounded-full bg-accent"
          transition={{ type: 'spring', stiffness: 500, damping: 35 }}
        />
      )}
    </button>
  )
})

const DesktopCategoryButton = memo(function DesktopCategoryButton({
  category,
  label,
  count,
  active,
  icon: Icon,
  lightMotion,
  onCategoryChange,
}: {
  category: string
  label: string
  count: string
  active: boolean
  icon: IconType
  lightMotion: boolean
  onCategoryChange: (category: string) => void
}) {
  return (
    <motion.button
      type="button"
      onClick={() => onCategoryChange(category)}
      whileTap={lightMotion ? undefined : { scale: 0.98 }}
      className={`relative flex w-full shrink-0 items-center justify-between gap-3 rounded-xl border px-3 py-2.5 text-left text-xs font-medium transition-colors duration-150 ${
        active
          ? lightMotion
            ? 'border-white/[0.14] bg-card text-white'
            : 'border-transparent bg-transparent text-white'
          : 'border-white/[0.06] bg-white/[0.02] text-white/45 hover:border-white/[0.12] hover:text-white/75'
      }`}
    >
      {active && !lightMotion && (
        <motion.div
          layoutId="command-category-active"
          className="absolute inset-0 rounded-xl border border-white/[0.14] bg-card"
          transition={{ type: 'spring', stiffness: 400, damping: 32 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-2.5">
        <Icon className={`h-4 w-4 shrink-0 ${active ? 'text-accent' : 'text-white/30'}`} />
        {label}
      </span>
      <span className={`relative z-10 font-mono text-[11px] ${active ? 'text-white/55' : 'text-white/25'}`}>
        {count}
      </span>
    </motion.button>
  )
})

export default memo(CommandSidebar)
