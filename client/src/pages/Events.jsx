import React, { useState } from 'react';
import { 
  CalendarDays, 
  MapPin, 
  Clock, 
  User, 
  Users, 
  CheckCircle2, 
  Search, 
  PlusCircle, 
  Ticket,
  ArrowRight
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Events({ events = [], onRefresh }) {
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

  const filteredEvents = events.filter(event => {
    const matchesStatus = filterStatus === 'All' || 
      (filterStatus === 'Ongoing' && event.status.toLowerCase().includes('ongoing')) ||
      (filterStatus === 'Upcoming' && event.status.toLowerCase() === 'upcoming') ||
      (filterStatus === 'Past' && event.status.toLowerCase() === 'past');

    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      event.title.toLowerCase().includes(q) ||
      event.speaker.toLowerCase().includes(q) ||
      event.venue.toLowerCase().includes(q) ||
      event.category.toLowerCase().includes(q);

    return matchesStatus && matchesSearch;
  });

  const handleRegister = async (e) => {
    e.preventDefault();
    setRegError('');
    if (!regName || !regEmail) {
      setRegError('Please provide both your name and email.');
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
        setRegError(data.error || 'Failed to register.');
      }
    } catch (err) {
      setRegError('Network error connecting to registration server.');
    } finally {
      setSubmittingReg(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '50px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-kicker">
            <CalendarDays size={14} />
            <span>Academic & Technical Symposia</span>
          </div>
          <h1 className="page-title">Department Events Hub</h1>
          <p className="page-subtitle">
            Stay updated with ongoing keynote sessions, upcoming embedded systems workshops, robotics hackathons, and research talks.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {['All', 'Ongoing', 'Upcoming', 'Past'].map(status => (
            <button
              key={status}
              className={`filter-tab-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status === 'All' ? 'All Events' : status === 'Ongoing' ? "Ongoing Today" : status === 'Upcoming' ? 'Upcoming Sessions' : 'Past Archive'}
            </button>
          ))}
        </div>

        <div className="search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search event, speaker, venue..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Events List */}
      <div className="grid-2" style={{ gap: '24px' }}>
        {filteredEvents.map(event => {
          const isOngoing = event.status.toLowerCase().includes('ongoing');
          const isPast = event.status.toLowerCase() === 'past';
          const fillPercentage = Math.round((event.registeredCount / event.capacity) * 100);

          return (
            <div 
              key={event.id} 
              className="card" 
              style={{ 
                display: 'flex', 
                flexDirection: 'column', 
                justifyContent: 'space-between',
                borderLeft: `4px solid ${isOngoing ? '#059669' : isPast ? '#94a3b8' : '#0284c7'}`
              }}
            >
              <div>
                {/* Top status */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className={`badge ${isOngoing ? 'badge-green' : isPast ? 'badge-slate' : 'badge-blue'}`}>
                      {event.status}
                    </span>
                    <span className="badge badge-slate">
                      {event.category}
                    </span>
                  </div>

                  <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {event.date}
                  </span>
                </div>

                <h3 style={{ fontSize: '1.2rem', color: 'var(--blue-navy)', marginBottom: '8px' }}>
                  {event.title}
                </h3>

                {/* Logistics */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <Clock size={14} color="#0284c7" />
                    <strong>{event.time}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <MapPin size={14} color="#059669" />
                    <span>{event.venue}</span>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={14} color="var(--blue-navy)" />
                    <span>Speaker: <strong>{event.speaker}</strong></span>
                  </span>
                </div>

                <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
                  {event.description}
                </p>

                {/* Capacity Progress Bar */}
                {!isPast && (
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                      <span>Registrations</span>
                      <span className="font-mono"><strong>{event.registeredCount}</strong> / {event.capacity} seats ({fillPercentage}%)</span>
                    </div>
                    <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '3px', overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${fillPercentage}%`, background: isOngoing ? '#059669' : '#0284c7', borderRadius: '3px' }} />
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
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
                    <span>Register / Get Pass</span>
                  </button>
                ) : (
                  <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    {isPast ? 'Session Concluded' : 'Registration Closed'}
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Registration Modal */}
      {registeringEvent && (
        <Modal
          isOpen={true}
          onClose={() => setRegisteringEvent(null)}
          title={passData ? 'Registration Confirmed!' : `Register for: ${registeringEvent.title}`}
          subtitle={passData ? 'Your digital entry pass has been generated.' : `${registeringEvent.venue} • ${registeringEvent.date}`}
        >
          {passData ? (
            <div style={{ textAlign: 'center', padding: '10px 0' }}>
              <div style={{ display: 'inline-flex', padding: '12px', background: '#ecfdf5', borderRadius: '50%', color: '#059669', marginBottom: '12px' }}>
                <CheckCircle2 size={36} />
              </div>
              <h4 style={{ fontSize: '1.2rem', color: 'var(--blue-navy)', marginBottom: '4px' }}>
                You are registered, {passData.name}!
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                Please present this pass code at the entrance of {passData.venue}.
              </p>

              <div style={{ 
                background: '#f8fafc', 
                border: '2px dashed #0284c7', 
                borderRadius: '8px', 
                padding: '16px', 
                display: 'inline-block',
                marginBottom: '16px' 
              }}>
                <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, display: 'block' }}>
                  Entry Pass ID
                </span>
                <span className="font-mono" style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--blue-navy)' }}>
                  {passData.registrationPass}
                </span>
              </div>

              <div>
                <button 
                  className="btn btn-primary"
                  onClick={() => setRegisteringEvent(null)}
                >
                  Done
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleRegister}>
              {regError && (
                <div style={{ background: '#fef2f2', color: '#991b1b', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px' }}>
                  {regError}
                </div>
              )}

              <div className="form-group">
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

              <div className="form-group">
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

              <div className="form-group">
                <label className="form-label">Current Academic Semester</label>
                <select
                  className="form-select"
                  value={regYear}
                  onChange={(e) => setRegYear(e.target.value)}
                >
                  <option value="S2 CPS">S2 CPS</option>
                  <option value="S4 CPS">S4 CPS</option>
                  <option value="S6 CPS">S6 CPS</option>
                  <option value="S8 CPS">S8 CPS</option>
                  <option value="Other Department / Faculty">Other Department / Faculty</option>
                </select>
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
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
