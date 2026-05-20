import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import type { Product, ProductLayout } from '../data/products'

interface ProductCardProps {
  product: Product
  layout: ProductLayout
  onHover: (tint: string | null) => void
  isDimmed: boolean
}

export default function ProductCard({ product, layout, onHover, isDimmed }: ProductCardProps) {
  const [hovered, setHovered] = useState(false)

  function handleEnter() {
    setHovered(true)
    onHover(product.tint)
  }

  function handleLeave() {
    setHovered(false)
    onHover(null)
  }

  return (
    <div
      className={layout.floatClass}
      style={{
        position: 'absolute',
        left: `${layout.left}%`,
        top: `${layout.top}%`,
        width: `${layout.width}px`,
        zIndex: hovered ? 10 : 1,
        opacity: isDimmed && !hovered ? 0.28 : 1,
        transition: 'opacity 500ms ease',
      }}
    >
      <Link
        to="/products/$slug"
        params={{ slug: product.slug }}
        onMouseEnter={handleEnter}
        onMouseLeave={handleLeave}
        style={{
          display: 'block',
          transform: hovered ? 'scale(1.06)' : 'scale(1)',
          transition: 'transform 320ms cubic-bezier(0.34, 1.56, 0.64, 1)',
          willChange: 'transform',
        }}
      >
        <img
          src={product.image}
          alt={product.name}
          loading="lazy"
          style={{
            width: '100%',
            display: 'block',
            borderRadius: '4px',
            objectFit: 'cover',
          }}
        />
        <p
          style={{
            textAlign: 'center',
            fontSize: '10px',
            fontWeight: 600,
            letterSpacing: '0.18em',
            textTransform: 'uppercase',
            color: '#ffffff',
            marginTop: '10px',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 260ms ease, transform 260ms ease',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          {product.name}
        </p>
        <p
          style={{
            textAlign: 'center',
            fontSize: '10px',
            fontWeight: 400,
            letterSpacing: '0.1em',
            color: 'rgba(255,255,255,0.7)',
            marginTop: '3px',
            opacity: hovered ? 1 : 0,
            transform: hovered ? 'translateY(0)' : 'translateY(4px)',
            transition: 'opacity 260ms ease 40ms, transform 260ms ease 40ms',
            pointerEvents: 'none',
            userSelect: 'none',
          }}
        >
          KSh {product.price.toLocaleString()}
        </p>
      </Link>
    </div>
  )
}
