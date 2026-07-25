import type { IconType } from 'react-icons'
import {
  TbApps,
  TbInfoCircle,
  TbMoodSmile,
  TbSettings,
  TbShield,
  TbTool,
  TbUsers,
} from 'react-icons/tb'
import { SiLastdotfm } from 'react-icons/si'

const CATEGORY_ICONS: Record<string, IconType> = {
  config: TbSettings,
  fun: TbMoodSmile,
  information: TbInfoCircle,
  lastfm: SiLastdotfm,
  moderation: TbShield,
  socials: TbUsers,
  utility: TbTool,
  economy: TbTool,
  music: TbMoodSmile,
  admin: TbSettings,
  logging: TbInfoCircle,
  security: TbShield,
}

export function categoryIcon(category: string): IconType {
  return CATEGORY_ICONS[category.toLowerCase()] ?? TbApps
}

export function formatCategory(category: string): string {
  return category[0].toUpperCase() + category.slice(1)
}
