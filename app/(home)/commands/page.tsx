'use client'

import { useState, useEffect, useCallback, useRef, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import Navbar from '@/components/sections/Navbar'
import Footer from '@/components/sections/Footer'
import CommandList from '@/components/commands/CommandList'
import CommandSidebar from '@/components/commands/CommandSidebar'
import CommandPagination from '@/components/commands/CommandPagination'
import CommandModal from '@/components/commands/CommandModal'
import PageHeader from '@/components/ui/PageHeader'
import { PAGE_TOP_PADDING, PAGE_X_PADDING } from '@/lib/pageLayout'
import { useCommands } from '@/hooks/useCommands'
import { useLightMotion } from '@/hooks/useLightMotion'
import { type Command } from '@/types/command'

const PAGE_SIZE = 24
const ease = [0.23, 1, 0.32, 1] as const

export default function CommandsPage() {
  const {
    allCommands,
    filtered,
    commandByName,
    categories,
    loading,
    activeCategory,
    search,
    isSearchPending,
    displayCounts,
    categoryCounts,
    setSearch,
    switchCategory,
  } = useCommands()

  const lightMotion = useLightMotion()
  const [modalCmd, setModalCmd] = useState<Command | null>(null)
  const [page, setPage] = useState(1)
  const [pageDirection, setPageDirection] = useState(0)
  const searchRef = useRef<HTMLInputElement>(null)

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE))
  const contentKey = `${activeCategory}-${search.trim().toLowerCase()}`

  const paginated = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE
    return filtered.slice(start, start + PAGE_SIZE)
  }, [filtered, page])

  useEffect(() => {
    setPage(1)
  }, [activeCategory, search])

  useEffect(() => {
    if (page > totalPages) setPage(totalPages)
  }, [page, totalPages])

  const closeModal = useCallback(() => setModalCmd(null), [])

  const handlePageChange = useCallback(
    (next: number) => {
      setPageDirection(next > page ? 1 : -1)
      setPage(next)
      window.scrollTo({ top: 0, behavior: 'smooth' })
    },
    [page]
  )

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeModal()
      if (e.key === '/' && document.activeElement?.tagName !== 'INPUT') {
        e.preventDefault()
        searchRef.current?.focus()
      }
    }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [closeModal])

  useEffect(() => {
    document.documentElement.style.overflow = modalCmd ? 'hidden' : ''
    document.body.style.overflow = modalCmd ? 'hidden' : ''
    return () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
    }
  }, [modalCmd])

  const pointerStart = useRef<{ x: number; y: number } | null>(null)

  const handleListPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (e.button !== 0) return
    pointerStart.current = { x: e.clientX, y: e.clientY }
  }, [])

  const handleListPointerUp = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const start = pointerStart.current
      pointerStart.current = null
      if (!start || e.button !== 0) return
      if (Math.abs(e.clientX - start.x) > 6 || Math.abs(e.clientY - start.y) > 6) return

      const target = e.target as HTMLElement
      if (target.closest('[data-copy]')) return
      const card = target.closest<HTMLElement>('[data-cmd]')
      if (!card) return
      const cmd = commandByName.get(card.dataset.cmd ?? '')
      if (cmd) setModalCmd(cmd)
    },
    [commandByName]
  )

  const handleListClick = useCallback(async (e: React.MouseEvent<HTMLDivElement>) => {
    const copyBtn = (e.target as HTMLElement).closest<HTMLElement>('[data-copy]')
    if (!copyBtn) return
    e.stopPropagation()
    const name = copyBtn.dataset.copy
    if (!name) return
    try {
      await navigator.clipboard.writeText(`;${name}`)
      copyBtn.classList.add('!border-green-400/20', '!bg-green-400/10', '!text-green-400/70', '!opacity-100')
      setTimeout(() => {
        copyBtn.classList.remove('!border-green-400/20', '!bg-green-400/10', '!text-green-400/70', '!opacity-100')
      }, 1500)
    } catch {}
  }, [])

  return (
    <div className="relative min-h-screen overflow-x-clip">
      <Navbar />

      <div className={`relative mx-auto max-w-6xl pb-24 ${PAGE_X_PADDING} ${PAGE_TOP_PADDING}`}>
        <PageHeader
          label="Reference"
          title="Command Index"
          description={
            loading ? (
              'Loading commands…'
            ) : (
              <>
                View{' '}
                <span className="font-semibold text-white/70">{allCommands.length.toLocaleString()}</span>{' '}
                commands across{' '}
                <span className="font-semibold text-white/70">{categories.length}</span> categories
              </>
            )
          }
        />

        <div className="mt-12 flex min-w-0 flex-col gap-6 lg:flex-row lg:gap-10">
          <motion.div
            className="min-w-0"
            initial={{ opacity: 0, x: lightMotion ? 0 : -12 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: lightMotion ? 0.2 : 0.35, delay: lightMotion ? 0 : 0.05, ease }}
          >
            <CommandSidebar
              search={search}
              activeCategory={activeCategory}
              categories={categories}
              displayCounts={displayCounts}
              categoryCounts={categoryCounts}
              isSearchPending={isSearchPending}
              resultCount={filtered.length}
              lightMotion={lightMotion}
              searchRef={searchRef}
              onSearchChange={setSearch}
              onCategoryChange={switchCategory}
            />
          </motion.div>

          <main className="min-w-0 flex-1">
            {loading ? (
              <motion.div
                className="grid grid-cols-1 gap-3 sm:grid-cols-2"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.2 }}
              >
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="h-[8.5rem] animate-pulse rounded-2xl border border-white/[0.07] bg-card"
                  />
                ))}
              </motion.div>
            ) : (
              <AnimatePresence mode={lightMotion ? 'sync' : 'wait'}>
                {filtered.length === 0 ? (
                  <motion.div
                    key="empty"
                    initial={{ opacity: 0, scale: lightMotion ? 1 : 0.98 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: lightMotion ? 0.12 : 0.2, ease }}
                    className="rounded-3xl border border-dashed border-white/[0.1] px-6 py-20 text-center"
                  >
                    <p className="text-sm font-medium text-white/50">No commands found</p>
                    <p className="mt-2 text-xs text-white/35">Try a different search or category</p>
                  </motion.div>
                ) : (
                  <motion.div
                    key={contentKey}
                    initial={{ opacity: 0, y: lightMotion ? 0 : 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: lightMotion ? 0 : -6 }}
                    transition={{ duration: lightMotion ? 0.12 : 0.22, ease }}
                  >
                    <AnimatePresence mode={lightMotion ? 'sync' : 'wait'}>
                      <motion.div
                        key={page}
                        initial={{
                          opacity: 0,
                          x: lightMotion ? 0 : pageDirection * 16,
                        }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{
                          opacity: 0,
                          x: lightMotion ? 0 : pageDirection * -16,
                        }}
                        transition={{ duration: lightMotion ? 0.1 : 0.2, ease }}
                      >
                        <div
                          onPointerDown={handleListPointerDown}
                          onPointerUp={handleListPointerUp}
                          onClick={handleListClick}
                          className={`commands-list min-w-0 ${isSearchPending ? 'opacity-70' : ''}`}
                        >
                          <CommandList commands={paginated} lightMotion={lightMotion} />
                        </div>
                      </motion.div>
                    </AnimatePresence>
                    <CommandPagination
                      page={page}
                      totalPages={totalPages}
                      totalItems={filtered.length}
                      pageSize={PAGE_SIZE}
                      onPageChange={handlePageChange}
                    />
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </main>
        </div>
      </div>

      {modalCmd && <CommandModal cmd={modalCmd} onClose={closeModal} />}
      <Footer />
    </div>
  )
}
