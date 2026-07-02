import { useState } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { loadStripe } from '@stripe/stripe-js'
import {
  Elements,
  CardNumberElement,
  CardExpiryElement,
  CardCvcElement,
  useStripe,
  useElements,
} from '@stripe/react-stripe-js'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useIsMobile } from '../hooks/useIsMobile'

const STRIPE_KEY = import.meta.env.VITE_STRIPE_PUBLISHABLE_KEY
const stripeReady = STRIPE_KEY && !STRIPE_KEY.includes('YOUR_STRIPE_KEY')
const stripePromise = stripeReady ? loadStripe(STRIPE_KEY) : null

const CARD_STYLE = {
  style: {
    base: {
      iconColor: 'rgba(255,255,255,0.55)',
      color: '#ffffff',
      fontWeight: '400',
      fontFamily: 'Inter, system-ui, sans-serif',
      fontSize: '14px',
      fontSmoothing: 'antialiased',
      '::placeholder': { color: 'rgba(255,255,255,0.28)' },
    },
    invalid: { iconColor: '#ff6b81', color: '#ff6b81' },
  },
}

const fieldStyle: React.CSSProperties = {
  background: 'rgba(255,255,255,0.05)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '10px',
  padding: '12px 14px',
  color: '#ffffff',
  fontSize: '14px',
  fontFamily: 'Inter, system-ui, sans-serif',
  width: '100%',
  outline: 'none',
  transition: 'border-color 180ms',
}

const stripeFieldStyle: React.CSSProperties = {
  ...fieldStyle,
  padding: '13px 14px',
}

const labelStyle: React.CSSProperties = {
  fontSize: '11px',
  fontWeight: 600,
  letterSpacing: '0.12em',
  textTransform: 'uppercase' as const,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: '6px',
  display: 'block',
}

function SuccessScreen({ orderNumber }: { orderNumber: string }) {
  const navigate = useNavigate()
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '60vh',
        gap: '20px',
        textAlign: 'center',
        padding: '40px 24px',
      }}
    >
      <div
        style={{
          width: '64px',
          height: '64px',
          borderRadius: '50%',
          background: 'rgba(198,241,53,0.15)',
          border: '1px solid rgba(198,241,53,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#c6f135" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <polyline points="20 6 9 17 4 12" />
        </svg>
      </div>
      <div>
        <h2
          style={{
            fontSize: '22px',
            fontWeight: 700,
            letterSpacing: '0.08em',
            textTransform: 'uppercase',
            color: '#ffffff',
            margin: '0 0 8px',
          }}
        >
          Order Confirmed
        </h2>
        <p style={{ color: 'rgba(255,255,255,0.45)', fontSize: '13px', margin: 0 }}>
          Order #{orderNumber}
        </p>
      </div>
      <p
        style={{
          color: 'rgba(255,255,255,0.55)',
          fontSize: '14px',
          maxWidth: '320px',
          lineHeight: 1.6,
          margin: 0,
        }}
      >
        Thank you for your order. You'll receive a confirmation email shortly.
      </p>
      <button
        onClick={() => navigate({ to: '/' })}
        style={{
          marginTop: '8px',
          padding: '13px 32px',
          borderRadius: '999px',
          border: 'none',
          background: '#c6f135',
          color: '#0a0a0a',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.16em',
          textTransform: 'uppercase',
          cursor: 'pointer',
        }}
      >
        Continue Shopping
      </button>
    </div>
  )
}

