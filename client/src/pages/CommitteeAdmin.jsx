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
  ChevronRight
} from 'lucide-react';

export default function CommitteeAdmin({ 
  issues = [], 
  suggestions = [], 
  announcements = [], 
  onRefresh, 
  isAdminLoggedIn, 
  setIsAdminLoggedIn,
  onNavigateToStudentPortal
}) {
  const [passcode, setPasscode] = useState('');
  const [authError, setAuthError] = useState('');

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
              <span>Authenticate & Access Dashboard</span>
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

  return (
    <div>
      {/* Top Header Strip */}
      <div className="page-title-row">
        <div>
          <h1>Committee Resolution Dashboard</h1>
          <p>Update student issues, record action notes, review suggestions, and publish bulletins.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          {onNavigateToStudentPortal && (
            <button 
              className="btn btn-secondary"
              onClick={onNavigateToStudentPortal}
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
          >
            <LogOut size={15} />
            <span>Exit Committee Mode</span>
          </button>
        </div>
      </div>

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
            Requires committee review & assignment
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
            Action completed & verified
          </p>
        </div>
      </div>

      {/* SECTION 1: INTERACTIVE ISSUE RESOLUTION WORKBENCH */}
      <div style={{ marginBottom: '36px' }}>
        <h2 style={{ fontSize: '1.3rem', color: 'var(--navy-dark)', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <Wrench size={18} color="var(--navy-primary)" />
          <span>Issue Resolution Workbench (Student &rarr; Committee &rarr; Update)</span>
        </h2>

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
                      <span className="font-mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                        {iss.id}
                      </span>
                      <span className={`tag ${iss.status === 'Resolved' ? 'tag-green' : iss.status === 'In Progress' ? 'tag-amber' : 'tag-stone'}`}>
                        {iss.status}
                      </span>
                    </div>

                    <h4 style={{ fontSize: '0.95rem', color: 'var(--navy-dark)', marginBottom: '2px' }}>
                      {iss.title}
                    </h4>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                      {iss.location} &bull; {iss.reportedBy}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Column: Update & Action Form */}
          {selectedIssue && (
            <div className="card" style={{ padding: '22px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                <div>
                  <span className="tag tag-stone font-mono" style={{ fontWeight: 700, marginBottom: '4px' }}>
                    {selectedIssue.id}
                  </span>
                  <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)' }}>
                    {selectedIssue.title}
                  </h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                    Location: <strong>{selectedIssue.location}</strong> &bull; Priority: <strong>{selectedIssue.priority}</strong>
                  </p>
                </div>

                <span className={`tag ${selectedIssue.status === 'Resolved' ? 'tag-green' : 'tag-amber'}`}>
                  {selectedIssue.status}
                </span>
              </div>

              <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.84rem', color: 'var(--text-muted)', marginBottom: '16px' }}>
                <strong style={{ color: 'var(--navy-dark)', display: 'block', marginBottom: '2px' }}>Student Description:</strong>
                {selectedIssue.description}
              </div>

              {actionSuccessMsg && (
                <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green-forest)', padding: '10px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <CheckCircle2 size={16} />
                  <span>{actionSuccessMsg}</span>
                </div>
              )}

              <form onSubmit={handleUpdateIssue}>
                <div className="grid-2">
                  <div className="form-row">
                    <label className="form-label">Update Status</label>
                    <select 
                      className="form-select"
                      value={updateStatus || selectedIssue.status}
                      onChange={(e) => setUpdateStatus(e.target.value)}
                    >
                      <option value="Under Review">Under Review</option>
                      <option value="Assigned">Assigned to Officer</option>
                      <option value="In Progress">Action In Progress</option>
                      <option value="Action Taken">Action Taken (Verifying)</option>
                      <option value="Resolved">Resolved (Complete)</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Assigned In-Charge</label>
                    <input
                      type="text"
                      className="form-input"
                      value={updateAssigned || selectedIssue.assignedCommittee}
                      onChange={(e) => setUpdateAssigned(e.target.value)}
                    />
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">Add Official Action Note (Visible to Students)</label>
                  <textarea
                    className="form-textarea"
                    rows={3}
                    placeholder="e.g. Technician inspected station. Requisition placed for probe replacement. Expected completion by tomorrow 2 PM..."
                    value={updateNote}
                    onChange={(e) => setUpdateNote(e.target.value)}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button type="submit" className="btn btn-primary" disabled={isUpdating}>
                    <Send size={14} />
                    <span>{isUpdating ? 'Saving Update...' : 'Commit Status Update'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      {/* SECTION 2: REVIEW SUGGESTIONS & POST ANNOUNCEMENT */}
      <div className="grid-2" style={{ gap: '22px' }}>
        {/* Suggestion Review */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '8px' }}>
            Review Student Anonymous Suggestions
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
            Mark student ideas as Implemented or Under Consideration and post official committee feedback.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
            {suggestions.slice(0, 3).map((s) => (
              <div 
                key={s.id} 
                style={{ 
                  background: 'var(--bg-subtle)', 
                  padding: '10px 12px', 
                  borderRadius: 'var(--radius-sm)', 
                  border: '1px solid var(--border-light)',
                  cursor: 'pointer' 
                }}
                onClick={() => {
                  setSelectedSuggestion(s);
                  setSugStatus(s.status);
                  setSugResponse(s.officialResponse || '');
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.76rem', color: 'var(--text-dim)' }}>
                  <span>{s.category} ({s.upvotes} upvotes)</span>
                  <span className="tag tag-stone" style={{ fontSize: '0.7rem' }}>{s.status}</span>
                </div>
                <strong style={{ fontSize: '0.88rem', color: 'var(--navy-dark)', display: 'block', margin: '2px 0' }}>
                  {s.title}
                </strong>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{s.idea.slice(0, 80)}...</p>
              </div>
            ))}
          </div>

          {selectedSuggestion && (
            <form onSubmit={handleUpdateSuggestion} style={{ background: '#ffffff', padding: '14px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-medium)' }}>
              <h4 style={{ fontSize: '0.9rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                Update: {selectedSuggestion.title}
              </h4>
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
                <input 
                  type="text" 
                  className="form-input" 
                  placeholder="e.g. Approved by HOD. Lab now accessible on Saturdays..." 
                  value={sugResponse} 
                  onChange={(e) => setSugResponse(e.target.value)} 
                />
              </div>
              <button type="submit" className="btn btn-primary" style={{ fontSize: '0.78rem', padding: '5px 12px' }} disabled={isUpdatingSug}>
                <span>Save Suggestion Status</span>
              </button>
            </form>
          )}
        </div>

        {/* Post Quick Announcement */}
        <div className="card" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '8px' }}>
            Publish Student Welfare Circular
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
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
                rows={3}
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

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button type="submit" className="btn btn-primary" disabled={isPostingAnn}>
                <PlusCircle size={15} />
                <span>{isPostingAnn ? 'Publishing...' : 'Publish Announcement'}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
