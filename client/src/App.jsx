import React, { useState, useEffect } from 'react';
import TopHeader from './components/TopHeader';
import Sidebar from './components/Sidebar';
import ReportIssue from './pages/ReportIssue';
import Suggestions from './pages/Suggestions';
import Scholarships from './pages/Scholarships';
import StudentSupport from './pages/StudentSupport';
import EmergencyContacts from './pages/EmergencyContacts';
import Announcements from './pages/Announcements';
import CampusMap from './pages/CampusMap';
import Events from './pages/Events';
import CommitteeAdmin from './pages/CommitteeAdmin';
import { RefreshCw, Building2 } from 'lucide-react';

const getRouteFromUrl = () => {
  const path = window.location.pathname.replace(/^\/+/, '').split('/')[0].toLowerCase();
  if (path === 'admin') return 'admin';
  const validStudentRoutes = ['map', 'events', 'scholarships', 'suggestions', 'support', 'announcements', 'emergency', 'issues'];
  if (validStudentRoutes.includes(path)) return path;
  return 'map'; // GEC Campus Map is top landing page
};

export default function App() {
  const [currentRoute, setCurrentRoute] = useState(getRouteFromUrl);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(() => {
    try {
      return sessionStorage.getItem('cps_admin_session') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [data, setData] = useState({
    department: null,
    events: [],
    issues: [],
    suggestions: [],
    scholarships: [],
    support: { counsellors: [], helplines: [] },
    emergency: [],
    announcements: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAllData = async () => {
    try {
      setLoading(true);
      const [
        eventsRes,
        issuesRes,
        sugRes,
        schRes,
        supRes,
        emgRes,
        annRes,
        deptRes
      ] = await Promise.all([
        fetch('/api/events').then(r => r.json()).catch(() => ({ data: [] })),
        fetch('/api/issues').then(r => r.json()),
        fetch('/api/suggestions').then(r => r.json()),
        fetch('/api/scholarships').then(r => r.json()),
        fetch('/api/support').then(r => r.json()),
        fetch('/api/emergency').then(r => r.json()),
        fetch('/api/announcements').then(r => r.json()),
        fetch('/api/department').then(r => r.json())
      ]);

      setData({
        department: deptRes.data || {},
        events: eventsRes.data || [],
        issues: issuesRes.data || [],
        suggestions: sugRes.data || [],
        scholarships: schRes.data || [],
        support: supRes.data || { counsellors: [], helplines: [] },
        emergency: emgRes.data || [],
        announcements: annRes.data || []
      });
      setError(null);
    } catch (err) {
      console.error('Data Fetch Error:', err);
      setError('Could not connect to the Student Welfare API server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllData();

    const handlePopState = () => {
      setCurrentRoute(getRouteFromUrl());
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigate = (route) => {
    setCurrentRoute(route);
    const targetPath = route === 'admin' ? '/admin' : route === 'map' ? '/' : `/${route}`;
    if (window.location.pathname !== targetPath) {
      window.history.pushState({ route }, '', targetPath);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Dedicated /admin Route (Committee Resolution Portal)
  if (currentRoute === 'admin') {
    return (
      <div className="admin-shell">
        {/* Top Institutional Header with 3 Logos */}
        <TopHeader />

        <header className="admin-topbar">
          <div className="admin-brand">
            <div className="crest-box" style={{ width: '38px', height: '38px' }}>
              <img src="/cps-gect-emblem.png" alt="CPS" className="crest-img" />
            </div>
            <div>
              <strong style={{ fontSize: '1.05rem', color: 'var(--navy-dark)', display: 'block' }}>
                CPS Welfare Committee &bull; Resolution Desk
              </strong>
              <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                Government Engineering College Thrissur &bull; Restricted Officer Portal (/admin)
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <button 
              className="btn btn-secondary"
              onClick={() => navigate('map')}
              style={{ fontSize: '0.82rem' }}
            >
              <span>&larr; Return to Student Portal</span>
            </button>
          </div>
        </header>

        <div className="admin-content">
          <CommitteeAdmin 
            issues={data.issues} 
            suggestions={data.suggestions} 
            announcements={data.announcements} 
            events={data.events}
            onRefresh={fetchAllData} 
            isAdminLoggedIn={isAdminLoggedIn} 
            setIsAdminLoggedIn={setIsAdminLoggedIn} 
            onNavigateToStudentPortal={() => navigate('map')}
          />
        </div>

        <footer style={{ borderTop: '1px solid var(--border-light)', padding: '16px 28px', textAlign: 'center', fontSize: '0.78rem', color: 'var(--text-dim)', background: '#ffffff' }}>
          Department of Cyber Physical System Engineering &bull; Internal Committee Resolution Portal
        </footer>
      </div>
    );
  }

  // Student Portal Layout (with 3 Logos at Top & Left Sidebar)
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* 3 Official Logos Top Institutional Header */}
      <TopHeader />

      <div className="app-layout" style={{ flex: 1 }}>
        <Sidebar 
          currentRoute={currentRoute} 
          setCurrentRoute={navigate} 
        />

        <div className="main-content">
          <main className="content-body">
            {loading && !data.department?.name ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div style={{ display: 'inline-flex', padding: '14px', background: 'var(--navy-subtle)', borderRadius: '50%', color: 'var(--navy-primary)', marginBottom: '14px' }}>
                  <Building2 size={32} />
                </div>
                <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                  Loading Student Welfare Portal...
                </h3>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                  Connecting to campus helpdesk and retrieving active welfare registries.
                </p>
              </div>
            ) : error ? (
              <div style={{ padding: '60px 0', textAlign: 'center' }}>
                <div className="card" style={{ maxWidth: '480px', margin: '0 auto', padding: '28px' }}>
                  <h3 style={{ color: 'var(--red-crimson)', marginBottom: '8px' }}>Service Unavailable</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                    {error}
                  </p>
                  <button className="btn btn-primary" onClick={fetchAllData}>
                    <RefreshCw size={15} />
                    <span>Retry Connection</span>
                  </button>
                </div>
              </div>
            ) : (
              <>
                {currentRoute === 'events' && (
                  <Events events={data.events} onRefresh={fetchAllData} />
                )}
                {currentRoute === 'scholarships' && (
                  <Scholarships scholarships={data.scholarships} />
                )}
                {currentRoute === 'suggestions' && (
                  <Suggestions suggestions={data.suggestions} onRefresh={fetchAllData} />
                )}
                {currentRoute === 'announcements' && (
                  <Announcements announcements={data.announcements} />
                )}
                {currentRoute === 'emergency' && (
                  <EmergencyContacts emergency={data.emergency} />
                )}
                {currentRoute === 'issues' && (
                  <ReportIssue issues={data.issues} onRefresh={fetchAllData} setCurrentRoute={navigate} />
                )}
                {currentRoute === 'support' && (
                  <StudentSupport support={data.support} />
                )}
                {currentRoute === 'map' && (
                  <CampusMap />
                )}
              </>
            )}
          </main>

          {/* Institutional Clean Footer */}
          <footer className="site-footer">
            <div className="footer-row">
              <div>
                <strong style={{ color: 'var(--navy-dark)', display: 'block', fontSize: '0.88rem' }}>
                  Department of Cyber Physical System Engineering &bull; Student Welfare Cell
                </strong>
                <span>Government Engineering College Thrissur &bull; Ramavarmapuram, Kerala 680009</span>
              </div>

              <div style={{ textAlign: 'right', fontSize: '0.78rem' }}>
                <span>Campus Security: +91 487 2334144 &bull; Student Welfare Helpline: 1056 / 14416</span>
                <p style={{ marginTop: '2px', color: 'var(--text-dim)' }}>
                  Student Welfare &amp; Grievance Resolution Portal &bull; Academic Year 2025–2026 &bull; <a href="/admin" onClick={(e) => { e.preventDefault(); navigate('admin'); }} style={{ color: 'var(--text-dim)', textDecoration: 'underline' }}>Committee Desk</a>
                </p>
              </div>
            </div>
          </footer>
        </div>
      </div>
    </div>
  );
}
