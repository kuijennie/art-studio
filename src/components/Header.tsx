import { useState } from 'react'
import { Link } from '@tanstack/react-router'
import { SignedIn, SignedOut, UserButton } from '@clerk/clerk-react'
import { useCart } from '../context/CartContext'

const CURRENCIES = ['KSH']

interface HeaderProps {
  darkMode?: boolean
}

export default function Header({ darkMode = false }: HeaderProps) {
  const { totalItems, openCart } = useCart()
  const [currency, setCurrency] = useState('KSH')

  const textColor = darkMode ? 'rgba(255,255,255,0.92)' : '#111111'
  const pillBg = darkMode ? 'rgba(255,255,255,0.10)' : 'rgba(255,255,255,0.55)'
  const pillBorder = darkMode
    ? '1px solid rgba(255,255,255,0.18)'
    : '1px solid rgba(255,255,255,0.7)'

  const pillStyle: React.CSSProperties = {
    background: pillBg,
    border: pillBorder,
    backdropFilter: 'blur(18px)',
    WebkitBackdropFilter: 'blur(18px)',
    borderRadius: '999px',
    padding: '8px 18px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    color: textColor,
    transition: 'background 700ms ease-out, border 700ms ease-out, color 700ms ease-out',
    cursor: 'pointer',
  }

  return (
    <header
      style={{
        position: 'fixed',
        top: 18,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '0 24px',
        pointerEvents: 'none',
      }}
    >
      {/* Brand */}
      <Link
        to="/"
        style={{ ...pillStyle, pointerEvents: 'auto', textDecoration: 'none' }}
      >
        <span
          style={{
            fontSize: '20px',
            fontWeight: 700,
            letterSpacing: '0.22em',
            textTransform: 'uppercase',
            color: textColor,
            transition: 'color 700ms ease-out',
          }}
        >
          ART STUDIO
        </span>
      </Link>

      {/* Right pills */}
      <div style={{ display: 'flex', gap: '10px', pointerEvents: 'auto', alignItems: 'center' }}>
        {/* Currency */}
        <div style={pillStyle}>
          <select
            value={currency}
            onChange={e => setCurrency(e.target.value)}
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.12em',
              textTransform: 'uppercase',
              color: textColor,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              cursor: 'pointer',
              transition: 'color 700ms ease-out',
            }}
          >
            {CURRENCIES.map(c => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Cart */}
        <button
          onClick={openCart}
          style={{
            ...pillStyle,
            gap: '6px',
            minWidth: '72px',
            justifyContent: 'center',
            background: pillBg,
            border: pillBorder,
          }}
        >
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke={textColor}
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ transition: 'stroke 700ms ease-out', flexShrink: 0 }}
          >
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z" />
            <line x1="3" y1="6" x2="21" y2="6" />
            <path d="M16 10a4 4 0 01-8 0" />
          </svg>
          <span
            style={{
              fontSize: '12px',
              fontWeight: 600,
              letterSpacing: '0.08em',
              color: textColor,
              transition: 'color 700ms ease-out',
            }}
          >
            {totalItems}
          </span>
        </button>

        {/* Auth */}
        <SignedOut>
          <Link
            to="/sign-in"
            style={{
              ...pillStyle,
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Sign In
          </Link>
        </SignedOut>

        <SignedIn>
          <div
            style={{
              ...pillStyle,
              padding: '6px 6px',
              justifyContent: 'center',
            }}
          >
            <UserButton
              appearance={{
                elements: {
                  avatarBox: { width: '28px', height: '28px' },
                },
              }}
              afterSignOutUrl="/"
            />
          </div>
        </SignedIn>
      </div>
    </header>
  )
}
