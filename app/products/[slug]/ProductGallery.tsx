'use client'

import { useState } from 'react'
import Image from 'next/image'

function getImageSrc(image: string): string {
  if (!image) return '/images/placeholder.jpeg'
  if (image.startsWith('http')) return image
  return `/images/${image}`
}

export default function ProductGallery({
  images,
  productName,
  badge,
}: {
  images: string[]
  productName: string
  badge?: string | null
}) {
  const [selectedIndex, setSelectedIndex] = useState(0)
  const selectedImage = images[selectedIndex] || images[0]

  return (
    <div>
      {/* Main Image */}
      <div style={{
        position: 'relative',
        aspectRatio: '1',
        borderRadius: '12px',
        overflow: 'hidden',
        background: 'rgba(255,255,255,0.05)',
        marginBottom: images.length > 1 ? '1rem' : 0,
      }}>
        <Image
          src={getImageSrc(selectedImage)}
          alt={productName}
          fill
          style={{ objectFit: 'cover' }}
          priority
          unoptimized={selectedImage.startsWith('http')}
        />
        {badge && (
          <span style={{
            position: 'absolute',
            top: '1rem',
            left: '1rem',
            background: badge === 'sale' ? '#ef4444' : '#22c55e',
            color: 'white',
            padding: '0.25rem 0.75rem',
            borderRadius: '4px',
            fontSize: '0.75rem',
            fontWeight: 600,
            textTransform: 'uppercase',
          }}>
            {badge}
          </span>
        )}
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div style={{
          display: 'flex',
          gap: '0.5rem',
        }}>
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => setSelectedIndex(index)}
              style={{
                position: 'relative',
                width: '80px',
                height: '80px',
                borderRadius: '8px',
                overflow: 'hidden',
                border: selectedIndex === index
                  ? '2px solid white'
                  : '2px solid transparent',
                background: 'rgba(255,255,255,0.05)',
                padding: 0,
                cursor: 'pointer',
                opacity: selectedIndex === index ? 1 : 0.6,
                transition: 'opacity 0.2s, border-color 0.2s',
              }}
            >
              <Image
                src={getImageSrc(image)}
                alt={`${productName} - Image ${index + 1}`}
                fill
                style={{ objectFit: 'cover' }}
                unoptimized={image.startsWith('http')}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
