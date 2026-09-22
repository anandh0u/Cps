import React from 'react';
import { 
  PhoneCall, 
  ShieldAlert, 
  MapPin, 
  Clock, 
  Ambulance, 
  Shield, 
  Phone
} from 'lucide-react';

export default function EmergencyContacts({ emergency = [] }) {
  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Campus & Emergency Contacts</h1>
          <p>Immediate phone directory for campus security, medical emergencies, ambulance, and women helpline.</p>
        </div>
      </div>

      {/* Emergency Grid */}
      <div className="grid-2" style={{ gap: '20px' }}>
        {emergency.map((item, idx) => (
          <div 
            key={idx} 
            className="card" 
            style={{ 
              borderLeft: '4px solid var(--red-crimson)', 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between' 
            }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                <span className="tag tag-red">
                  {item.availability}
                </span>
                <span className="font-mono" style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                  Speed Dial: <strong>{item.contact}</strong>
                </span>
              </div>

              <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '8px' }}>
                {item.service}
              </h3>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                <MapPin size={14} color="var(--red-crimson)" />
                <span>{item.location}</span>
              </div>

              {/* Direct Phone Banner */}
              <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <span style={{ fontSize: '0.72rem', color: 'var(--text-dim)', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                    Direct Hotline
                  </span>
                  <span className="font-mono" style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                    {item.phone}
                  </span>
                </div>

                <a 
                  href={`tel:${item.phone.split('(')[0].trim()}`} 
                  className="btn btn-danger"
                  style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                >
                  <PhoneCall size={14} />
                  <span>Call Emergency</span>
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