function CheckoutForm() {
  const stripe = useStripe()
  const elements = useElements()
  const { items, clearCart, closeCart } = useCart()
  const { user } = useAuth()

  const [form, setForm] = useState({
    email: user?.email ?? '',
    name: user?.fullname ?? '',
    phone: '',
    address: '',
    city: '',
    postal: '',
    country: 'Kenya',
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [orderNumber, setOrderNumber] = useState<string | null>(null)
  const isMobile = useIsMobile()

  const subtotal = items.reduce((s, i) => s + i.product.price * i.quantity, 0)
  const shipping = subtotal >= 100 ? 0 : 500
  const total = subtotal + shipping

  function set(key: keyof typeof form) {
    return (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
      setForm(f => ({ ...f, [key]: e.target.value }))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!form.email || !form.name || !form.address || !form.city) {
      setError('Please fill in all required fields.')
      return
    }

    setLoading(true)

    try {
      if (stripe && elements && stripeReady) {
        const cardNumber = elements.getElement(CardNumberElement)
        if (!cardNumber) throw new Error('Card element missing')

        const { paymentMethod, error: stripeErr } = await stripe.createPaymentMethod({
          type: 'card',
          card: cardNumber,
          billing_details: {
            name: form.name,
            email: form.email,
            phone: form.phone || undefined,
            address: {
              line1: form.address,
              city: form.city,
              postal_code: form.postal || undefined,
              country: 'KE',
            },
          },
        })

        if (stripeErr) {
          setError(stripeErr.message ?? 'Card error. Please check your details.')
          setLoading(false)
          return
        }

        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentMethodId: paymentMethod?.id,
            amount: subtotal,
            currency: 'kes',
            items,
            shipping: form,
          }),
        })
        const data = await res.json() as { orderNumber?: string; error?: string }
        if (!res.ok) throw new Error(data.error ?? 'Payment failed.')
        setOrderNumber(data.orderNumber ?? 'LPJ-UNKNOWN')
      } else {
        // Stripe not configured — simulate processing
        await new Promise(r => setTimeout(r, 1200))
        setOrderNumber('LPJ-' + Math.random().toString(36).slice(2, 8).toUpperCase())
      }

      clearCart()
      closeCart()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (orderNumber) return <SuccessScreen orderNumber={orderNumber} />

  return (
    <form onSubmit={handleSubmit} noValidate>
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0,1fr) minmax(0,380px)',
          gap: '40px',
          alignItems: 'start',
        }}
        className="checkout-grid"
      >
        {/* ── Left: form ─────────────────────────────────────────── */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>

          {/* Contact */}
          <section>
            <h2 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>
              Contact
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Email *</label>
                <input
                  type="email"
                  required
                  value={form.email}
                  onChange={set('email')}
                  placeholder="you@example.com"
                  style={fieldStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={set('phone')}
                  placeholder="+254 700 000 000"
                  style={fieldStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
            </div>
          </section>

          {/* Shipping */}
          <section>
            <h2 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>
              Shipping
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Full Name *</label>
                <input
                  required
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Jane Doe"
                  style={fieldStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div>
                <label style={labelStyle}>Address *</label>
                <input
                  required
                  value={form.address}
                  onChange={set('address')}
                  placeholder="123 Ngong Road"
                  style={fieldStyle}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>City *</label>
                  <input
                    required
                    value={form.city}
                    onChange={set('city')}
                    placeholder="Nairobi"
                    style={fieldStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
                <div>
                  <label style={labelStyle}>Postal Code</label>
                  <input
                    value={form.postal}
                    onChange={set('postal')}
                    placeholder="00100"
                    style={fieldStyle}
                    onFocus={e => (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.5)')}
                    onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                  />
                </div>
              </div>
              <div>
                <label style={labelStyle}>Country</label>
                <select
                  value={form.country}
                  onChange={set('country')}
                  style={{ ...fieldStyle, cursor: 'pointer' }}
                  onFocus={e => (e.currentTarget.style.borderColor = 'rgba(198,241,53,0.5)')}
                  onBlur={e => (e.currentTarget.style.borderColor = 'rgba(255,255,255,0.1)')}
                >
                  <option value="Kenya">Kenya</option>
                  <option value="Uganda">Uganda</option>
                  <option value="Tanzania">Tanzania</option>
                  <option value="Rwanda">Rwanda</option>
                  <option value="Ethiopia">Ethiopia</option>
                </select>
              </div>
            </div>
          </section>

          {/* Payment */}
          <section>
            <h2 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '0 0 16px' }}>
              Payment
            </h2>

            {!stripeReady && (
              <div
                style={{
                  padding: '12px 16px',
                  background: 'rgba(255,200,0,0.08)',
                  border: '1px solid rgba(255,200,0,0.2)',
                  borderRadius: '10px',
                  marginBottom: '16px',
                  fontSize: '12px',
                  color: 'rgba(255,220,80,0.85)',
                  letterSpacing: '0.04em',
                }}
              >
                Add <code style={{ fontFamily: 'monospace', color: '#c6f135' }}>VITE_STRIPE_PUBLISHABLE_KEY</code> to .env.local to enable live card processing.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <label style={labelStyle}>Card Number</label>
                <div style={stripeFieldStyle}>
                  <CardNumberElement options={CARD_STYLE} />
                </div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '12px' }}>
                <div>
                  <label style={labelStyle}>Expiry</label>
                  <div style={stripeFieldStyle}>
                    <CardExpiryElement options={CARD_STYLE} />
                  </div>
                </div>
                <div>
                  <label style={labelStyle}>CVC</label>
                  <div style={stripeFieldStyle}>
                    <CardCvcElement options={CARD_STYLE} />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {error && (
            <p
              style={{
                fontSize: '13px',
                color: '#ff6b81',
                background: 'rgba(255,107,129,0.08)',
                border: '1px solid rgba(255,107,129,0.2)',
                borderRadius: '10px',
                padding: '12px 16px',
                margin: 0,
              }}
            >
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading || items.length === 0}
            style={{
              padding: '16px',
              borderRadius: '999px',
              border: 'none',
              background: loading ? 'rgba(198,241,53,0.5)' : '#c6f135',
              color: '#0a0a0a',
              fontSize: '12px',
              fontWeight: 700,
              letterSpacing: '0.18em',
              textTransform: 'uppercase',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'opacity 200ms',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '10px',
            }}
          >
            {loading && (
              <span
                style={{
                  width: '14px',
                  height: '14px',
                  border: '2px solid rgba(0,0,0,0.2)',
                  borderTopColor: '#0a0a0a',
                  borderRadius: '50%',
                  animation: 'spin 0.7s linear infinite',
                  flexShrink: 0,
                }}
              />
            )}
            {loading ? 'Processing…' : `Place Order — KSh ${total.toLocaleString()}`}
          </button>

          <p style={{ fontSize: '11px', color: 'rgba(255,255,255,0.25)', textAlign: 'center', margin: 0, letterSpacing: '0.04em' }}>
            By placing your order you agree to our Terms & Privacy Policy
          </p>
        </div>

        {/* ── Right: order summary ────────────────────────────────── */}
        <div
          style={{
            background: 'rgba(255,255,255,0.04)',
            border: '1px solid rgba(255,255,255,0.07)',
            borderRadius: '16px',
            padding: isMobile ? '20px' : '24px',
            position: isMobile ? 'static' : 'sticky',
            top: isMobile ? 'auto' : '100px',
          }}
        >
          <h2 style={{ fontSize: '12px', fontWeight: 700, letterSpacing: '0.2em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', margin: '0 0 20px' }}>
            Order Summary
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '2px', marginBottom: '20px' }}>
            {items.map(item => (
              <div
                key={item.product.slug}
                style={{
                  display: 'flex',
                  gap: '12px',
                  alignItems: 'center',
                  padding: '10px 0',
                  borderBottom: '1px solid rgba(255,255,255,0.05)',
                }}
              >
                <div style={{ position: 'relative', flexShrink: 0 }}>
                  <img
                    src={item.product.image}
                    alt={item.product.name}
                    style={{ width: '52px', height: '64px', objectFit: 'cover', borderRadius: '8px', border: '1px solid rgba(255,255,255,0.06)' }}
                  />
                  <span
                    style={{
                      position: 'absolute',
                      top: '-6px',
                      right: '-6px',
                      width: '18px',
                      height: '18px',
                      background: 'rgba(255,255,255,0.2)',
                      borderRadius: '50%',
                      fontSize: '10px',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#fff',
                    }}
                  >
                    {item.quantity}
                  </span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ margin: '0 0 3px', fontSize: '12px', fontWeight: 600, color: '#ffffff', letterSpacing: '0.06em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.product.name}
                  </p>
                  <p style={{ margin: 0, fontSize: '11px', color: 'rgba(255,255,255,0.4)' }}>
                    KSh {item.product.price.toLocaleString()}
                  </p>
                </div>
                <p style={{ margin: 0, fontSize: '13px', fontWeight: 600, color: '#ffffff', flexShrink: 0 }}>
                  KSh {(item.product.price * item.quantity).toLocaleString()}
                </p>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Subtotal</span>
              <span style={{ fontSize: '13px', color: '#ffffff' }}>KSh {subtotal.toLocaleString()}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '13px', color: 'rgba(255,255,255,0.45)' }}>Shipping</span>
              <span style={{ fontSize: '13px', color: shipping === 0 ? '#c6f135' : '#ffffff' }}>
                {shipping === 0 ? 'Free' : `KSh ${shipping}`}
              </span>
            </div>
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                paddingTop: '12px',
                borderTop: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontSize: '14px', fontWeight: 700, color: '#ffffff', letterSpacing: '0.06em' }}>Total</span>
              <span style={{ fontSize: '16px', fontWeight: 700, color: '#ffffff' }}>KSh {total.toLocaleString()}</span>
            </div>
          </div>
        </div>
      </div>
    </form>
  )
}

