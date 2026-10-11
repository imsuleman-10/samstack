import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'SAMStack Tech — Software Engineering Agency Lahore, Pakistan';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #09090b 0%, #0f172a 50%, #020617 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'space-between',
          padding: '80px',
          fontFamily: 'sans-serif',
          color: '#ffffff',
          position: 'relative',
        }}
      >
        {/* Glow accent */}
        <div
          style={{
            position: 'absolute',
            top: '-10%',
            right: '-10%',
            width: '600px',
            height: '600px',
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(14, 165, 233, 0.25) 0%, transparent 70%)',
          }}
        />

        {/* Top bar with branding */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #0284c7 0%, #06b6d4 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 'bold',
              color: '#ffffff',
            }}
          >
            S
          </div>
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: '32px', fontWeight: '800', letterSpacing: '-0.02em' }}>
              SAMStack Tech
            </span>
            <span style={{ fontSize: '18px', color: '#38bdf8', fontWeight: '600' }}>
              Software Engineering Agency • Lahore, Pakistan
            </span>
          </div>
        </div>

        {/* Main headline */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', maxWidth: '900px' }}>
          <h1
            style={{
              fontSize: '54px',
              fontWeight: '900',
              lineHeight: 1.15,
              letterSpacing: '-0.03em',
              margin: 0,
              color: '#ffffff',
            }}
          >
            High-Performance Web Applications & Cloud Architectures
          </h1>
          <p style={{ fontSize: '24px', color: '#94a3b8', margin: 0, lineHeight: 1.4 }}>
            Full-stack systems, Next.js engineering, and scalable backend infrastructure for businesses worldwide.
          </p>
        </div>

        {/* Bottom tags */}
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          {['Next.js & React', 'TypeScript', 'Cloud & DevOps', 'API Architecture'].map((tag) => (
            <div
              key={tag}
              style={{
                padding: '10px 22px',
                borderRadius: '999px',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                fontSize: '18px',
                fontWeight: '600',
                color: '#e2e8f0',
              }}
            >
              {tag}
            </div>
          ))}
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
