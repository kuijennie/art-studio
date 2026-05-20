import { useState, useCallback } from 'react'
import { useProducts } from '../hooks/useProducts'
import { productLayouts } from '../data/products'
import ProductCard from '../components/ProductCard'
import { getPageBackground } from '../utils/color'

export default function HomePage() {
  const { data: products, isLoading } = useProducts()
  const [hoveredTint, setHoveredTint] = useState<string | null>(null)

  const handleHover = useCallback((tint: string | null) => {
    setHoveredTint(tint)
  }, [])

  const bg = getPageBackground(hoveredTint)

  const layoutMap = new Map(productLayouts.map(l => [l.slug, l]))

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
      {isLoading && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 50,
          }}
        >
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '2px solid rgba(255,255,255,0.15)',
              borderTopColor: '#ffffff',
              borderRadius: '50%',
              animation: 'spin 0.8s linear infinite',
            }}
          />
        </div>
      )}

      {products?.map(product => {
        const layout = layoutMap.get(product.slug)
        if (!layout) return null
        return (
          <ProductCard
            key={product.slug}
            product={product}
            layout={layout}
            onHover={handleHover}
            isDimmed={hoveredTint !== null && hoveredTint !== product.tint}
          />
        )
      })}

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
