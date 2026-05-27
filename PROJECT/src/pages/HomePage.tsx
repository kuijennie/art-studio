import { useState, useCallback } from 'react'
import { Link } from '@tanstack/react-router'
import { useProducts } from '../hooks/useProducts'
import type { Product } from '../hooks/useProducts'
import { productLayouts } from '../data/products'
import type { ProductLayout } from '../data/products'
import ProductCard from '../components/ProductCard'
import { getPageBackground } from '../utils/color'
import { useIsMobile } from '../hooks/useIsMobile'

const OVERFLOW_COLS: { left: number; width: number }[] = [
  { left: 4,  width: 250 },
  { left: 38, width: 280 },
  { left: 69, width: 235 },
]
const FLOAT_CLASSES: ProductLayout['floatClass'][] = ['float-a', 'float-b', 'float-c', 'float-d', 'float-e']

function fallbackLayout(slug: string, idx: number): ProductLayout {
  const col = OVERFLOW_COLS[idx % 3]
  return {
    slug,
    left: col.left,
    top: 91 + Math.floor(idx / 3) * 9,
    width: col.width,
    floatClass: FLOAT_CLASSES[idx % FLOAT_CLASSES.length],
  }
}

function MobileCard({ product }: { product: Product }) {
  return (
    <div style={{ breakInside: 'avoid', marginBottom: '12px' }}>
      <Link to="/products/$slug" params={{ slug: product.slug }} style={{ display: 'block' }}>
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{ width: '100%', display: 'block', borderRadius: '6px', objectFit: 'cover' }}
        />
        <div style={{ padding: '7px 2px 0' }}>
          <p style={{
            fontSize: '9px', fontWeight: 700, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: '#fff', margin: 0,
          }}>
            {product.name}
          </p>
          <p style={{
            fontSize: '9px', color: 'rgba(255,255,255,0.5)',
            margin: '2px 0 0', letterSpacing: '0.06em',
          }}>
            KSh {product.price.toLocaleString()}
          </p>
        </div>
      </Link>
    </div>
  )
}

export default function HomePage() {
  const { data: products, isLoading } = useProducts()
  const [hoveredTint, setHoveredTint] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const handleHover = useCallback((tint: string | null) => {
    setHoveredTint(tint)
  }, [])

  const bg = getPageBackground(hoveredTint)

  const spinner = (
    <div style={{ position: 'fixed', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 50 }}>
      <div style={{ width: '32px', height: '32px', border: '2px solid rgba(255,255,255,0.15)', borderTopColor: '#fff', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
    </div>
  )

  if (isMobile) {
    return (
      <div style={{ minHeight: '100vh', background: '#080808', padding: '88px 14px 60px' }}>
        {isLoading && spinner}
        <div style={{ columns: 2, gap: '12px' }}>
          {(products ?? []).map(product => (
            <MobileCard key={product.slug} product={product} />
          ))}
        </div>
      </div>
    )
  }

  const layoutMap = new Map(productLayouts.map(l => [l.slug, l]))
  let overflowIdx = 0
  const resolved = (products ?? []).map(product => ({
    product,
    layout: layoutMap.get(product.slug) ?? fallbackLayout(product.slug, overflowIdx++),
  }))

  return (
    <div
      style={{
        minHeight: '800vh',
        position: 'relative',
        background: bg,
        transition: 'background 700ms ease-out',
        overflow: 'hidden',
      }}
    >
      {isLoading && spinner}

      {resolved.map(({ product, layout }) => (
        <ProductCard
          key={product.slug}
          product={product}
          layout={layout}
          onHover={handleHover}
          isDimmed={hoveredTint !== null && hoveredTint !== product.tint}
        />
      ))}

      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '120px',
          background: 'linear-gradient(to top, rgba(0,0,0,0.18), transparent)',
          pointerEvents: 'none',
        }}
      />
    </div>
  )
}
