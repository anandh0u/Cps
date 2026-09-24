import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Wrench, 
  Send, 
  MessageSquare, 
  LogOut, 
  PlusCircle, 
  Tag, 
  UserCheck,
  ChevronRight,
  CalendarDays,
  Edit3,
  Trash2,
  Trophy,
  ExternalLink,
  Users,
  Search,
  Check,
  Sparkles,
  RefreshCw,
  Bell
} from 'lucide-react';
import Modal from '../components/Modal';

export default function CommitteeAdmin({ 
  issues = [], 
  suggestions = [], 
  announcements = [], 
  events = [],
  onRefresh, 
  isAdminLoggedIn, 
  setIsAdminLoggedIn,
  onNavigateToStudentPortal
}) {
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');
  const [adminTab, setAdminTab] = useState('events'); // 'events' | 'issues' | 'suggestions' | 'announcements'

  // Selected Issue for Resolution Workbench
  const [selectedIssue, setSelectedIssue] = useState(issues[0] || null);
  const [updateStatus, setUpdateStatus] = useState('');
  const [updateNote, setUpdateNote] = useState('');
  const [updateActor, setUpdateActor] = useState('Student Welfare Officer');
  const [updateAssigned, setUpdateAssigned] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [actionSuccessMsg, setActionSuccessMsg] = useState('');

  // Suggestion review state
  const [selectedSuggestion, setSelectedSuggestion] = useState(null);
  const [sugStatus, setSugStatus] = useState('');
  const [sugResponse, setSugResponse] = useState('');
  const [isUpdatingSug, setIsUpdatingSug] = useState(false);

  // New Announcement state
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnCategory, setNewAnnCategory] = useState('Academic Welfare');
  const [newAnnSummary, setNewAnnSummary] = useState('');
  const [newAnnUrgent, setNewAnnUrgent] = useState(false);
  const [isPostingAnn, setIsPostingAnn] = useState(false);

  // Events Management State
  const [eventSearchTerm, setEventSearchTerm] = useState('');
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [eventFormMode, setEventFormMode] = useState('create'); // 'create' | 'edit'
  const [editingEventId, setEditingEventId] = useState(null);

  // Event form inputs
  const [eventTitle, setEventTitle] = useState('');
  const [eventCategory, setEventCategory] = useState('Hackathon');
  const [eventStatus, setEventStatus] = useState('Upcoming');
  const [eventDate, setEventDate] = useState('');
  const [eventTime, setEventTime] = useState('');
  const [eventVenue, setEventVenue] = useState('GECT Central Auditorium');
  const [eventOrganizer, setEventOrganizer] = useState('Association of Cyber Physical Systems (ACPS)');
  const [eventSpeaker, setEventSpeaker] = useState('');
  const [eventPrizePool, setEventPrizePool] = useState('');
  const [eventEligibility, setEventEligibility] = useState('Open to all engineering students');
  const [eventCapacity, setEventCapacity] = useState(150);
  const [eventRegisteredCount, setEventRegisteredCount] = useState(0);
  const [eventRegistrationOpen, setEventRegistrationOpen] = useState(true);
  const [eventRegistrationLink, setEventRegistrationLink] = useState('');
  const [eventDescription, setEventDescription] = useState('');
  const [eventHighlights, setEventHighlights] = useState('');
  const [isSavingEvent, setIsSavingEvent] = useState(false);
  const [eventFeedbackMsg, setEventFeedbackMsg] = useState('');
  const [eventErrorMsg, setEventErrorMsg] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthError('');
    try {
      const res = await fetch('/api/admin/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ passcode })
      });
      const data = await res.json();
      if (data.success) {
        sessionStorage.setItem('cps_admin_session', 'true');
        setIsAdminLoggedIn(true);
        if (issues.length > 0 && !selectedIssue) {
          setSelectedIssue(issues[0]);
        }
      } else {
        setAuthError(data.error || 'Invalid passcode.');
      }
    } catch (err) {
      setAuthError('Connection error verifying committee passcode.');
    }
  };

  const handleUpdateIssue = async (e) => {
    e.preventDefault();
    if (!selectedIssue) return;
    setIsUpdating(true);
    setActionSuccessMsg('');

    try {
      const payload = {
        status: updateStatus || selectedIssue.status,
        note: updateNote,
        actor: updateActor,
        assignedCommittee: updateAssigned || selectedIssue.assignedCommittee
      };

      const res = await fetch(`/api/issues/${selectedIssue.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setActionSuccessMsg(`Issue ${selectedIssue.id} updated to ${data.data.status}!`);
        setSelectedIssue(data.data);
        setUpdateNote('');
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleUpdateSuggestion = async (e) => {
    e.preventDefault();
    if (!selectedSuggestion) return;
    setIsUpdatingSug(true);

    try {
      const payload = {
        status: sugStatus || selectedSuggestion.status,
        officialResponse: sugResponse || selectedSuggestion.officialResponse
      };

      const res = await fetch(`/api/suggestions/${selectedSuggestion.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setSelectedSuggestion(data.data);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsUpdatingSug(false);
    }
  };

  const handlePostAnnouncement = async (e) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnSummary) return;
    setIsPostingAnn(true);

    try {
      const payload = {
        title: newAnnTitle,
        category: newAnnCategory,
        summary: newAnnSummary,
        urgent: newAnnUrgent,
        issuedBy: 'Student Welfare & Grievance Committee'
      };

      const res = await fetch('/api/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (data.success) {
        setNewAnnTitle('');
        setNewAnnSummary('');
        setNewAnnUrgent(false);
        if (onRefresh) onRefresh();
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsPostingAnn(false);
    }
  };

  // Event Management Handlers
  const handleOpenCreateEvent = () => {
    setEventFormMode('create');
    setEditingEventId(null);
    setEventTitle('');
    setEventCategory('Hackathon');
    setEventStatus('Upcoming');
    setEventDate('');
    setEventTime('');
    setEventVenue('');
    setEventOrganizer('Association of Cyber Physical Systems (ACPS)');
    setEventSpeaker('');
    setEventPrizePool('');
    setEventEligibility('');
    setEventCapacity(100);
    setEventRegisteredCount(0);
    setEventRegistrationOpen(true);
    setEventRegistrationLink('');
    setEventDescription('');
    setEventHighlights('');
    setEventFeedbackMsg('');
    setEventErrorMsg('');
    setIsEventModalOpen(true);
  };

  const handleOpenEditEvent = (evt) => {
    setEventFormMode('edit');
    setEditingEventId(evt.id);
    setEventTitle(evt.title || '');
    setEventCategory(evt.category || 'Hackathon');
    setEventStatus(evt.status || 'Upcoming');
    setEventDate(evt.date || '');
    setEventTime(evt.time || '');
    setEventVenue(evt.venue || '');
    setEventOrganizer(evt.organizer || '');
    setEventSpeaker(evt.speaker || '');
    setEventPrizePool(evt.prizePool || '');
    setEventEligibility(evt.eligibility || 'Open to all students');
    setEventCapacity(evt.capacity || 100);
    setEventRegisteredCount(evt.registeredCount || 0);
    setEventRegistrationOpen(evt.registrationOpen !== false);
    setEventRegistrationLink(evt.registrationLink || '');
    setEventDescription(evt.description || '');
    setEventHighlights(Array.isArray(evt.highlights) ? evt.highlights.join('\n') : (evt.highlights || ''));
    setEventFeedbackMsg('');
    setEventErrorMsg('');
    setIsEventModalOpen(true);
  };

  const handleSaveEvent = async (e) => {
    e.preventDefault();
    if (!eventTitle.trim()) {
      setEventErrorMsg('Event Title is required.');
      return;
    }

    setIsSavingEvent(true);
    setEventErrorMsg('');
    setEventFeedbackMsg('');

    const payload = {
      title: eventTitle.trim(),
      category: eventCategory,
      status: eventStatus,
      date: eventDate.trim() || 'TBD',
      time: eventTime.trim() || 'TBD',
      venue: eventVenue.trim(),
      organizer: eventOrganizer.trim(),
      speaker: eventSpeaker.trim(),
      prizePool: eventPrizePool.trim(),
      eligibility: eventEligibility.trim(),
      capacity: Number(eventCapacity) || 100,
      registeredCount: Number(eventRegisteredCount) || 0,
      registrationOpen: Boolean(eventRegistrationOpen),
      registrationLink: eventRegistrationLink.trim(),
      description: eventDescription.trim(),
      highlights: eventHighlights.split('\n').map(h => h.trim()).filter(Boolean)
    };

    try {
      let res;
      if (eventFormMode === 'create') {
        res = await fetch('/api/events', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        res = await fetch(`/api/events/${editingEventId}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const data = await res.json();
      if (data.success) {
        setIsEventModalOpen(false);
        setEventFeedbackMsg(eventFormMode === 'create' ? 'Event published successfully!' : 'Event updated successfully!');
        if (onRefresh) onRefresh();
        setTimeout(() => setEventFeedbackMsg(''), 4000);
      } else {
        setEventErrorMsg(data.error || 'Failed to save event.');
      }
    } catch (err) {
      setEventErrorMsg('Network error connecting to events API.');
    } finally {
      setIsSavingEvent(false);
    }
  };

  const handleToggleEventRegistration = async (evt) => {
    try {
      const res = await fetch(`/api/events/${evt.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ registrationOpen: !evt.registrationOpen })
      });
      const data = await res.json();
      if (data.success) {
        setEventFeedbackMsg(`Registration for "${evt.title}" is now ${!evt.registrationOpen ? 'OPEN' : 'CLOSED'}.`);
        if (onRefresh) onRefresh();
        setTimeout(() => setEventFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteEvent = async (evt) => {
    const confirmDelete = window.confirm(`Are you sure you want to remove event "${evt.title}" (${evt.id})? This action cannot be reversed.`);
    if (!confirmDelete) return;

    try {
      const res = await fetch(`/api/events/${evt.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (data.success) {
        setEventFeedbackMsg(`Event "${evt.title}" removed.`);
        if (onRefresh) onRefresh();
        setTimeout(() => setEventFeedbackMsg(''), 3000);
      }
    } catch (err) {
      console.error(err);
    }
  };

  // If not logged in, display committee authentication form
  if (!isAdminLoggedIn) {
    return (
      <div>
        <div className="page-title-row">
          <div>
            <h1>Committee Login</h1>
            <p>Authorized access for Student Welfare Committee members, Advisors, and Lab Superintendents.</p>
          </div>
        </div>

        <div style={{ maxWidth: '440px', margin: '30px auto' }} className="card">
          <div style={{ textAlign: 'center', marginBottom: '20px' }}>
            <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--navy-subtle)', borderRadius: '50%', color: 'var(--navy-primary)', marginBottom: '10px' }}>
              <Lock size={28} />
            </div>
            <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
              Committee Resolution Portal
            </h2>
            <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)' }}>
              Authorized access for CPS Student Welfare Committee, Faculty Advisors, and Lab Superintendents.
            </p>
          </div>

          {authError && (
            <div style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', color: 'var(--red-crimson)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '14px' }}>
              {authError}
            </div>
          )}

          <form onSubmit={handleLogin}>
            <div className="form-row">
              <label className="form-label">Committee Passcode</label>
              <input
                type="password"
                className="form-input"
                placeholder="Enter passcode (hint: committee2026)"
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '10px' }}>
              <ShieldCheck size={16} />
              <span>Authenticate &amp; Access Dashboard</span>
            </button>
          </form>

          <div style={{ marginTop: '16px', background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.78rem', color: 'var(--text-dim)', textAlign: 'center' }}>
            Authorized Passcode: <strong style={{ color: 'var(--navy-dark)' }}>committee2026</strong>
          </div>

          {onNavigateToStudentPortal && (
            <div style={{ marginTop: '16px', textAlign: 'center' }}>
              <button
                type="button"
                className="btn btn-secondary"
                style={{ width: '100%', fontSize: '0.84rem' }}
                onClick={onNavigateToStudentPortal}
              >
                &larr; Return to Student Portal
              </button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // LOGGED IN DASHBOARD
  const pendingCount = issues.filter(i => i.status === 'Under Review').length;
  const inProgressCount = issues.filter(i => i.status === 'In Progress').length;
  const resolvedCount = issues.filter(i => i.status === 'Resolved').length;

  const filteredAdminEvents = events.filter(evt => {
    if (!eventSearchTerm) return true;
    const q = eventSearchTerm.toLowerCase();
    return (
      (evt.title && evt.title.toLowerCase().includes(q)) ||
      (evt.category && evt.category.toLowerCase().includes(q)) ||
      (evt.venue && evt.venue.toLowerCase().includes(q)) ||
      (evt.organizer && evt.organizer.toLowerCase().includes(q))
    );
  });

  return (
    <div>
      {/* Top Header Strip */}
      <div className="page-title-row">
        <div>
          <h1>Committee Admin Resolution &amp; Events Desk</h1>
          <p>Manage college hackathons &amp; events, resolve student grievance tickets, and publish circulars.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {onNavigateToStudentPortal && (
            <button 
              className="btn btn-secondary"
              onClick={onNavigateToStudentPortal}
              style={{ fontSize: '0.82rem' }}
            >
              <span>&larr; View Student Portal</span>
            </button>
          )}

          <button 
            className="btn btn-secondary"
            onClick={() => {
              sessionStorage.removeItem('cps_admin_session');
              setIsAdminLoggedIn(false);
            }}
            style={{ fontSize: '0.82rem' }}
          >
            <LogOut size={14} />
            <span>Exit Committee Mode</span>
          </button>
        </div>
      </div>

      {/* Admin Tab Switcher */}
      <div style={{ 
        display: 'flex', 
        gap: '8px', 
        marginBottom: '24px', 
        borderBottom: '2px solid var(--border-light)', 
        paddingBottom: '12px',
        overflowX: 'auto'
      }}>
        <button
          onClick={() => setAdminTab('events')}
          className="btn"
          style={{
            background: adminTab === 'events' ? 'var(--navy-dark)' : 'var(--bg-subtle)',
            color: adminTab === 'events' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            fontSize: '0.86rem',
            fontWeight: 700,
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <CalendarDays size={16} />
          <span>College Events &amp; Hackathons ({events.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('issues')}
          className="btn"
          style={{
            background: adminTab === 'issues' ? 'var(--navy-dark)' : 'var(--bg-subtle)',
            color: adminTab === 'issues' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            fontSize: '0.86rem',
            fontWeight: 700,
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Wrench size={16} />
          <span>Issue Tickets ({issues.length})</span>
          {pendingCount > 0 && (
            <span style={{ background: 'var(--amber-warm)', color: '#ffffff', fontSize: '0.7rem', padding: '1px 6px', borderRadius: '10px' }}>
              {pendingCount}
            </span>
          )}
        </button>

        <button
          onClick={() => setAdminTab('suggestions')}
          className="btn"
          style={{
            background: adminTab === 'suggestions' ? 'var(--navy-dark)' : 'var(--bg-subtle)',
            color: adminTab === 'suggestions' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            fontSize: '0.86rem',
            fontWeight: 700,
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <MessageSquare size={16} />
          <span>Student Suggestions ({suggestions.length})</span>
        </button>

        <button
          onClick={() => setAdminTab('announcements')}
          className="btn"
          style={{
            background: adminTab === 'announcements' ? 'var(--navy-dark)' : 'var(--bg-subtle)',
            color: adminTab === 'announcements' ? '#ffffff' : 'var(--text-muted)',
            border: 'none',
            fontSize: '0.86rem',
            fontWeight: 700,
            padding: '8px 18px',
            borderRadius: 'var(--radius-md)',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}
        >
          <Bell size={16} />
          <span>Circulars &amp; Notices ({announcements.length})</span>
        </button>
      </div>

      {/* Global Action Banner */}
      {eventFeedbackMsg && (
        <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green-forest)', padding: '10px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.86rem', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <CheckCircle2 size={16} />
          <span>{eventFeedbackMsg}</span>
        </div>
      )}

      {/* TAB 1: COLLEGE EVENTS & HACKATHONS MANAGER */}
      {adminTab === 'events' && (
        <div>
          {/* Top Action Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '20px' }}>
            <div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)', fontWeight: 800 }}>
                College Events &amp; Hackathons Registry
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)' }}>
                Publish new competitions, update venues/dates, and manage registration availability for all students.
              </p>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div className="search-input-box" style={{ maxWidth: '240px' }}>
                <Search size={15} />
                <input
                  type="text"
                  placeholder="Search events..."
                  value={eventSearchTerm}
                  onChange={(e) => setEventSearchTerm(e.target.value)}
                />
              </div>

              <button
                className="btn btn-primary"
                onClick={handleOpenCreateEvent}
                style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', padding: '8px 16px' }}
              >
                <PlusCircle size={16} />
                <span>+ Create Event / Hackathon</span>
              </button>
            </div>
          </div>

          {/* Events List */}
          {filteredAdminEvents.length === 0 ? (
            <div className="card" style={{ padding: '40px 20px', textAlign: 'center', background: '#ffffff' }}>
              <CalendarDays size={36} color="var(--text-dim)" style={{ margin: '0 auto 12px' }} />
              <h3 style={{ fontSize: '1.1rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                No College Events in Registry
              </h3>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.84rem', marginBottom: '16px' }}>
                Click "+ Create Event / Hackathon" above to publish upcoming campus competitions, workshops, or symposia.
              </p>
              <button className="btn btn-primary" onClick={handleOpenCreateEvent} style={{ fontSize: '0.82rem' }}>
                <PlusCircle size={14} />
                <span>Create First Event</span>
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              {filteredAdminEvents.map(evt => {
                const isOngoing = evt.status?.toLowerCase().includes('ongoing');
                const isPast = evt.status?.toLowerCase() === 'past';
                const fillPercentage = evt.capacity ? Math.min(100, Math.round(((evt.registeredCount || 0) / evt.capacity) * 100)) : 0;

                return (
                  <div 
                    key={evt.id}
                    className="card"
                    style={{
                      padding: '18px 22px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      gap: '20px',
                      flexWrap: 'wrap',
                      borderLeft: `4px solid ${isOngoing ? 'var(--green-emerald)' : isPast ? '#94a3b8' : 'var(--navy-primary)'}`
                    }}
                  >
                    {/* Left Info */}
                    <div style={{ flex: '1 1 480px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '6px', flexWrap: 'wrap' }}>
                        <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                          {evt.id}
                        </span>
                        <span className={`badge ${isOngoing ? 'badge-green' : isPast ? 'badge-slate' : 'badge-blue'}`}>
                          {evt.status}
                        </span>
                        <span className="badge badge-slate">
                          {evt.category}
                        </span>
                        {evt.prizePool && (
                          <span className="badge badge-amber" style={{ display: 'inline-flex', alignItems: 'center', gap: '3px' }}>
                            <Trophy size={11} />
                            {evt.prizePool}
                          </span>
                        )}
                        <span style={{ 
                          fontSize: '0.72rem', 
                          fontWeight: 700, 
                          color: evt.registrationOpen ? 'var(--green-forest)' : 'var(--red-crimson)',
                          background: evt.registrationOpen ? 'var(--green-light)' : 'var(--red-light)',
                          padding: '2px 8px',
                          borderRadius: '10px'
                        }}>
                          {evt.registrationOpen ? 'Registration OPEN' : 'Registration CLOSED'}
                        </span>
                      </div>

                      <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '6px' }}>
                        {evt.title}
                      </h3>

                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '14px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {evt.date && <span><strong>Date:</strong> {evt.date}</span>}
                        {evt.time && <span><strong>Time:</strong> {evt.time}</span>}
                        {evt.venue && <span><strong>Venue:</strong> {evt.venue}</span>}
                        {(evt.organizer || evt.speaker) && <span><strong>Lead / Org:</strong> {evt.organizer || evt.speaker}</span>}
                      </div>

                      {/* Progress */}
                      {evt.capacity > 0 && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '10px', maxWidth: '380px' }}>
                          <span style={{ fontSize: '0.74rem', color: 'var(--text-dim)' }}>
                            Capacity: <strong>{evt.registeredCount || 0}</strong> / {evt.capacity} ({fillPercentage}%)
                          </span>
                          <div style={{ flex: 1, height: '5px', background: 'var(--border-light)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ height: '100%', width: `${fillPercentage}%`, background: 'var(--navy-primary)' }} />
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Right Actions */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexShrink: 0 }}>
                      <button
                        className="btn btn-secondary"
                        onClick={() => handleToggleEventRegistration(evt)}
                        title="Toggle registration open/closed status"
                        style={{ fontSize: '0.76rem', padding: '6px 12px' }}
                      >
                        {evt.registrationOpen ? 'Close Reg' : 'Open Reg'}
                      </button>

                      <button
                        className="btn btn-primary"
                        onClick={() => handleOpenEditEvent(evt)}
                        style={{ fontSize: '0.78rem', padding: '6px 14px', display: 'flex', alignItems: 'center', gap: '5px' }}
                      >
                        <Edit3 size={14} />
                        <span>Edit Event</span>
                      </button>

                      <button
                        className="btn btn-secondary"
                        onClick={() => handleDeleteEvent(evt)}
                        title="Delete event"
                        style={{ fontSize: '0.78rem', padding: '6px 10px', color: 'var(--red-crimson)' }}
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Event Create / Edit Modal */}
          {isEventModalOpen && (
            <Modal
              isOpen={true}
              onClose={() => setIsEventModalOpen(false)}
              title={eventFormMode === 'create' ? 'Create New College Event / Hackathon' : `Edit Event: ${eventTitle || editingEventId}`}
              subtitle="All changes will update the student portal in real-time."
            >
              <form onSubmit={handleSaveEvent}>
                {eventErrorMsg && (
                  <div style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', color: 'var(--red-crimson)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '14px' }}>
                    {eventErrorMsg}
                  </div>
                )}

                <div className="form-row">
                  <label className="form-label">Event / Hackathon Title *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="Enter event title"
                    value={eventTitle}
                    onChange={(e) => setEventTitle(e.target.value)}
                    required
                  />
                </div>

                <div className="grid-3" style={{ gap: '12px' }}>
                  <div className="form-row">
                    <label className="form-label">Category</label>
                    <select className="form-select" value={eventCategory} onChange={(e) => setEventCategory(e.target.value)}>
                      <option value="Hackathon">Hackathon</option>
                      <option value="Workshop">Workshop</option>
                      <option value="Symposium">Symposium</option>
                      <option value="CTF / Coding">CTF / Coding</option>
                      <option value="Talk / Keynote">Talk / Keynote</option>
                      <option value="Project Expo">Project Expo</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Status</label>
                    <select className="form-select" value={eventStatus} onChange={(e) => setEventStatus(e.target.value)}>
                      <option value="Upcoming">Upcoming</option>
                      <option value="Ongoing">Ongoing Today</option>
                      <option value="Past">Past / Concluded</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Cash Prize Pool (Optional)</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Prize amount (optional)"
                      value={eventPrizePool}
                      onChange={(e) => setEventPrizePool(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '12px' }}>
                  <div className="form-row">
                    <label className="form-label">Date *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Event date"
                      value={eventDate}
                      onChange={(e) => setEventDate(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">Time</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Event timings"
                      value={eventTime}
                      onChange={(e) => setEventTime(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '12px' }}>
                  <div className="form-row">
                    <label className="form-label">Venue *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Auditorium, seminar hall, or lab"
                      value={eventVenue}
                      onChange={(e) => setEventVenue(e.target.value)}
                      required
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">Organizer Body</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Organizing committee or club"
                      value={eventOrganizer}
                      onChange={(e) => setEventOrganizer(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-2" style={{ gap: '12px' }}>
                  <div className="form-row">
                    <label className="form-label">Keynote Speaker / Mentors</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Speaker or mentor (optional)"
                      value={eventSpeaker}
                      onChange={(e) => setEventSpeaker(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">Eligibility Criteria</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="Eligibility criteria (optional)"
                      value={eventEligibility}
                      onChange={(e) => setEventEligibility(e.target.value)}
                    />
                  </div>
                </div>

                <div className="grid-3" style={{ gap: '12px' }}>
                  <div className="form-row">
                    <label className="form-label">Total Seat Capacity</label>
                    <input
                      type="number"
                      className="form-input"
                      value={eventCapacity}
                      onChange={(e) => setEventCapacity(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">Current Registrations</label>
                    <input
                      type="number"
                      className="form-input"
                      value={eventRegisteredCount}
                      onChange={(e) => setEventRegisteredCount(e.target.value)}
                    />
                  </div>

                  <div className="form-row">
                    <label className="form-label">Registration Status</label>
                    <div style={{ marginTop: '8px' }}>
                      <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', cursor: 'pointer' }}>
                        <input
                          type="checkbox"
                          checked={eventRegistrationOpen}
                          onChange={(e) => setEventRegistrationOpen(e.target.checked)}
                        />
                        <span style={{ fontWeight: 600, color: eventRegistrationOpen ? 'var(--green-forest)' : 'var(--text-dim)' }}>
                          Registration Open
                        </span>
                      </label>
                    </div>
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">External Portal Link (Optional)</label>
                  <input
                    type="url"
                    className="form-input"
                    placeholder="Official portal or registration link"
                    value={eventRegistrationLink}
                    onChange={(e) => setEventRegistrationLink(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">Detailed Description</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Detailed event overview and instructions..."
                    value={eventDescription}
                    onChange={(e) => setEventDescription(e.target.value)}
                  />
                </div>

                <div className="form-row">
                  <label className="form-label">Key Highlights (One point per line)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="Key highlights (one item per line)..."
                    value={eventHighlights}
                    onChange={(e) => setEventHighlights(e.target.value)}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '20px' }}>
                  <button
                    type="button"
                    className="btn btn-secondary"
                    onClick={() => setIsEventModalOpen(false)}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSavingEvent}
                  >
                    <Check size={15} />
                    <span>{isSavingEvent ? 'Saving...' : eventFormMode === 'create' ? 'Publish Event' : 'Save Changes'}</span>
                  </button>
                </div>
              </form>
            </Modal>
          )}
        </div>
      )}

      {/* TAB 2: ISSUE TICKETS RESOLUTION WORKBENCH */}
      {adminTab === 'issues' && (
        <div>
          {/* KPI Stats */}
          <div className="grid-3" style={{ marginBottom: '28px' }}>
            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                Under Review (Pending)
              </span>
              <h3 className="font-mono" style={{ fontSize: '1.8rem', color: 'var(--navy-dark)', margin: '4px 0' }}>
                {pendingCount}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--amber-warm)' }}>
                Requires committee review &amp; assignment
              </p>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                Action In Progress
              </span>
              <h3 className="font-mono" style={{ fontSize: '1.8rem', color: 'var(--navy-dark)', margin: '4px 0' }}>
                {inProgressCount}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--navy-primary)' }}>
                Technicians / Staff currently addressing
              </p>
            </div>

            <div className="card" style={{ padding: '16px' }}>
              <span style={{ fontSize: '0.74rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700 }}>
                Successfully Resolved
              </span>
              <h3 className="font-mono" style={{ fontSize: '1.8rem', color: 'var(--navy-dark)', margin: '4px 0' }}>
                {resolvedCount}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--green-forest)' }}>
                Action completed &amp; verified
              </p>
            </div>
          </div>

          <div className="grid-2" style={{ gap: '22px' }}>
            {/* Left Column: Select Issue */}
            <div>
              <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase', marginBottom: '8px' }}>
                Select Ticket to Resolve ({issues.length})
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', maxHeight: '520px', overflowY: 'auto' }}>
                {issues.map((iss) => {
                  const isSelected = selectedIssue?.id === iss.id;
                  return (
                    <div 
                      key={iss.id}
                      className="card"
                      style={{ 
                        padding: '14px', 
                        cursor: 'pointer',
                        borderLeft: `4px solid ${isSelected ? 'var(--navy-primary)' : 'transparent'}`,
                        background: isSelected ? 'var(--bg-subtle)' : '#ffffff'
                      }}
                      onClick={() => {
                        setSelectedIssue(iss);
                        setUpdateStatus(iss.status);
                        setUpdateAssigned(iss.assignedCommittee);
                        setActionSuccessMsg('');
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <span className="font-mono" style={{ fontSize: '0.76rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                          {iss.id}
                        </span>
                        <span className={`badge ${
                          iss.status === 'Resolved' ? 'badge-green' :
                          iss.status === 'In Progress' ? 'badge-blue' :
                          'badge-amber'
                        }`}>
                          {iss.status}
                        </span>
                      </div>
                      <h4 style={{ fontSize: '0.94rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                        {iss.title}
                      </h4>
                      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                        <span>{iss.location}</span>
                        <span>{iss.category}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Right Column: Resolution Form */}
            <div>
              {selectedIssue ? (
                <div className="card" style={{ padding: '20px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                    <div>
                      <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--navy-primary)', fontWeight: 700 }}>
                        {selectedIssue.id}
                      </span>
                      <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginTop: '2px' }}>
                        {selectedIssue.title}
                      </h3>
                    </div>
                    <span className={`badge ${
                      selectedIssue.status === 'Resolved' ? 'badge-green' :
                      selectedIssue.status === 'In Progress' ? 'badge-blue' :
                      'badge-amber'
                    }`}>
                      {selectedIssue.status}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', marginBottom: '16px', background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                    {selectedIssue.description}
                  </p>

                  {actionSuccessMsg && (
                    <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green-forest)', padding: '10px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <CheckCircle2 size={16} />
                      <span>{actionSuccessMsg}</span>
                    </div>
                  )}

                  <form onSubmit={handleUpdateIssue}>
                    <div className="form-row">
                      <label className="form-label">Update Workflow Status</label>
                      <select 
                        className="form-select"
                        value={updateStatus || selectedIssue.status}
                        onChange={(e) => setUpdateStatus(e.target.value)}
                      >
                        <option value="Under Review">Under Review</option>
                        <option value="In Progress">In Progress (Action Dispatched)</option>
                        <option value="Resolved">Resolved (Completed &amp; Closed)</option>
                      </select>
                    </div>

                    <div className="form-row">
                      <label className="form-label">Assignee / Committee Officer</label>
                      <input
                        type="text"
                        className="form-input"
                        value={updateAssigned || selectedIssue.assignedCommittee}
                        onChange={(e) => setUpdateAssigned(e.target.value)}
                        placeholder="e.g. Er. Sreejith K. (Lab Superintendent)"
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Action Resolution Note *</label>
                      <textarea
                        className="form-textarea"
                        rows={3}
                        placeholder="Log actions taken (e.g. Component replaced from stock. Calibrated with signal generator)..."
                        value={updateNote}
                        onChange={(e) => setUpdateNote(e.target.value)}
                        required
                      />
                    </div>

                    <div className="form-row">
                      <label className="form-label">Actor Signature</label>
                      <input
                        type="text"
                        className="form-input"
                        value={updateActor}
                        onChange={(e) => setUpdateActor(e.target.value)}
                      />
                    </div>

                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                      <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                        <CheckCircle2 size={15} />
                        <span>{isUpdating ? 'Recording Action...' : 'Save Resolution Update'}</span>
                      </button>
                    </div>
                  </form>
                </div>
              ) : (
                <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>
                  Select a ticket from the left column to record committee actions.
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: STUDENT SUGGESTIONS */}
      {adminTab === 'suggestions' && (
        <div className="grid-2" style={{ gap: '22px' }}>
          <div>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '14px' }}>
              Student Suggestions ({suggestions.length})
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {suggestions.map(sug => {
                const isSelected = selectedSuggestion?.id === sug.id;
                return (
                  <div
                    key={sug.id}
                    className="card"
                    style={{
                      padding: '14px',
                      cursor: 'pointer',
                      borderLeft: `4px solid ${isSelected ? 'var(--navy-primary)' : 'transparent'}`,
                      background: isSelected ? 'var(--bg-subtle)' : '#ffffff'
                    }}
                    onClick={() => {
                      setSelectedSuggestion(sug);
                      setSugStatus(sug.status);
                      setSugResponse(sug.officialResponse || '');
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span className="font-mono" style={{ fontSize: '0.74rem', color: 'var(--text-dim)', fontWeight: 700 }}>
                        {sug.id}
                      </span>
                      <span className="badge badge-blue">{sug.status}</span>
                    </div>
                    <h4 style={{ fontSize: '0.94rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                      {sug.title}
                    </h4>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                      {sug.suggestion}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            {selectedSuggestion ? (
              <div className="card" style={{ padding: '20px' }}>
                <h4 style={{ fontSize: '1.1rem', color: 'var(--navy-dark)', marginBottom: '6px' }}>
                  Review Suggestion: {selectedSuggestion.title}
                </h4>
                <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px', background: 'var(--bg-subtle)', padding: '10px 12px', borderRadius: 'var(--radius-sm)' }}>
                  {selectedSuggestion.suggestion}
                </p>

                <form onSubmit={handleUpdateSuggestion}>
                  <div className="form-row">
                    <label className="form-label">Committee Decision</label>
                    <select className="form-select" value={sugStatus} onChange={(e) => setSugStatus(e.target.value)}>
                      <option value="Under Review">Under Review</option>
                      <option value="Considered">Considered / In Planning</option>
                      <option value="Implemented">Implemented</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Official Response Message</label>
                    <textarea
                      className="form-textarea"
                      rows={3}
                      placeholder="e.g. Approved by HOD. Lab will remain accessible until 6:00 PM..."
                      value={sugResponse}
                      onChange={(e) => setSugResponse(e.target.value)}
                    />
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
                    <button type="submit" className="btn btn-primary" disabled={isUpdatingSug}>
                      <span>{isUpdatingSug ? 'Saving...' : 'Save Suggestion Status'}</span>
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <div className="card" style={{ padding: '30px', textAlign: 'center', color: 'var(--text-dim)' }}>
                Select a suggestion to review and record official feedback.
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 4: PUBLISH CIRCULARS */}
      {adminTab === 'announcements' && (
        <div style={{ maxWidth: '680px', margin: '0 auto' }} className="card">
          <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)', marginBottom: '6px' }}>
            Publish Student Welfare Circular
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '18px' }}>
            Post official notifications directly to the Announcements page for all students to see.
          </p>

          <form onSubmit={handlePostAnnouncement}>
            <div className="form-row">
              <label className="form-label">Circular Title *</label>
              <input
                type="text"
                className="form-input"
                placeholder="e.g. Exam Fee Concession Verification Camp..."
                value={newAnnTitle}
                onChange={(e) => setNewAnnTitle(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label className="form-label">Category</label>
              <select className="form-select" value={newAnnCategory} onChange={(e) => setNewAnnCategory(e.target.value)}>
                <option value="Academic Welfare">Academic Welfare</option>
                <option value="Scholarships">Scholarships</option>
                <option value="Student Welfare">Student Welfare</option>
                <option value="Safety Notice">Safety Notice</option>
              </select>
            </div>

            <div className="form-row">
              <label className="form-label">Full Circular Text / Summary *</label>
              <textarea
                className="form-textarea"
                rows={4}
                placeholder="Details of the announcement, venue, dates, and instructions for students..."
                value={newAnnSummary}
                onChange={(e) => setNewAnnSummary(e.target.value)}
                required
              />
            </div>

            <div className="form-row">
              <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={newAnnUrgent}
                  onChange={(e) => setNewAnnUrgent(e.target.checked)}
                />
                <span style={{ fontWeight: 600, color: 'var(--red-crimson)' }}>Mark as Urgent Notification</span>
              </label>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '16px' }}>
              <button type="submit" className="btn btn-primary" disabled={isPostingAnn}>
                <PlusCircle size={15} />
                <span>{isPostingAnn ? 'Publishing...' : 'Publish Announcement'}</span>
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
