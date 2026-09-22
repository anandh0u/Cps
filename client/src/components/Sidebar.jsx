import React from 'react';
import { 
  GraduationCap, 
  Briefcase, 
  Lightbulb, 
  Bell, 
  PhoneCall, 
  AlertCircle, 
  HeartHandshake, 
  Building2,
  MapPin
} from 'lucide-react';

export default function Sidebar({ currentRoute, setCurrentRoute }) {
  // Student Portal Navigation Items
  const navItems = [
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'announcements', label: 'Announcements', icon: Bell },
    { id: 'emergency', label: 'Emergency Contacts', icon: PhoneCall },
    { id: 'issues', label: 'Report an Issue', icon: AlertCircle },
    { id: 'support', label: 'Student Support', icon: HeartHandshake },
    { id: 'map', label: 'GEC Campus Map', icon: MapPin },
  ];

  return (
    <aside className="sidebar">
      {/* CPS Welfare Branding at top of sidebar */}
      <div className="sidebar-brand" onClick={() => setCurrentRoute('scholarships')} style={{ cursor: 'pointer' }}>
        <div className="brand-icon-box" style={{ background: '#0f172a', padding: '2px', overflow: 'hidden' }}>
          <img src="/cps-gect-emblem.png" alt="CPS GECT" style={{ width: '100%', height: '100%', objectFit: 'contain' }} />
        </div>
        <div className="brand-info">
          <h2>CPS Welfare</h2>
          <p>GEC Thrissur</p>
        </div>
      </div>

      {/* Navigation List in exact user order */}
      <nav className="sidebar-nav">
        <ul>
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentRoute === item.id;
            return (
              <li key={item.id}>
                <button
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                  onClick={() => setCurrentRoute(item.id)}
                >
                  <Icon size={17} color={isActive ? '#1e293b' : '#64748b'} />
                  <span>{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Direct Helpdesk Footer in Sidebar */}
      <div className="sidebar-footer">
        <div className="sidebar-help-card">
          <strong>Campus Helpline</strong>
          <p>Ext: 4104 / 4102</p>
          <a href="tel:1056" className="quick-call-link">Emergency 1056</a>
        </div>
      </div>
    </aside>
  );
}
