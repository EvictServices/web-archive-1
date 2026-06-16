export function animateCounter(
  setter: (v: number) => void,
  end: number,
  duration: number
) {
  const start = performance.now()
  const from = 0
  const step = (now: number) => {
    const t = Math.min((now - start) / duration, 1)
    const eased = 1 - Math.pow(1 - t, 3)
    setter(Math.floor(from + (end - from) * eased))
    if (t < 1) requestAnimationFrame(step)
  }
  requestAnimationFrame(step)
}
