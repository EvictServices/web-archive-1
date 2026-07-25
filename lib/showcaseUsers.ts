// Real Discord users whose profiles are shown in the landing page mocks.
export const SHOWCASE_USER_IDS = {
  vael: '604463848526708757',
  isia: '368896789438529538',
  fshua: '357975942276055041',
} as const

const FALLBACK_NAMES: Record<string, string> = {
  [SHOWCASE_USER_IDS.vael]: 'vael',
  [SHOWCASE_USER_IDS.isia]: 'isia',
  [SHOWCASE_USER_IDS.fshua]: 'fshua',
}

export function showcaseDisplayName(
  id: string,
  user?: { display_name?: string; username?: string },
): string {
  return user?.display_name || user?.username?.split('#')[0] || FALLBACK_NAMES[id] || 'member'
}
