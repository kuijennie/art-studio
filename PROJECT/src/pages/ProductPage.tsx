import { useParams } from '@tanstack/react-router'
import { useProduct } from '../hooks/useProducts'
import { useCart } from '../context/CartContext'
import { buildSpotlightGradient } from '../utils/color'
import { useState } from 'react'
import { useIsMobile } from '../hooks/useIsMobile'

export default function ProductPage() {
  const params = useParams({ strict: false })
  const slug = (params as { slug?: string }).slug ?? ''
  const { data: product, isLoading } = useProduct(slug)
  const { addItem } = useCart()
  const [added, setAdded] = useState(false)
  const [lightbox, setLightbox] = useState(false)
  const isMobile = useIsMobile()

  if (isLoading) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a1628',
        }}
      >
        <div
          style={{
            width: '32px',
            height: '32px',
            border: '2px solid rgba(0,0,0,0.12)',
            borderTopColor: '#111',
            borderRadius: '50%',
            animation: 'spin 0.8s linear infinite',
          }}
        />
      </div>
    )
  }

  if (!product) {
    return (
      <div
        style={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: '#0a1628',
          gap: '16px',
        }}
      >
        <p style={{ fontSize: '14px', letterSpacing: '0.12em', textTransform: 'uppercase', color: '#555' }}>
          Product not found
        </p>
      </div>
    )
  }

  const bg = buildSpotlightGradient(product.tint)

  function handleAdd() {
    addItem(product!)
    setAdded(true)
    setTimeout(() => setAdded(false), 1800)
  }

  return (
    <>
      {/* Lightbox */}
      {lightbox && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.96)',
            backdropFilter: 'blur(12px)',
            WebkitBackdropFilter: 'blur(12px)',
            zIndex: 1000,
            display: 'flex',
            alignItems: 'stretch',
            flexDirection: isMobile ? 'column' : 'row',
            overflowY: 'auto',
          }}
        >
          {/* Image panel */}
          <div
            onClick={() => setLightbox(false)}
            style={{
              flex: '1 1 0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              padding: isMobile ? '72px 18px 20px' : '48px',
              cursor: 'zoom-out',
            }}
          >
            <img
              src={product.image.replace('w=400&h=500', 'w=1200&h=1400')}
              alt={product.name}
              style={{
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                borderRadius: '8px',
                boxShadow: '0 40px 100px rgba(0,0,0,0.7)',
              }}
            />
          </div>

          {/* Description panel */}
          <div
            style={{
              width: isMobile ? '100%' : '340px',
              flexShrink: 0,
              borderLeft: isMobile ? 'none' : '1px solid rgba(255,255,255,0.07)',
              borderTop: isMobile ? '1px solid rgba(255,255,255,0.07)' : 'none',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              padding: isMobile ? '24px 18px 28px' : '56px 40px',
              gap: isMobile ? '20px' : '28px',
              background: 'rgba(255,255,255,0.02)',
            }}
          >
            {/* Category tag */}
            <span
              style={{
                fontSize: '10px',
                fontWeight: 700,
                letterSpacing: '0.28em',
                textTransform: 'uppercase',
                color: `${product.tint}cc`,
                borderBottom: `1px solid ${product.tint}44`,
                paddingBottom: '14px',
              }}
            >
              {product.category}
            </span>

            {/* Title */}
            <h2
              style={{
                fontSize: '28px',
                fontWeight: 700,
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                color: '#ffffff',
                margin: 0,
                lineHeight: 1.2,
              }}
            >
              {product.name}
            </h2>

            {/* Decorative rule */}
            <div
              style={{
                width: '40px',
                height: '2px',
                background: product.tint,
                borderRadius: '2px',
                opacity: 0.7,
              }}
            />

            {/* Description */}
            <p
              style={{
                fontSize: '14px',
                lineHeight: 1.8,
                color: 'rgba(255,255,255,0.65)',
                margin: 0,
                fontStyle: 'italic',
              }}
            >
              {product.description}
            </p>

            {/* Price */}
            <p
              style={{
                fontSize: '22px',
                fontWeight: 700,
                color: '#ffffff',
                margin: 0,
                letterSpacing: '0.04em',
              }}
            >
              KSh {product.price.toLocaleString()}
            </p>

            {/* Add to cart from lightbox */}
            <button
              onClick={() => { addItem(product!); setAdded(true); setTimeout(() => setAdded(false), 1800) }}
              style={{
                padding: '13px 28px',
                borderRadius: '999px',
                border: 'none',
                background: added ? 'rgba(255,255,255,0.9)' : '#ffffff',
                color: '#0a0a0a',
                fontSize: '11px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity 220ms',
                alignSelf: isMobile ? 'stretch' : 'flex-start',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.85')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
            >
              {added ? 'Added!' : 'Add to Cart'}
            </button>
          </div>

          {/* Close button */}
          <button
            onClick={() => setLightbox(false)}
            style={{
              position: 'fixed',
              top: isMobile ? '16px' : '24px',
              right: isMobile ? '16px' : '28px',
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: '999px',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              zIndex: 10,
            }}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>
      )}

      <div
        style={{
          minHeight: '100vh',
          background: bg,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: isMobile ? '88px 16px 36px' : '100px 24px 60px',
        }}
      >
        <div
          style={{
            display: 'flex',
            gap: isMobile ? '28px' : '64px',
            alignItems: 'flex-start',
            maxWidth: '1100px',
            width: '100%',
            flexWrap: 'wrap',
          }}
        >
          {/* Image — larger, clickable */}
          <div style={{ flex: '0 0 auto', maxWidth: '580px', width: '100%' }}>
            <div style={{ position: 'relative' }}>
              <img
                src={product.image}
                alt={product.name}
                onClick={() => setLightbox(true)}
                style={{
                  width: '100%',
                  borderRadius: '10px',
                  display: 'block',
                  objectFit: 'cover',
                  boxShadow: '0 40px 80px rgba(0,0,0,0.6)',
                  cursor: 'zoom-in',
                  transition: 'transform 300ms ease, box-shadow 300ms ease',
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.02)'
                  e.currentTarget.style.boxShadow = '0 60px 100px rgba(0,0,0,0.7)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 40px 80px rgba(0,0,0,0.6)'
                }}
              />
              <div
                style={{
                  position: 'absolute',
                  bottom: isMobile ? '10px' : '14px',
                  right: isMobile ? '10px' : '14px',
                  background: 'rgba(0,0,0,0.5)',
                  backdropFilter: 'blur(6px)',
                  borderRadius: '999px',
                  padding: isMobile ? '5px 10px' : '6px 12px',
                  fontSize: isMobile ? '9px' : '10px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.7)',
                  pointerEvents: 'none',
                }}
              >
                Click to zoom
              </div>
            </div>
          </div>

          {/* Details */}
          <div
            style={{
              flex: '1 1 280px',
              paddingTop: isMobile ? '0' : '12px',
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            <div>
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.22em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.5)',
                  marginBottom: '10px',
                }}
              >
                {product.category}
              </p>
              <h1
                style={{
                  fontSize: 'clamp(24px, 3vw, 36px)',
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                  color: '#ffffff',
                  margin: 0,
                  lineHeight: 1.15,
                }}
              >
                {product.name}
              </h1>
            </div>

            <p
              style={{
                fontSize: 'clamp(22px, 2.5vw, 30px)',
                fontWeight: 600,
                color: '#ffffff',
                letterSpacing: '0.04em',
                margin: 0,
              }}
            >
              KSh {product.price.toLocaleString()}
            </p>

            <p
              style={{
                fontSize: '14px',
                fontWeight: 400,
                color: 'rgba(255,255,255,0.72)',
                lineHeight: 1.7,
                margin: 0,
                maxWidth: isMobile ? '100%' : '360px',
              }}
            >
              {product.description}
            </p>

            <div style={{ display: 'flex', gap: '12px', marginTop: '8px', flexWrap: 'wrap' }}>
              <button
                onClick={handleAdd}
                style={{
                  padding: '14px 36px',
                  width: isMobile ? '100%' : 'auto',
                  borderRadius: '999px',
                  border: 'none',
                  background: added ? 'rgba(255,255,255,0.95)' : '#ffffff',
                  color: '#0a0a0a',
                  fontSize: '12px',
                  fontWeight: 700,
                  letterSpacing: '0.18em',
                  textTransform: 'uppercase',
                  cursor: 'pointer',
                  transition: 'all 260ms ease',
                  boxShadow: '0 4px 24px rgba(0,0,0,0.3)',
                  transform: added ? 'scale(0.97)' : 'scale(1)',
                }}
              >
                {added ? 'Added!' : 'Add to Cart'}
              </button>
            </div>

            <div
              style={{
                marginTop: '8px',
                padding: '16px 20px',
                background: 'rgba(255,255,255,0.07)',
                borderRadius: '12px',
                border: '1px solid rgba(255,255,255,0.1)',
              }}
            >
              <p
                style={{
                  fontSize: '11px',
                  fontWeight: 600,
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.4)',
                  margin: 0,
                }}
              >
                Free shipping on orders over KSh 100 · Returns within 30 days
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
