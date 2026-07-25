'use client'

import { useState, useEffect, useMemo, useCallback, useDeferredValue, useTransition } from 'react'
import { type Command } from '@/types/command'
import {
  buildCommandsIndex,
  fetchCommandsCached,
  filterCommands,
  type CommandsIndex,
} from '@/lib/commands/cache'

export function useCommands() {
  const [allCommands, setAllCommands] = useState<Command[]>([])
  const [index, setIndex] = useState<CommandsIndex | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('')
  const [search, setSearch] = useState('')
  const [isPending, startTransition] = useTransition()
  const deferredSearch = useDeferredValue(search)

  useEffect(() => {
    let cancelled = false
    fetchCommandsCached()
      .then((cmds) => {
        if (cancelled) return
        const built = buildCommandsIndex(cmds)
        setAllCommands(cmds)
        setIndex(built)
        setActiveCategory(built.categories[0] ?? '')
        setLoading(false)
      })
      .catch(() => {
        if (!cancelled) setLoading(false)
      })
    return () => {
      cancelled = true
    }
  }, [])

  const filtered = useMemo(() => {
    if (!index) return []
    const isSearching = deferredSearch.trim().length > 0
    const source = isSearching
      ? allCommands
      : activeCategory
        ? (index.byCategory.get(activeCategory) ?? [])
        : []
    return filterCommands(source, deferredSearch, index.searchText)
  }, [allCommands, activeCategory, deferredSearch, index])

  const switchCategory = useCallback((cat: string) => {
    startTransition(() => {
      setActiveCategory((current) => (current === cat ? current : cat))
    })
  }, [])

  return {
    allCommands,
    filtered,
    commandByName: index?.byName ?? new Map(),
    categories: index?.categories ?? [],
    loading,
    activeCategory,
    search,
    isSearchPending: search !== deferredSearch || isPending,
    displayCounts: index?.displayCounts ?? {},
    categoryCounts: index?.counts ?? {},
    setSearch,
    switchCategory,
  }
}
