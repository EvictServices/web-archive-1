'use client'

import { useEffect, useRef, useState } from 'react'
import { avatarThumbUrl } from '@/lib/avatars'

const EAGER_COUNT = 12

function imageReady(img: HTMLImageElement | null): boolean {
  return Boolean(img?.complete && img.naturalWidth > 0)
}

export default function AvatarCardImage({
  url,
  alt,
  index,
}: {
  url: string
  alt: string
  index: number
}) {
  const imgRef = useRef<HTMLImageElement>(null)
  const thumbSrc = avatarThumbUrl(url)
  const [src, setSrc] = useState(thumbSrc)
  const [loaded, setLoaded] = useState(false)
  const eager = index < EAGER_COUNT

  useEffect(() => {
    setSrc(thumbSrc)
    setLoaded(false)
  }, [thumbSrc])

  useEffect(() => {
    if (imageReady(imgRef.current)) setLoaded(true)
  }, [src])

  return (
    <>
      {!loaded && (
        <span className="absolute inset-0 block rounded-lg bg-white/[0.03]" aria-hidden />
      )}
      <img
        ref={imgRef}
        src={src}
        alt={alt}
        className={`h-full w-full rounded-lg object-cover transition-opacity duration-300 ${loaded ? 'opacity-100' : 'opacity-0'}`}
        width={160}
        height={160}
        decoding="async"
        loading={eager ? 'eager' : 'lazy'}
        fetchPriority={index < 6 ? 'high' : index < EAGER_COUNT ? 'low' : 'auto'}
        onLoad={() => setLoaded(true)}
        onError={() => {
          if (src !== url) setSrc(url)
        }}
      />
    </>
  )
}
