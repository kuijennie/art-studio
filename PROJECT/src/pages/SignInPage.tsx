import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { useAuth } from '../context/AuthContext'

export default function SignInPage() {
  const { login, isAuthenticated } = useAuth()
  const navigate = useNavigate()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  if (isAuthenticated) {
    navigate({ to: '/' })
    return null
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      await login(email, password, rememberMe)
      navigate({ to: '/' })
    } catch (err: any) {
      setError(err.message ?? 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={styles.page}>
      {/* Background grain */}
      <div aria-hidden="true" style={styles.grain} />

      <div style={styles.card}>
        {/* Logo */}
        <div style={styles.logoBlock}>
          <Link to="/" style={styles.logoLink}>
            <span style={styles.logoText}>ART STUDIO</span>
          </Link>
          <span style={styles.logoSub}>Sign in to your account</span>
        </div>

        <form onSubmit={handleSubmit} style={styles.form}>
          {/* Email */}
          <div style={styles.field}>
            <label style={styles.label}>EMAIL</label>
            <input
              type="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              autoComplete="email"
              style={styles.input}
              onFocus={e => Object.assign(e.currentTarget.style, styles.inputFocus)}
              onBlur={e => Object.assign(e.currentTarget.style, styles.input)}
            />
          </div>

          {/* Password */}
          <div style={styles.field}>
            <label style={styles.label}>PASSWORD</label>
            <div style={styles.passwordWrap}>
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
                style={{ ...styles.input, paddingRight: '44px' }}
                onFocus={e => Object.assign(e.currentTarget.style, { ...styles.inputFocus, paddingRight: '44px' })}
                onBlur={e => Object.assign(e.currentTarget.style, { ...styles.input, paddingRight: '44px' })}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                style={styles.eyeBtn}
                tabIndex={-1}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁'}
              </button>
            </div>
          </div>

          {/* Remember me */}
          <label style={styles.checkRow}>
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={e => setRememberMe(e.target.checked)}
              style={styles.checkbox}
            />
            <span style={styles.checkLabel}>Remember me for 30 days</span>
          </label>

          {/* Error */}
          {error && <p style={styles.error}>{error}</p>}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            style={loading ? { ...styles.btn, opacity: 0.6, cursor: 'not-allowed' } : styles.btn}
          >
            {loading ? 'SIGNING IN…' : 'SIGN IN'}
          </button>
        </form>

        <p style={styles.footer}>
          Don't have an account?{' '}
          <Link to="/sign-up" style={styles.footerLink}>
            Create one
          </Link>
        </p>
      </div>
    </div>
  )
}

const styles: Record<string, React.CSSProperties> = {
  page: {
    minHeight: '100vh',
    background: 'radial-gradient(ellipse at 50% 35%, #1a2a1a 0%, #0d1a12 25%, #0a0a0a 75%, #000 100%)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '24px',
    fontFamily: 'Inter, system-ui, sans-serif',
  },
  grain: {
    position: 'fixed',
    inset: 0,
    backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.04\'/%3E%3C/svg%3E")',
    pointerEvents: 'none',
    zIndex: 0,
  },
  card: {
    position: 'relative',
    zIndex: 1,
    width: '100%',
    maxWidth: '400px',
    background: 'rgba(255,255,255,0.055)',
    backdropFilter: 'blur(24px)',
    WebkitBackdropFilter: 'blur(24px)',
    border: '1px solid rgba(255,255,255,0.10)',
    borderRadius: '20px',
    padding: '40px 36px',
    boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
  },
  logoBlock: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '6px',
    marginBottom: '32px',
  },
  logoLink: {
    textDecoration: 'none',
  },
  logoText: {
    fontSize: '15px',
    fontWeight: 700,
    letterSpacing: '0.32em',
    textTransform: 'uppercase',
    color: '#ffffff',
  },
  logoSub: {
    fontSize: '11px',
    letterSpacing: '0.14em',
    textTransform: 'uppercase',
    color: 'rgba(255,255,255,0.38)',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '18px',
  },
  field: {
    display: 'flex',
    flexDirection: 'column',
    gap: '6px',
  },
  label: {
    fontSize: '10px',
    fontWeight: 600,
    letterSpacing: '0.12em',
    color: 'rgba(255,255,255,0.55)',
  },
  input: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(255,255,255,0.12)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  inputFocus: {
    background: 'rgba(255,255,255,0.06)',
    border: '1px solid rgba(198,241,53,0.5)',
    borderRadius: '10px',
    padding: '12px 14px',
    color: '#ffffff',
    fontSize: '14px',
    outline: 'none',
    transition: 'border-color 0.2s',
    width: '100%',
    boxSizing: 'border-box',
  },
  passwordWrap: {
    position: 'relative',
  },
  eyeBtn: {
    position: 'absolute',
    right: '12px',
    top: '50%',
    transform: 'translateY(-50%)',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    fontSize: '14px',
    padding: '2px',
    lineHeight: 1,
  },
  checkRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    cursor: 'pointer',
  },
  checkbox: {
    accentColor: '#c6f135',
    width: '15px',
    height: '15px',
    cursor: 'pointer',
  },
  checkLabel: {
    fontSize: '12px',
    color: 'rgba(255,255,255,0.55)',
  },
  error: {
    margin: 0,
    padding: '10px 14px',
    background: 'rgba(255,80,80,0.12)',
    border: '1px solid rgba(255,80,80,0.3)',
    borderRadius: '8px',
    color: '#ff8080',
    fontSize: '13px',
  },
  btn: {
    marginTop: '4px',
    padding: '13px',
    background: '#c6f135',
    color: '#0a0a0a',
    border: 'none',
    borderRadius: '999px',
    fontWeight: 700,
    fontSize: '12px',
    letterSpacing: '0.16em',
    textTransform: 'uppercase',
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  },
  footer: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '13px',
    color: 'rgba(255,255,255,0.45)',
  },
  footerLink: {
    color: '#c6f135',
    textDecoration: 'none',
    fontWeight: 600,
  },
}
