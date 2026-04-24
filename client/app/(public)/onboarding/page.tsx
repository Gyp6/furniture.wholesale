import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Get Started — Gyp6.sale',
};

const roles = [
  {
    value: 'RETAILER',
    label: 'Retailer',
    buttonLabel: 'Select Retailer',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&w=800&q=80',
    features: ['Wholesale pricing for inventory', 'Logistics automation dashboard', 'Direct communication with suppliers'],
  },
  {
    value: 'DESIGNER',
    label: 'Interior Designer',
    buttonLabel: 'Select Designer',
    image: 'https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=800&q=80',
    features: ['Project moodboard collaboration', 'Trade-only exclusive catalogs', 'White-label delivery services'],
  },
  {
    value: 'HORECA',
    label: 'HoReCa',
    buttonLabel: 'Select HoReCa',
    image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80',
    features: ['High-durability contract grade', 'Bulk procurement discounts', 'Installation & assembly support'],
  },
  {
    value: 'SUPPLIER',
    label: 'Supplier',
    buttonLabel: 'Select Supplier',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=800&q=80',
    features: ['Global distribution channel', 'Smart inventory management', 'Real-time market analytics'],
  },
];

export default function OnboardingPage() {
  return (
    <div style={{ height: '100vh', overflow: 'hidden', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      <header style={{ background: '#1A1A2E', color: 'white', flexShrink: 0 }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', height: 56, display: 'flex', alignItems: 'center', padding: '0 24px' }}>
          <span style={{ fontSize: 14, fontWeight: 600 }}>Gyp6.sale</span>
        </div>
      </header>

      <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0 60px' }}>
        <div style={{ width: '100%', maxWidth: 1400, display: 'flex', flexDirection: 'column', gap: 32 }}>

          <div>
            <p style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.18em', color: '#2563eb', textTransform: 'uppercase', marginBottom: 8 }}>
              Get Started
            </p>
            <h1 style={{ fontSize: 48, fontWeight: 800, color: '#1A1A2E', lineHeight: 1.1, margin: 0 }}>
              Choose your <span style={{ color: '#2563eb' }}>professional</span> path.
            </h1>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 20 }}>
            {roles.map((role) => (
              <div
                key={role.value}
                style={{ height: 380, borderRadius: 24, overflow: 'hidden', position: 'relative', display: 'flex', flexDirection: 'column' }}
              >
                <div style={{
                  position: 'absolute', inset: 0,
                  backgroundImage: `url('${role.image}')`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }} />
               
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to bottom, rgba(0,0,0,0.05) 0%, rgba(0,0,0,0.45) 45%, rgba(0,0,0,0.85) 100%)',
                }} />
                
                <div style={{
                  position: 'relative',
                  zIndex: 10,
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'flex-end',
                  padding: 20,
                  gap: 12,
                }}>
                  <div>
                    <h2 style={{ fontSize: 20, fontWeight: 700, color: 'white', margin: '0 0 8px' }}>
                      {role.label}
                    </h2>
                    <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                      {role.features.map((feature) => (
                        <li key={feature} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: 'rgba(255,255,255,0.9)' }}>
                          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={{ flexShrink: 0 }}>
                            <circle cx="7" cy="7" r="6" stroke="white" strokeWidth="1.5" />
                            <path d="M4.5 7L6.5 9L9.5 5.5" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                          </svg>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </div>
                  <Link
                    href={`/register?role=${role.value}`}
                    style={{
                      height: 44,
                      width: '100%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: 100,
                      background: 'white',
                      fontSize: 14,
                      fontWeight: 600,
                      color: '#1A1A2E',
                      textDecoration: 'none',
                      flexShrink: 0,
                    }}
                  >
                    {role.buttonLabel}
                  </Link>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </div>
  );
}