import React from 'react';
import { 
  AlertCircle, 
  Lightbulb, 
  GraduationCap, 
  Briefcase, 
  HeartHandshake, 
  PhoneCall, 
  Bell, 
  ShieldCheck,
  Building2
} from 'lucide-react';

export default function Navbar({ currentRoute, setCurrentRoute, isAdminLoggedIn }) {
  const navItems = [
    { id: 'issues', label: 'Report an Issue', icon: AlertCircle },
    { id: 'suggestions', label: 'Suggestions', icon: Lightbulb },
    { id: 'scholarships', label: 'Scholarships', icon: GraduationCap },
    { id: 'opportunities', label: 'Opportunities', icon: Briefcase },
    { id: 'support', label: 'Student Support', icon: HeartHandshake },
    { id: 'emergency', label: 'Emergency Contacts', icon: PhoneCall },
    { id: 'announcements', label: 'Announcements', icon: Bell },
  ];

  return (
    <header className="site-header">
      <div className="container header-inner">
        {/* Institutional Branding */}
        <div 
          className="institution-brand" 
          onClick={() => setCurrentRoute('issues')}
        >
          <div className="brand-emblem">
            <Building2 size={24} />
          </div>
          <div className="brand-titles">
            <h1>CPS Student Welfare Portal</h1>
            <p>Govt. Engineering College Thrissur &bull; Grievance & Student Support</p>
          </div>
        </div>

        {/* Primary Navigation Toolbar */}
        <nav>
          <ul className="nav-toolbar">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentRoute === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link-btn ${isActive ? 'active' : ''}`}
                    onClick={() => setCurrentRoute(item.id)}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}

            {/* Committee / Admin Dashboard link */}
            <li>
              <button
                className={`nav-link-btn admin-link ${currentRoute === 'admin' ? 'active' : ''}`}
                onClick={() => setCurrentRoute('admin')}
                title="Committee Issue Resolution Dashboard"
              >
                <ShieldCheck size={15} color={isAdminLoggedIn ? '#15803d' : '#475569'} />
                <span>{isAdminLoggedIn ? 'Committee Active' : 'Committee Login'}</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
