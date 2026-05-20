import { SignUp } from '@clerk/clerk-react'

const clerkAppearance = {
  variables: {
    colorBackground: 'rgba(12, 12, 16, 0.72)',
    colorPrimary: '#c6f135',
    colorText: '#ffffff',
    colorTextSecondary: 'rgba(255,255,255,0.55)',
    colorTextOnPrimaryBackground: '#0a0a0a',
    colorInputBackground: 'rgba(255,255,255,0.06)',
    colorInputText: '#ffffff',
    colorNeutral: 'rgba(255,255,255,0.12)',
    borderRadius: '12px',
    fontFamily: 'Inter, system-ui, sans-serif',
    fontSize: '14px',
  },
  elements: {
    card: {
      background: 'rgba(255,255,255,0.055)',
      backdropFilter: 'blur(24px)',
      WebkitBackdropFilter: 'blur(24px)',
      border: '1px solid rgba(255,255,255,0.10)',
      boxShadow: '0 40px 80px rgba(0,0,0,0.5)',
      borderRadius: '20px',
      padding: '8px',
    },
    headerTitle: {
      color: '#ffffff',
      fontSize: '20px',
      fontWeight: '700',
      letterSpacing: '0.06em',
      textTransform: 'uppercase',
    },
    headerSubtitle: {
      color: 'rgba(255,255,255,0.5)',
      fontSize: '12px',
      letterSpacing: '0.04em',
    },
    socialButtonsBlockButton: {
      background: 'rgba(255,255,255,0.07)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: '#ffffff',
      borderRadius: '10px',
    },
    dividerLine: {
      background: 'rgba(255,255,255,0.1)',
    },
    dividerText: {
      color: 'rgba(255,255,255,0.35)',
      fontSize: '11px',
      letterSpacing: '0.1em',
    },
    formFieldLabel: {
      color: 'rgba(255,255,255,0.65)',
      fontSize: '11px',
      fontWeight: '600',
      letterSpacing: '0.1em',
      textTransform: 'uppercase',
    },
    formFieldInput: {
      background: 'rgba(255,255,255,0.06)',
      border: '1px solid rgba(255,255,255,0.12)',
      color: '#ffffff',
      borderRadius: '10px',
    },
    formButtonPrimary: {
      background: '#c6f135',
      color: '#0a0a0a',
      fontWeight: '700',
      fontSize: '12px',
      letterSpacing: '0.16em',
      textTransform: 'uppercase',
      borderRadius: '999px',
      border: 'none',
    },
    footerActionLink: {
      color: '#c6f135',
    },
  },
}

export default function SignUpPage() {
  return (
    <div
      style={{
        minHeight: '100vh',
        background:
          'radial-gradient(ellipse at 50% 35%, #1a2a1a 0%, #0d1a12 25%, #0a0a0a 75%, #000000 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
        gap: '32px',
      }}
    >
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        <span
          style={{
            fontSize: '13px',
            fontWeight: 700,
            letterSpacing: '0.32em',
            textTransform: 'uppercase',
            color: '#ffffff',
          }}
        >
          LALAPJ
        </span>
        <span
          style={{
            fontSize: '11px',
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            color: 'rgba(255,255,255,0.38)',
          }}
        >
          Create your account
        </span>
      </div>

      <SignUp
        appearance={clerkAppearance}
        afterSignUpUrl="/"
        signInUrl="/sign-in"
        routing="path"
        path="/sign-up"
      />
    </div>
  )
}
