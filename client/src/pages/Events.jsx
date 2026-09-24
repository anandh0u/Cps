import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  User, 
  Users, 
  CheckCircle2, 
  Search, 
  Ticket,
  ArrowRight,
  ExternalLink,
  Trophy,
  Sparkles,
  Zap,
  Building,
  Check,
  Award,
  Filter
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Events({ events = [], onRefresh }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [filterStatus, setFilterStatus] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [registeringEvent, setRegisteringEvent] = useState(null);
  const [passData, setPassData] = useState(null);

  // Registration Form state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regYear, setRegYear] = useState('S6 CPS');
  const [submittingReg, setSubmittingReg] = useState(false);
  const [regError, setRegError] = useState('');

  // Flagship event (e.g. HackCPS or highest prize hackathon)
  const featuredHackathon = events.find(e => 
    e.category.toLowerCase().includes('hackathon') || 
    (e.prizePool && e.status.toLowerCase() !== 'past')
  );

  const filteredEvents = events.filter(event => {
    // Status filter
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Ongoing' && event.status.toLowerCase().includes('ongoing')) ||
      (filterStatus === 'Upcoming' && event.status.toLowerCase() === 'upcoming') ||
      (filterStatus === 'Past' && event.status.toLowerCase() === 'past');

    // Category filter
    const matchesCategory = filterCategory === 'All' || 
      (filterCategory === 'Hackathons' && (event.category.toLowerCase().includes('hack') || event.category.toLowerCase().includes('ctf'))) ||
      (filterCategory === 'Workshops' && event.category.toLowerCase().includes('workshop')) ||
      (filterCategory === 'Symposium' && (event.category.toLowerCase().includes('symposium') || event.category.toLowerCase().includes('expo'))) ||
      (filterCategory === 'Talks' && event.category.toLowerCase().includes('talk'));

    // Search query
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      (event.title && event.title.toLowerCase().includes(q)) ||
      (event.speaker && event.speaker.toLowerCase().includes(q)) ||
      (event.venue && event.venue.toLowerCase().includes(q)) ||
      (event.organizer && event.organizer.toLowerCase().includes(q)) ||
      (event.category && event.category.toLowerCase().includes(q)) ||
      (event.description && event.description.toLowerCase().includes(q));

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    if (!regName || !regEmail) {
      setRegError('Please provide both your name and email address.');
      return;
    }

    setSubmittingReg(true);
    try {
      const res = await fetch(`/api/events/${registeringEvent.id}/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: regName, email: regEmail, year: regYear })
      });
      const data = await res.json();
      if (data.success) {
        setPassData(data.data);
        if (onRefresh) onRefresh();
      } else {
        setRegError(data.error || 'Failed to complete registration.');
      }
    } catch (err) {
      setRegError('Network error connecting to registration server.');
    } finally {
      setSubmittingReg(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '60px' }}>
      {/* Header */}
      <div className="page-header" style={{ marginBottom: '24px' }}>
        <div>
          <div className="page-kicker">
            <CalendarDays size={14} />
            <span>Campus Symposia, Hackathons &amp; Technical Competitions</span>
          </div>
          <h1 className="page-title">College Events &amp; Hackathons Hub</h1>
          <p className="page-subtitle">
            Explore national IoT hackathons, robotics workshops, cybersecurity CTFs, and tech symposiums conducting at GEC Thrissur. Register directly or access official portals.
          </p>
        </div>
      </div>

      {/* Featured Hackathon Spotlight Banner */}
      {featuredHackathon && (
        <div 
          className="card" 
          style={{ 
            background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 60%, #1e1b4b 100%)', 
            color: '#ffffff',
            padding: '28px 32px',
            marginBottom: '32px',
            position: 'relative',
            overflow: 'hidden',
            boxShadow: '0 8px 30px rgba(15, 23, 42, 0.25)',
            border: '1px solid rgba(255, 255, 255, 0.1)'
          }}
        >
          {/* Subtle background glow */}
          <div style={{
            position: 'absolute',
            top: '-50px',
            right: '-50px',
            width: '240px',
            height: '240px',
            background: 'radial-gradient(circle, rgba(202, 138, 4, 0.25) 0%, transparent 70%)',
            pointerEvents: 'none'
          }} />

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '20px', position: 'relative', zIndex: 2 }}>
            <div style={{ flex: '1 1 500px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '12px' }}>
                <span style={{ 
                  background: 'rgba(234, 179, 8, 0.2)', 
                  border: '1px solid rgba(234, 179, 8, 0.5)', 
                  color: '#facc15', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.05em', 
                  padding: '4px 10px', 
                  borderRadius: '20px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '5px'
                }}>
                  <Sparkles size={13} />
                  Featured College Event
                </span>

                <span style={{ 
                  background: 'rgba(16, 185, 129, 0.2)', 
                  color: '#34d399', 
                  fontSize: '0.74rem', 
                  fontWeight: 700, 
                  padding: '4px 10px', 
                  borderRadius: '20px' 
                }}>
                  {featuredHackathon.status}
                </span>

                {featuredHackathon.prizePool && (
                  <span style={{ 
                    background: 'rgba(245, 158, 11, 0.25)', 
                    color: '#fbbf24', 
                    fontSize: '0.74rem', 
                    fontWeight: 700, 
                    padding: '4px 10px', 
                    borderRadius: '20px',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px'
                  }}>
                    <Trophy size={13} />
                    {featuredHackathon.prizePool}
                  </span>
                )}
              </div>

              <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '10px', lineHeight: 1.25 }}>
                {featuredHackathon.title}
              </h2>

              <p style={{ fontSize: '0.88rem', color: '#cbd5e1', marginBottom: '18px', lineHeight: 1.5, maxWidth: '720px' }}>
                {featuredHackathon.description}
              </p>

              {/* Key metadata pills */}
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', fontSize: '0.82rem', color: '#94a3b8', marginBottom: '20px' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CalendarDays size={15} color="#38bdf8" />
                  <strong style={{ color: '#f8fafc' }}>{featuredHackathon.date}</strong>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Clock size={15} color="#38bdf8" />
                  <span>{featuredHackathon.time}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <MapPin size={15} color="#4ade80" />
                  <span>{featuredHackathon.venue}</span>
                </span>
                <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Building size={15} color="#facc15" />
                  <span>{featuredHackathon.organizer}</span>
                </span>
              </div>

              {/* Action buttons */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flexWrap: 'wrap' }}>
                {featuredHackathon.registrationOpen ? (
                  <button 
                    className="btn btn-primary"
                    style={{ 
                      background: '#0284c7', 
                      borderColor: '#0284c7', 
                      padding: '9px 18px', 
                      fontSize: '0.88rem',
                      fontWeight: 600,
                      boxShadow: '0 4px 12px rgba(2, 132, 199, 0.4)'
                    }}
                    onClick={() => {
                      setPassData(null);
                      setRegisteringEvent(featuredHackathon);
                    }}
                  >
                    <Ticket size={16} />
                    <span>Register Now &bull; Get Pass</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.85rem', color: '#94a3b8', fontWeight: 600 }}>
                    Registration Closed
                  </span>
                )}

                {featuredHackathon.registrationLink && (
                  <a
                    href={featuredHackathon.registrationLink}
                    target="_blank"
                    rel="noreferrer"
                    className="btn btn-secondary"
                    style={{ 
                      background: 'rgba(255, 255, 255, 0.1)', 
                      borderColor: 'rgba(255, 255, 255, 0.25)', 
                      color: '#ffffff',
                      padding: '9px 16px',
                      fontSize: '0.88rem'
                    }}
                  >
                    <span>External Portal / Devfolio</span>
                    <ExternalLink size={14} />
                  </a>
                )}
              </div>
            </div>

            {/* Right side stats badge */}
            <div style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              borderRadius: 'var(--radius-md)',
              padding: '18px 22px',
              minWidth: '220px',
              textAlign: 'center'
            }}>
              <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: '#94a3b8', letterSpacing: '0.06em', fontWeight: 700, display: 'block' }}>
                Current Registrations
              </span>
              <div className="font-mono" style={{ fontSize: '2.2rem', fontWeight: 800, color: '#f8fafc', margin: '4px 0' }}>
                {featuredHackathon.registeredCount} <span style={{ fontSize: '1.1rem', color: '#64748b' }}>/ {featuredHackathon.capacity}</span>
              </div>
              <div style={{ height: '6px', background: 'rgba(255,255,255,0.15)', borderRadius: '3px', overflow: 'hidden', margin: '10px 0' }}>
                <div style={{ 
                  height: '100%', 
                  width: `${Math.min(100, Math.round((featuredHackathon.registeredCount / featuredHackathon.capacity) * 100))}%`, 
                  background: '#38bdf8', 
                  borderRadius: '3px' 
                }} />
              </div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 600 }}>
                {Math.round((featuredHackathon.registeredCount / featuredHackathon.capacity) * 100)}% Seats Filled
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar" style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
          {/* Category Tabs */}
          <div className="filter-tabs">
            {[
              { id: 'All', label: 'All Categories' },
              { id: 'Hackathons', label: 'Hackathons & CTF' },
              { id: 'Workshops', label: 'Workshops & Labs' },
              { id: 'Symposium', label: 'Symposia & Expos' },
              { id: 'Talks', label: 'Tech Talks' }
            ].map(cat => (
              <button
                key={cat.id}
                className={`filter-tab-btn ${filterCategory === cat.id ? 'active' : ''}`}
                onClick={() => setFilterCategory(cat.id)}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="search-input-box" style={{ maxWidth: '320px', width: '100%' }}>
            <Search size={16} />
            <input
              type="text"
              placeholder="Search event, venue, hackathon..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Status Sub-Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
          <span style={{ fontWeight: 600, display: 'flex', alignItems: 'center', gap: '4px' }}>
            <Filter size={13} /> Timeline:
          </span>
          {['All', 'Upcoming', 'Ongoing', 'Past'].map(st => (
            <button
              key={st}
              onClick={() => setFilterStatus(st)}
              style={{
                background: filterStatus === st ? 'var(--navy-dark)' : 'transparent',
                color: filterStatus === st ? '#ffffff' : 'var(--text-muted)',
                border: filterStatus === st ? 'none' : '1px solid var(--border-light)',
                borderRadius: '16px',
                padding: '3px 12px',
                fontSize: '0.76rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.15s ease'
              }}
            >
              {st === 'All' ? 'All Timelines' : st === 'Ongoing' ? 'Ongoing Today' : st}
            </button>
          ))}
          <span style={{ marginLeft: 'auto', fontSize: '0.78rem' }}>
            Showing <strong>{filteredEvents.length}</strong> college event{filteredEvents.length === 1 ? '' : 's'}
          </span>
        </div>
      </div>

      {/* Events Grid */}
      {filteredEvents.length === 0 ? (
        <div className="card" style={{ padding: '48px 24px', textAlign: 'center', background: '#ffffff' }}>
          <CalendarDays size={42} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
          <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
            No matching events found
          </h3>
          <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '16px' }}>
            Try adjusting your search query or reset the filters to see all campus activities.
          </p>
          <button 
            className="btn btn-secondary" 
            onClick={() => { setFilterCategory('All'); setFilterStatus('All'); setSearchTerm(''); }}
            style={{ fontSize: '0.82rem' }}
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid-2" style={{ gap: '24px' }}>
          {filteredEvents.map(event => {
            const isOngoing = event.status.toLowerCase().includes('ongoing');
            const isPast = event.status.toLowerCase() === 'past';
            const fillPercentage = Math.min(100, Math.round(((event.registeredCount || 0) / (event.capacity || 100)) * 100));

            return (
              <div 
                key={event.id} 
                className="card" 
                style={{ 
                  display: 'flex', 
                  flexDirection: 'column', 
                  justifyContent: 'space-between',
                  borderTop: `4px solid ${isOngoing ? 'var(--green-emerald)' : isPast ? '#94a3b8' : 'var(--navy-primary)'}`,
                  position: 'relative'
                }}
              >
                <div>
                  {/* Top Status & Category Badges */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <span className={`badge ${isOngoing ? 'badge-green' : isPast ? 'badge-slate' : 'badge-blue'}`}>
                        {isOngoing && <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'currentColor', display: 'inline-block', marginRight: '4px', animation: 'pulse 1.5s infinite' }} />}
                        {event.status}
                      </span>
                      <span className="badge badge-slate">
                        {event.category}
                      </span>
                      {event.prizePool && (
                        <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                          <Trophy size={11} />
                          {event.prizePool}
                        </span>
                      )}
                    </div>

                    <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                      {event.date}
                    </span>
                  </div>

                  {/* Title */}
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)', marginBottom: '10px', lineHeight: 1.3 }}>
                    {event.title}
                  </h3>

                  {/* Logistics List */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px', background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <Clock size={14} color="var(--navy-primary)" />
                      <span>Time: <strong>{event.time}</strong></span>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                      <MapPin size={14} color="var(--green-forest)" />
                      <span>Venue: <strong>{event.venue}</strong></span>
                    </div>
                    {event.organizer && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <Building size={14} color="var(--amber-warm)" />
                        <span>Organized By: <strong>{event.organizer}</strong></span>
                      </div>
                    )}
                    {event.speaker && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '7px' }}>
                        <User size={14} color="var(--navy-dark)" />
                        <span>Speaker / Lead: <strong>{event.speaker}</strong></span>
                      </div>
                    )}
                  </div>

                  {/* Description */}
                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '14px', lineHeight: 1.5 }}>
                    {event.description}
                  </p>

                  {/* Highlights Bullet Points */}
                  {Array.isArray(event.highlights) && event.highlights.length > 0 && (
                    <div style={{ marginBottom: '16px' }}>
                      <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, display: 'block', marginBottom: '6px' }}>
                        Event Highlights
                      </span>
                      <ul style={{ margin: 0, paddingLeft: '18px', fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                        {event.highlights.map((h, i) => (
                          <li key={i}>{h}</li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Capacity Bar */}
                  {!isPast && (
                    <div style={{ marginBottom: '16px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                        <span>Registrations</span>
                        <span className="font-mono">
                          <strong>{event.registeredCount || 0}</strong> / {event.capacity || 100} seats ({fillPercentage}%)
                        </span>
                      </div>
                      <div style={{ height: '6px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                        <div style={{ 
                          height: '100%', 
                          width: `${fillPercentage}%`, 
                          background: isOngoing ? 'var(--green-emerald)' : 'var(--navy-primary)', 
                          borderRadius: '3px' 
                        }} />
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer Action Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '14px', borderTop: '1px solid var(--border-light)', flexWrap: 'wrap', gap: '8px' }}>
                  {event.registrationLink ? (
                    <a
                      href={event.registrationLink}
                      target="_blank"
                      rel="noreferrer"
                      className="btn btn-secondary"
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      <span>Official Portal</span>
                      <ExternalLink size={13} />
                    </a>
                  ) : (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                      GECT CPS Registration
                    </span>
                  )}

                  <div>
                    {event.registrationOpen ? (
                      <button 
                        className="btn btn-primary"
                        style={{ fontSize: '0.82rem', padding: '6px 14px' }}
                        onClick={() => {
                          setPassData(null);
                          setRegisteringEvent(event);
                        }}
                      >
                        <Ticket size={15} />
                        <span>Register &bull; Get Pass</span>
                      </button>
                    ) : (
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        {isPast ? 'Session Concluded' : 'Registration Closed'}
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Registration Modal */}
      {registeringEvent && (
        <Modal
          isOpen={true}
          onClose={() => setRegisteringEvent(null)}
          title={passData ? 'Registration Confirmed!' : `Register for: ${registeringEvent.title}`}
          subtitle={passData ? 'Your digital entry pass has been generated.' : `${registeringEvent.venue} &bull; ${registeringEvent.date}`}
        >
          {passData ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ display: 'inline-flex', padding: '14px', background: 'var(--green-light)', borderRadius: '50%', color: 'var(--green-forest)', marginBottom: '14px' }}>
                <CheckCircle2 size={40} />
              </div>
              <h4 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)', marginBottom: '4px', fontWeight: 800 }}>
                You are registered, {passData.name}!
              </h4>
              <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
                Please present this pass code at the registration desk at <strong>{passData.venue}</strong>.
              </p>

              <div style={{ 
                background: 'var(--bg-subtle)', 
                border: '2px dashed var(--navy-primary)', 
                borderRadius: 'var(--radius-md)', 
                padding: '18px 24px', 
                display: 'inline-block',
                marginBottom: '18px' 
              }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, letterSpacing: '0.05em', display: 'block', marginBottom: '2px' }}>
                  GECT Digital Entry Pass ID
                </span>
                <span className="font-mono" style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--navy-dark)' }}>
                  {passData.registrationPass}
                </span>
                <span style={{ display: 'block', fontSize: '0.74rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  {passData.date} &bull; {passData.time}
                </span>
              </div>

              <div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setRegisteringEvent(null)}
                  style={{ minWidth: '120px' }}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              {regError && (
                <div style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', color: 'var(--red-crimson)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '14px' }}>
                  {regError}
                </div>
              )}

              <div className="form-row">
                <label className="form-label">Full Name *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Anand K."
                  value={regName}
                  onChange={(e) => setRegName(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label">Student Email *</label>
                <input
                  type="email"
                  className="form-input"
                  placeholder="student@gect.ac.in"
                  value={regEmail}
                  onChange={(e) => setRegEmail(e.target.value)}
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label">Branch &amp; Semester</label>
                <select
                  className="form-select"
                  value={regYear}
                  onChange={(e) => setRegYear(e.target.value)}
                >
                  <option value="S2 CPS">S2 Cyber Physical Systems</option>
                  <option value="S4 CPS">S4 Cyber Physical Systems</option>
                  <option value="S6 CPS">S6 Cyber Physical Systems</option>
                  <option value="S8 CPS">S8 Cyber Physical Systems</option>
                  <option value="Computer Science & Engg">Computer Science &amp; Engg</option>
                  <option value="Electronics & Comm Engg">Electronics &amp; Comm Engg</option>
                  <option value="Electrical & Electronics Engg">Electrical &amp; Electronics Engg</option>
                  <option value="Mechanical / Civil / Chem">Other GECT Engineering Dept</option>
                  <option value="Other College Student">Other KTU / National Engineering College</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setRegisteringEvent(null)}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={submittingReg}
                >
                  <Ticket size={15} />
                  <span>{submittingReg ? 'Generating Pass...' : 'Confirm Registration'}</span>
                </button>
              </div>
            </form>
          )}
        </Modal>
      )}
    </div>
  );
}
