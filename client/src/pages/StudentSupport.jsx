import React from 'react';
import { 
  HeartHandshake, 
  Phone, 
  Mail, 
  MapPin, 
  Clock, 
  ShieldCheck, 
  Users, 
  LifeBuoy
} from 'lucide-react';

export default function StudentSupport({ support = { counsellors: [], helplines: [] } }) {
  const counsellors = support.counsellors || [];
  const helplines = support.helplines || [];

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Student Support & Counselling Desk</h1>
          <p>Confidential psychological counselling, academic mentorship, and crisis helplines for GEC Thrissur students.</p>
        </div>
      </div>

      {/* Confidentiality Notice */}
      <div style={{ background: '#ffffff', border: '1px solid var(--border-light)', borderRadius: 'var(--radius-md)', padding: '16px 20px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '12px' }}>
        <ShieldCheck size={26} color="var(--green-forest)" style={{ flexShrink: 0 }} />
        <div>
          <strong style={{ color: 'var(--navy-dark)', display: 'block', fontSize: '0.92rem' }}>
            100% Confidential Support
          </strong>
          <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
            All consultations with campus counsellors and staff advisors are strictly private and protected under institutional student privacy charters.
          </p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '24px', marginBottom: '32px' }}>
        {/* Campus Counsellors & Mentors */}
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Users size={18} color="var(--navy-primary)" />
            <span>On-Campus Counsellors & Welfare Mentors</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {counsellors.map((c, idx) => (
              <div key={idx} className="card" style={{ padding: '18px' }}>
                <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-dark)', marginBottom: '2px' }}>
                  {c.name}
                </h3>
                <p style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--navy-primary)', marginBottom: '10px' }}>
                  {c.role}
                </p>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <MapPin size={14} color="var(--navy-primary)" />
                    <span>{c.office}</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Phone size={14} color="var(--navy-primary)" />
                    <a href={`tel:${c.phone}`} style={{ color: 'var(--navy-dark)', textDecoration: 'none', fontWeight: 600 }}>
                      {c.phone}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Mail size={14} color="var(--navy-primary)" />
                    <a href={`mailto:${c.email}`} style={{ color: 'var(--navy-primary)', textDecoration: 'none' }}>
                      {c.email}
                    </a>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Clock size={14} color="var(--green-forest)" />
                    <span>{c.timings}</span>
                  </div>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', borderTop: '1px solid var(--border-light)', paddingTop: '8px' }}>
                  {c.note}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* 24x7 Helplines & National Support */}
        <div>
          <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)', marginBottom: '16px', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <LifeBuoy size={18} color="var(--navy-primary)" />
            <span>24/7 Verified Helplines</span>
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            {helplines.map((h, idx) => (
              <div key={idx} className="card" style={{ padding: '18px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                  <h3 style={{ fontSize: '1rem', color: 'var(--navy-dark)' }}>
                    {h.service}
                  </h3>
                  <span className="tag tag-green">
                    {h.availability.split(' ')[0]} Active
                  </span>
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '10px 14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)', margin: '10px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span className="font-mono" style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                    {h.number}
                  </span>
                  <a href={`tel:${h.number.split('/')[0].trim()}`} className="btn btn-secondary" style={{ fontSize: '0.78rem', padding: '4px 10px' }}>
                    <Phone size={12} />
                    <span>Call Now</span>
                  </a>
                </div>

                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                  {h.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
