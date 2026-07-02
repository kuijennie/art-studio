import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { useCart } from '../context/CartContext'
import { useIsMobile } from '../hooks/useIsMobile'

export default function CartDrawer() {
  const { items, totalItems, isOpen, closeCart, removeItem } = useCart()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  const subtotal = items.reduce(
    (sum, i) => sum + i.product.price * i.quantity,
    0
  )

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeCart}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.55)',
          backdropFilter: 'blur(4px)',
          WebkitBackdropFilter: 'blur(4px)',
          zIndex: 200,
          opacity: isOpen ? 1 : 0,
          pointerEvents: isOpen ? 'auto' : 'none',
          transition: 'opacity 380ms ease',
        }}
      />

      {/* Drawer panel */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: 'min(420px, 100vw)',
          background: '#0d0d0d',
          borderLeft: '1px solid rgba(255,255,255,0.08)',
          zIndex: 201,
          display: 'flex',
          flexDirection: 'column',
          transform: isOpen ? 'translateX(0)' : 'translateX(100%)',
          transition: 'transform 420ms cubic-bezier(0.32, 0.72, 0, 1)',
        }}
      >
        {/* Header */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: isMobile ? '20px 18px' : '24px 28px',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
          }}
        >
          <div>
            <span
              style={{
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                color: '#ffffff',
              }}
            >
              Cart
            </span>
            {totalItems > 0 && (
              <span
                style={{
                  marginLeft: '10px',
                  fontSize: '11px',
                  color: 'rgba(255,255,255,0.4)',
                  letterSpacing: '0.08em',
                }}
              >
                {totalItems} {totalItems === 1 ? 'item' : 'items'}
              </span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'rgba(255,255,255,0.07)',
              border: '1px solid rgba(255,255,255,0.1)',
              borderRadius: '999px',
              width: '34px',
              height: '34px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'rgba(255,255,255,0.7)',
              transition: 'background 200ms',
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.14)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.07)')}
          >
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
              <line x1="1" y1="1" x2="13" y2="13" />
              <line x1="13" y1="1" x2="1" y2="13" />
            </svg>
          </button>
        </div>

        {/* Items */}
        <div style={{ flex: 1, overflowY: 'auto', padding: isMobile ? '16px 18px' : '16px 28px' }}>
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                gap: '12px',
                paddingBottom: '60px',
              }}
            >
              <svg
                width="40"
                height="40"
                viewBox="0 0 24 24"
                fill="none"
                stroke="rgba(255,255,255,0.2)"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 01-8 0" />
              </svg>
              <p
                style={{
                  fontSize: '12px',
                  letterSpacing: '0.12em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.28)',
                  margin: 0,
                }}
              >
                Your cart is empty
              </p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
              {items.map(item => (
                <div
                  key={item.product.slug}
                  style={{
                    display: 'flex',
                    gap: '16px',
                    alignItems: 'center',
                    padding: '14px 0',
                    borderBottom: '1px solid rgba(255,255,255,0.05)',
                  }}
                >
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{
                      width: '64px',
                      height: '80px',
                      objectFit: 'cover',
                      borderRadius: '8px',
                      flexShrink: 0,
                      border: '1px solid rgba(255,255,255,0.06)',
                    }}
                  />
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p
                      style={{
                        margin: '0 0 4px',
                        fontSize: '11px',
                        fontWeight: 700,
                        letterSpacing: '0.14em',
                        textTransform: 'uppercase',
                        color: '#ffffff',
                        whiteSpace: 'nowrap',
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                      }}
                    >
                      {item.product.name}
                    </p>
                    <p
                      style={{
                        margin: '0 0 8px',
                        fontSize: '11px',
                        color: 'rgba(255,255,255,0.45)',
                        letterSpacing: '0.06em',
                      }}
                    >
                      KSh {item.product.price.toLocaleString()} × {item.quantity}
                    </p>
                    <p
                      style={{
                        margin: 0,
                        fontSize: '12px',
                        fontWeight: 600,
                        color: '#ffffff',
                        letterSpacing: '0.06em',
                      }}
                    >
                      KSh {(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  <button
                    onClick={() => removeItem(item.product.slug)}
                    title="Remove"
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'rgba(255,255,255,0.3)',
                      padding: '4px',
                      display: 'flex',
                      alignItems: 'center',
                      transition: 'color 180ms',
                    }}
                    onMouseEnter={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.8)')}
                    onMouseLeave={e => (e.currentTarget.style.color = 'rgba(255,255,255,0.3)')}
                  >
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round">
                      <line x1="1" y1="1" x2="13" y2="13" />
                      <line x1="13" y1="1" x2="1" y2="13" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div
            style={{
              padding: isMobile ? '18px 18px calc(24px + env(safe-area-inset-bottom))' : '20px 28px 32px',
              borderTop: '1px solid rgba(255,255,255,0.07)',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span
                style={{
                  fontSize: '11px',
                  letterSpacing: '0.14em',
                  textTransform: 'uppercase',
                  color: 'rgba(255,255,255,0.45)',
                }}
              >
                Subtotal
              </span>
              <span
                style={{
                  fontSize: '18px',
                  fontWeight: 700,
                  color: '#ffffff',
                  letterSpacing: '0.04em',
                }}
              >
                KSh {subtotal.toLocaleString()}
              </span>
            </div>
            <button
              style={{
                width: '100%',
                padding: '15px',
                borderRadius: '999px',
                border: 'none',
                background: '#c6f135',
                color: '#0a0a0a',
                fontSize: '12px',
                fontWeight: 700,
                letterSpacing: '0.18em',
                textTransform: 'uppercase',
                cursor: 'pointer',
                transition: 'opacity 200ms',
              }}
              onMouseEnter={e => (e.currentTarget.style.opacity = '0.88')}
              onMouseLeave={e => (e.currentTarget.style.opacity = '1')}
              onClick={() => { closeCart(); navigate({ to: '/checkout' }) }}
            >
              Checkout
            </button>
            <p
              style={{
                margin: 0,
                fontSize: '11px',
                color: 'rgba(255,255,255,0.3)',
                textAlign: 'center',
                letterSpacing: '0.06em',
              }}
            >
              Free shipping on orders over KSh 100
            </p>
          </div>
        )}
      </div>
    </>
  )
}
