import React, { useState } from 'react';
import { 
  Users, 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Search, 
  Award, 
  BookOpen,
  Cpu,
  Layers
} from 'lucide-react';

export default function Faculty({ faculty = [] }) {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredFaculty = faculty.filter(f => {
    const q = searchTerm.toLowerCase();
    return !searchTerm ||
      f.name.toLowerCase().includes(q) ||
      f.designation.toLowerCase().includes(q) ||
      f.specialization.toLowerCase().includes(q) ||
      f.labInCharge.toLowerCase().includes(q);
  });

  return (
    <div className="container" style={{ paddingBottom: '50px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-kicker">
            <Users size={14} />
            <span>Academic & Technical Mentorship</span>
          </div>
          <h1 className="page-title">Faculty & Lab In-Charge Directory</h1>
          <p className="page-subtitle">
            Mentors, research advisors, and laboratory superintendents driving Cyber-Physical Systems engineering at GEC Thrissur.
          </p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="filter-bar">
        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-dim)' }}>
          Showing {filteredFaculty.length} Academic & Technical Personnel
        </div>

        <div className="search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search faculty name, specialization, lab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Faculty Cards */}
      <div className="grid-2" style={{ gap: '24px' }}>
        {filteredFaculty.map(member => (
          <div key={member.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              {/* Card Top */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--blue-navy)', marginBottom: '2px' }}>
                    {member.name}
                  </h3>
                  <p style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--blue-primary)' }}>
                    {member.designation}
                  </p>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                    {member.qualification}
                  </p>
                </div>

                <div style={{ 
                  width: '44px', 
                  height: '44px', 
                  borderRadius: '8px', 
                  background: 'var(--blue-light)', 
                  color: 'var(--blue-dark)', 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'center',
                  fontWeight: 700,
                  fontSize: '1rem',
                  border: '1px solid var(--blue-border)'
                }}>
                  {member.name.split(' ').slice(1, 3).map(p => p[0]).join('') || 'CPS'}
                </div>
              </div>

              {/* Lab in charge role */}
              <div style={{ 
                background: '#f8fafc', 
                border: '1px solid #e2e8f0', 
                borderRadius: '6px', 
                padding: '8px 12px', 
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '0.82rem'
              }}>
                <Cpu size={15} color="#059669" />
                <span style={{ color: 'var(--text-muted)' }}>Lab In-Charge:</span>
                <strong style={{ color: 'var(--blue-navy)' }}>{member.labInCharge}</strong>
              </div>

              {/* Specialization */}
              <div style={{ marginBottom: '14px' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', display: 'block', marginBottom: '4px' }}>
                  Hardware / Software Domain:
                </span>
                <p style={{ fontSize: '0.86rem', color: 'var(--text-main)', lineHeight: '1.45' }}>
                  {member.specialization}
                </p>
              </div>

              {/* Contact Information */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <MapPin size={14} color="var(--blue-primary)" />
                  <span>Cabin: <strong>{member.cabin}</strong></span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Mail size={14} color="var(--blue-primary)" />
                  <a href={`mailto:${member.email}`} style={{ color: 'var(--blue-dark)', textDecoration: 'none' }}>
                    {member.email}
                  </a>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Phone size={14} color="var(--blue-primary)" />
                  <span className="font-mono">{member.phone}</span>
                </div>
              </div>
            </div>

            {/* Office hours footer */}
            <div style={{ 
              marginTop: '16px', 
              paddingTop: '10px', 
              borderTop: '1px solid #e2e8f0', 
              fontSize: '0.78rem', 
              color: 'var(--text-dim)', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px' 
            }}>
              <Clock size={13} color="#059669" />
              <span>Office Hours: <strong>{member.officeHours}</strong></span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
