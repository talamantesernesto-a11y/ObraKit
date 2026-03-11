import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'ObraKit — Lien Waivers Profesionales para Subcontratistas'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default async function OgImage() {
  return new ImageResponse(
    (
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: '100%',
          height: '100%',
          background: 'linear-gradient(135deg, #0F1B33 0%, #1B2A4A 50%, #253A5E 100%)',
          fontFamily: 'system-ui, sans-serif',
        }}
      >
        {/* Top accent bar */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#F97316',
          }}
        />

        {/* Logo */}
        <div
          style={{
            display: 'flex',
            alignItems: 'baseline',
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-2px',
          }}
        >
          <span style={{ color: '#FFFFFF' }}>Obra</span>
          <span style={{ color: '#F97316' }}>Kit</span>
        </div>

        {/* Tagline */}
        <div
          style={{
            display: 'flex',
            fontSize: 28,
            color: 'rgba(255,255,255,0.7)',
            marginTop: 16,
            maxWidth: 700,
            textAlign: 'center',
            lineHeight: 1.4,
          }}
        >
          Lien Waivers Profesionales para Subcontratistas
        </div>

        {/* Features row */}
        <div
          style={{
            display: 'flex',
            gap: 40,
            marginTop: 48,
          }}
        >
          {['En español', 'Desde tu celular', 'En minutos'].map((text) => (
            <div
              key={text}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                color: 'rgba(255,255,255,0.6)',
                fontSize: 20,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: 4,
                  background: '#F97316',
                }}
              />
              {text}
            </div>
          ))}
        </div>

        {/* URL */}
        <div
          style={{
            position: 'absolute',
            bottom: 32,
            fontSize: 18,
            color: 'rgba(255,255,255,0.3)',
          }}
        >
          obrakit.ai
        </div>
      </div>
    ),
    { ...size }
  )
}
