'use client'

import { useState } from 'react'
import Image, { ImageProps } from 'next/image'

type SafeImageProps = Omit<ImageProps, 'onError'> & {
  fallbackText?: string
}

export default function SafeImage({ fallbackText = 'No image', alt, ...props }: SafeImageProps) {
  const [hasError, setHasError] = useState(false)

  if (hasError || !props.src) {
    return (
      <div
        style={{
          width: '100%',
          height: '100%',
          background: 'rgba(255,255,255,0.1)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'rgba(255,255,255,0.3)',
          fontSize: '0.75rem',
        }}
      >
        {fallbackText}
      </div>
    )
  }

  return (
    <Image
      {...props}
      alt={alt}
      onError={() => setHasError(true)}
    />
  )
}
