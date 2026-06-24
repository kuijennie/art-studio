import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import { useIsMobile } from '../hooks/useIsMobile'

interface HeaderProps {
  darkMode?: boolean
}

export default function Header({ darkMode = false }: HeaderProps) {
  const { totalItems, openCart } = useCart()
  const { user, isAuthenticated, isAdmin, logout } = useAuth()
  const navigate = useNavigate()
  const [currency] = useState('KSH')
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const dropdownRef = useRef<HTMLDivElement>(null)
  const isMobile = useIsMobile()

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

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  function handleLogout() {
    setDropdownOpen(false)
    logout()
    navigate({ to: '/' })
  }

  // Initials avatar
  const initials = user?.fullname
    ? user.fullname.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
    : '?'

  return (
    <header
      style={{
        position: 'fixed',
        top: isMobile ? 12 : 18,
        left: 0,
        right: 0,
        zIndex: 100,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: isMobile ? '0 12px' : '0 24px',
        pointerEvents: 'none',
      }}
    >
      {/* Brand */}
      <Link
        to="/"
        style={{
          ...pillStyle,
          pointerEvents: 'auto',
          textDecoration: 'none',
          padding: isMobile ? '6px 12px' : '8px 18px',
        }}
      >
        <span
          style={{
            fontSize: isMobile ? '14px' : '20px',
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
      <div
        style={{
          display: 'flex',
          gap: isMobile ? '6px' : '10px',
          pointerEvents: 'auto',
          alignItems: 'center',
        }}
      >
        {/* Currency — hidden on mobile */}
        {!isMobile && (
          <div style={pillStyle}>
            <select
              value={currency}
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
              <option value="KSH">KSH</option>
            </select>
          </div>
        )}

        {/* Cart */}
        <button
          onClick={openCart}
          style={{
            ...pillStyle,
            gap: '6px',
            minWidth: isMobile ? '54px' : '72px',
            justifyContent: 'center',
            padding: isMobile ? '6px 12px' : '8px 18px',
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

        {/* Admin link */}
        {isAdmin && (
          <Link
            to="/admin"
            style={{
              ...pillStyle,
              textDecoration: 'none',
              fontSize: '11px',
              fontWeight: 700,
              letterSpacing: '0.16em',
              textTransform: 'uppercase',
            }}
          >
            Admin
          </Link>
        )}

        {/* Auth: not signed in */}
        {!isAuthenticated && (
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
        )}

        {/* Auth: signed in — avatar + dropdown */}
        {isAuthenticated && (
          <div ref={dropdownRef} style={{ position: 'relative' }}>
            <button
              onClick={() => setDropdownOpen(v => !v)}
              style={{
                ...pillStyle,
                padding: '6px 14px 6px 8px',
                gap: '8px',
              }}
              aria-label="User menu"
            >
              {/* Avatar circle */}
              <span
                style={{
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  background: '#c6f135',
                  color: '#0a0a0a',
                  fontSize: '10px',
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  letterSpacing: '0.04em',
                  flexShrink: 0,
                }}
              >
                {initials}
              </span>
              {!isMobile && (
                <span
                  style={{
                    fontSize: '12px',
                    fontWeight: 600,
                    color: textColor,
                    maxWidth: '100px',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {user?.fullname?.split(' ')[0]}
                </span>
              )}
              <svg
                width="10"
                height="10"
                viewBox="0 0 10 6"
                fill="none"
                stroke={textColor}
                strokeWidth="1.5"
                strokeLinecap="round"
                style={{
                  transition: 'transform 0.2s',
                  transform: dropdownOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  flexShrink: 0,
                }}
              >
                <path d="M1 1l4 4 4-4" />
              </svg>
            </button>

            {/* Dropdown */}
            {dropdownOpen && (
              <div
                style={{
                  position: 'absolute',
                  top: 'calc(100% + 8px)',
                  right: 0,
                  minWidth: '180px',
                  background: 'rgba(15,15,15,0.95)',
                  backdropFilter: 'blur(20px)',
                  WebkitBackdropFilter: 'blur(20px)',
                  border: '1px solid rgba(255,255,255,0.12)',
                  borderRadius: '14px',
                  padding: '8px',
                  boxShadow: '0 20px 40px rgba(0,0,0,0.5)',
                }}
              >
                {/* User info */}
                <div
                  style={{
                    padding: '10px 12px 12px',
                    borderBottom: '1px solid rgba(255,255,255,0.08)',
                    marginBottom: '4px',
                  }}
                >
                  <p
                    style={{
                      margin: 0,
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#fff',
                    }}
                  >
                    {user?.fullname}
                  </p>
                  <p
                    style={{
                      margin: '2px 0 0',
                      fontSize: '11px',
                      color: 'rgba(255,255,255,0.4)',
                    }}
                  >
                    {user?.email}
                  </p>
                  {isAdmin && (
                    <span
                      style={{
                        display: 'inline-block',
                        marginTop: '6px',
                        padding: '2px 8px',
                        background: 'rgba(198,241,53,0.15)',
                        border: '1px solid rgba(198,241,53,0.3)',
                        borderRadius: '999px',
                        fontSize: '9px',
                        fontWeight: 700,
                        letterSpacing: '0.1em',
                        color: '#c6f135',
                        textTransform: 'uppercase',
                      }}
                    >
                      Admin
                    </span>
                  )}
                </div>

                {/* Menu items */}
                <DropdownItem
                  label="My Dashboard"
                  onClick={() => { setDropdownOpen(false); navigate({ to: '/dashboard' }) }}
                />
                {isAdmin && (
                  <DropdownItem
                    label="Admin Dashboard"
                    onClick={() => { setDropdownOpen(false); navigate({ to: '/admin' }) }}
                  />
                )}
                <DropdownItem
                  label="Sign Out"
                  onClick={handleLogout}
                  danger
                />
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  )
}

function DropdownItem({
  label,
  onClick,
  danger = false,
}: {
  label: string
  onClick: () => void
  danger?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        display: 'block',
        width: '100%',
        padding: '9px 12px',
        background: hovered
          ? danger
            ? 'rgba(255,80,80,0.1)'
            : 'rgba(255,255,255,0.07)'
          : 'transparent',
        border: 'none',
        borderRadius: '8px',
        textAlign: 'left',
        fontSize: '13px',
        fontWeight: 500,
        color: danger ? '#ff8080' : 'rgba(255,255,255,0.85)',
        cursor: 'pointer',
        transition: 'background 0.15s',
      }}
    >
      {label}
    </button>
  )
}