export default function CheckoutPage() {
  const { items } = useCart()
  const navigate = useNavigate()
  const isMobile = useIsMobile()

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'radial-gradient(ellipse at 50% 0%, #141414 0%, #0a0a0a 60%, #000000 100%)',
        padding: '0 0 80px',
      }}
    >
      {/* Top bar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexWrap: isMobile ? 'wrap' : 'nowrap',
          gap: isMobile ? '14px' : '0',
          padding: isMobile ? '18px 16px' : '22px 40px',
          borderBottom: '1px solid rgba(255,255,255,0.06)',
          marginBottom: '48px',
        }}
      >
        <Link
          to="/"
          style={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#ffffff',
            textDecoration: 'none',
          }}
        >
          ART STUDIO
        </Link>
        <button
          onClick={() => navigate({ to: '/' })}
          style={{
            background: 'none',
            border: 'none',
            color: 'rgba(255,255,255,0.4)',
            fontSize: '12px',
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
          }}
        >
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="19" y1="12" x2="5" y2="12" /><polyline points="12 19 5 12 12 5" />
          </svg>
          Continue Shopping
        </button>
      </div>

      <div style={{ maxWidth: '960px', margin: '0 auto', padding: isMobile ? '0 16px' : '0 24px' }}>
        <h1
          style={{
            fontSize: 'clamp(20px, 3vw, 28px)',
            fontWeight: 700,
            letterSpacing: '0.1em',
            textTransform: 'uppercase',
            color: '#ffffff',
            marginBottom: '40px',
          }}
        >
          Checkout
          {items.length > 0 && (
            <span style={{ fontSize: '13px', fontWeight: 400, color: 'rgba(255,255,255,0.35)', marginLeft: '12px', letterSpacing: '0.06em' }}>
              {items.length} {items.length === 1 ? 'item' : 'items'}
            </span>
          )}
        </h1>

        {items.length === 0 ? (
          <div style={{ textAlign: 'center', paddingTop: '80px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px' }}>
            <p style={{ color: 'rgba(255,255,255,0.35)', fontSize: '14px', letterSpacing: '0.08em' }}>
              Your cart is empty.
            </p>
            <button
              onClick={() => navigate({ to: '/' })}
              style={{
                padding: '12px 28px',
                borderRadius: '999px',
                border: '1px solid rgba(255,255,255,0.15)',
                background: 'transparent',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: 600,
                letterSpacing: '0.14em',
                textTransform: 'uppercase',
                cursor: 'pointer',
              }}
            >
              Browse Products
            </button>
          </div>
        ) : (
          <Elements stripe={stripePromise}>
            <CheckoutForm />
          </Elements>
        )}
      </div>

      <style>{`
        @media (max-width: 680px) {
          .checkout-grid {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </div>
  )
}
