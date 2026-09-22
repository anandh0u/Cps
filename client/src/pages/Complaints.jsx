import React, { useState } from 'react';
import { 
  AlertCircle, 
  PlusCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  Wrench, 
  ShieldAlert, 
  Filter, 
  Send, 
  MessageSquare, 
  User, 
  MapPin,
  Calendar,
  Layers,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Complaints({ complaints = [], onRefresh, initialRoomCode = null }) {
  const [filterStatus, setFilterStatus] = useState('All');
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(Boolean(initialRoomCode));
  const [expandedTicketId, setExpandedTicketId] = useState(null);
  const [submissionSuccess, setSubmissionSuccess] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Hardware Lab Equipment',
    location: initialRoomCode ? `Room ${initialRoomCode}` : 'CPS Hardware Lab (Room H-101)',
    priority: 'Medium',
    description: '',
    isAnonymous: true,
    reporterName: '',
    contactEmail: ''
  });
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const filteredTickets = complaints.filter(ticket => {
    const matchesStatus = filterStatus === 'All' || ticket.status.toLowerCase() === filterStatus.toLowerCase();
    const matchesCategory = filterCategory === 'All' || ticket.category.toLowerCase().includes(filterCategory.toLowerCase());
    
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      ticket.id.toLowerCase().includes(q) ||
      ticket.title.toLowerCase().includes(q) ||
      ticket.location.toLowerCase().includes(q) ||
      ticket.description.toLowerCase().includes(q);

    return matchesStatus && matchesCategory && matchesSearch;
  });

  const handleSubmitComplaint = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!formData.title || !formData.description) {
      setErrorMsg('Please provide a title and detailed description.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        category: formData.category,
        location: formData.location,
        priority: formData.priority,
        description: formData.description,
        reportedBy: formData.isAnonymous ? 'CPS Student (Anonymous)' : formData.reporterName,
        contactEmail: formData.isAnonymous ? null : formData.contactEmail
      };

      const res = await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSubmissionSuccess(data.data);
        setIsSubmitModalOpen(false);
        setFormData({
          title: '',
          category: 'Hardware Lab Equipment',
          location: 'CPS Hardware Lab (Room H-101)',
          priority: 'Medium',
          description: '',
          isAnonymous: true,
          reporterName: '',
          contactEmail: ''
        });
        if (onRefresh) onRefresh();
      } else {
        setErrorMsg(data.error || 'Failed to submit complaint.');
      }
    } catch (err) {
      setErrorMsg('Network error connecting to API server.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingBottom: '50px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-kicker">
            <AlertCircle size={14} />
            <span>Grievance & Lab Equipment Desk</span>
          </div>
          <h1 className="page-title">Complaints & Maintenance Tracker</h1>
          <p className="page-subtitle">
            Lodge complaints regarding hardware laboratory testbenches, software compiler licenses, classroom audio-visuals, or academic grievances with real-time ticket tracking.
          </p>
        </div>

        <button 
          className="btn btn-primary"
          onClick={() => {
            setSubmissionSuccess(null);
            setIsSubmitModalOpen(true);
          }}
        >
          <PlusCircle size={16} />
          <span>Lodge New Grievance</span>
        </button>
      </div>

      {/* Success Notification Banner */}
      {submissionSuccess && (
        <div 
          style={{ 
            background: '#ecfdf5', 
            border: '1px solid #a7f3d0', 
            borderRadius: '8px', 
            padding: '16px', 
            marginBottom: '24px',
            display: 'flex',
            alignItems: 'flex-start',
            gap: '12px'
          }}
        >
          <CheckCircle2 size={22} color="#059669" style={{ flexShrink: 0, marginTop: '2px' }} />
          <div>
            <h4 style={{ color: '#065f46', fontSize: '1rem' }}>
              Ticket Registered: <span className="font-mono">{submissionSuccess.id}</span>
            </h4>
            <p style={{ color: '#047857', fontSize: '0.85rem', marginTop: '2px' }}>
              Your issue "{submissionSuccess.title}" has been forwarded to <strong>{submissionSuccess.assignedTo}</strong>.
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {['All', 'Under Review', 'In Progress', 'Resolved'].map(status => (
            <button
              key={status}
              className={`filter-tab-btn ${filterStatus === status ? 'active' : ''}`}
              onClick={() => setFilterStatus(status)}
            >
              {status}
            </button>
          ))}
          <span style={{ color: '#cbd5e1', margin: '0 4px' }}>|</span>
          {['All Categories', 'Hardware', 'Software', 'Classroom'].map(cat => {
            const rawCat = cat === 'All Categories' ? 'All' : cat;
            return (
              <button
                key={cat}
                className={`filter-tab-btn ${filterCategory === rawCat ? 'active' : ''}`}
                onClick={() => setFilterCategory(rawCat)}
              >
                {cat}
              </button>
            );
          })}
        </div>

        <div className="search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search Ticket ID, title, lab..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Complaints List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredTickets.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
            <CheckCircle2 size={36} color="#059669" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ color: 'var(--blue-navy)', marginBottom: '4px' }}>No Grievances Found</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>
              No complaints match the selected filter criteria.
            </p>
          </div>
        ) : (
          filteredTickets.map(ticket => {
            const isResolved = ticket.status === 'Resolved';
            const isInProgress = ticket.status === 'In Progress';
            const isCritical = ticket.priority === 'Critical';
            const isHigh = ticket.priority === 'High';
            const isExpanded = expandedTicketId === ticket.id;

            return (
              <div 
                key={ticket.id} 
                className="card" 
                style={{ 
                  borderLeft: `4px solid ${isResolved ? '#10b981' : isCritical ? '#dc2626' : isInProgress ? '#0284c7' : '#d97706'}` 
                }}
              >
                {/* Ticket Top Row */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                    <span className="badge badge-slate font-mono" style={{ fontWeight: 700 }}>
                      {ticket.id}
                    </span>
                    <span className={`badge ${isCritical ? 'badge-red' : isHigh ? 'badge-amber' : 'badge-blue'}`}>
                      Priority: {ticket.priority}
                    </span>
                    <span className="badge badge-blue">
                      {ticket.category}
                    </span>
                  </div>

                  <span className={`badge ${isResolved ? 'badge-green' : isInProgress ? 'badge-blue' : 'badge-amber'}`}>
                    <span className="status-dot" style={{ width: '6px', height: '6px', background: isResolved ? '#059669' : '#0284c7' }}></span>
                    <span>{ticket.status}</span>
                  </span>
                </div>

                {/* Ticket Title & Location */}
                <h3 style={{ fontSize: '1.15rem', color: 'var(--blue-navy)', marginBottom: '4px' }}>
                  {ticket.title}
                </h3>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '12px', flexWrap: 'wrap' }}>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <MapPin size={13} color="var(--blue-primary)" />
                    <strong>{ticket.location}</strong>
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Calendar size={13} />
                    {new Date(ticket.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <User size={13} />
                    Reported by: {ticket.reportedBy}
                  </span>
                </div>

                <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                  {ticket.description}
                </p>

                {/* Assigned Personnel and Timeline Toggle */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center', 
                  paddingTop: '12px', 
                  borderTop: '1px solid #e2e8f0',
                  fontSize: '0.82rem'
                }}>
                  <span style={{ color: 'var(--text-muted)' }}>
                    Assigned: <strong style={{ color: 'var(--blue-navy)' }}>{ticket.assignedTo}</strong>
                  </span>

                  <button 
                    className="btn btn-secondary"
                    style={{ fontSize: '0.78rem', padding: '4px 10px' }}
                    onClick={() => setExpandedTicketId(isExpanded ? null : ticket.id)}
                  >
                    <span>{isExpanded ? 'Hide History' : `Updates (${ticket.updates?.length || 0})`}</span>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>

                {/* Expanded Timeline */}
                {isExpanded && (
                  <div style={{ marginTop: '14px', background: '#f8fafc', padding: '14px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
                    <h5 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-dim)', marginBottom: '10px' }}>
                      Resolution Activity & Notes
                    </h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                      {ticket.updates?.map((up, idx) => (
                        <div key={idx} style={{ display: 'flex', gap: '10px', fontSize: '0.82rem' }}>
                          <span className="font-mono" style={{ color: 'var(--text-dim)', flexShrink: 0 }}>
                            {new Date(up.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                          <span style={{ color: 'var(--text-main)' }}>&bull; {up.note}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Submit Grievance Modal */}
      <Modal
        isOpen={isSubmitModalOpen}
        onClose={() => setIsSubmitModalOpen(false)}
        title="Lodge New Complaint / Equipment Issue"
        subtitle="Submit technical laboratory, software license, or infrastructure issues to department technicians."
      >
        <form onSubmit={handleSubmitComplaint}>
          {errorMsg && (
            <div style={{ background: '#fef2f2', color: '#991b1b', padding: '8px 12px', borderRadius: '6px', fontSize: '0.82rem', marginBottom: '14px', border: '1px solid #fecaca' }}>
              {errorMsg}
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Issue Title / Subject *</label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Oscilloscope Channel 2 noise, Projector HDMI failure..."
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
            />
          </div>

          <div className="grid-2">
            <div className="form-group">
              <label className="form-label">Category *</label>
              <select
                className="form-select"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="Hardware Lab Equipment">Hardware Lab Equipment</option>
                <option value="Software & RTOS Tools">Software & RTOS Tools</option>
                <option value="Classroom Infrastructure">Classroom Infrastructure</option>
                <option value="Network / Wi-Fi">Network / Wi-Fi</option>
                <option value="Academic Grievance">Academic Grievance</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Location / Space *</label>
              <select
                className="form-select"
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
              >
                <option value="CPS Hardware Lab (Room H-101)">CPS Hardware Lab (Room H-101)</option>
                <option value="Robotics Lab (Room R-204)">Robotics Lab (Room R-204)</option>
                <option value="Industrial IoT Lab (Room I-105)">Industrial IoT Lab (Room I-105)</option>
                <option value="Classroom 301 (CR-301)">Classroom 301 (CR-301)</option>
                <option value="Classroom 302 (CR-302)">Classroom 302 (CR-302)</option>
                <option value="CPS Seminar Hall (SH-401)">CPS Seminar Hall (SH-401)</option>
                <option value="General Academic Block">General Academic Block</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Urgency / Priority</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              {['Low', 'Medium', 'High', 'Critical'].map(p => (
                <label key={p} style={{ display: 'flex', alignItems: 'center', gap: '4px', fontSize: '0.85rem', cursor: 'pointer' }}>
                  <input
                    type="radio"
                    name="priority"
                    checked={formData.priority === p}
                    onChange={() => setFormData({ ...formData, priority: p })}
                  />
                  <span>{p}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Detailed Description of Problem *</label>
            <textarea
              className="form-textarea"
              rows={4}
              placeholder="Describe what occurred, station or bench number, error messages, or steps to reproduce..."
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
            />
          </div>

          <div className="form-group" style={{ background: '#f8fafc', padding: '12px', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.85rem', cursor: 'pointer', fontWeight: 600 }}>
              <input
                type="checkbox"
                checked={formData.isAnonymous}
                onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
              />
              <span>Submit Anonymously (Identity protected)</span>
            </label>

            {!formData.isAnonymous && (
              <div className="grid-2" style={{ marginTop: '12px' }}>
                <div>
                  <label className="form-label">Your Name</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. S6 CPS Student"
                    value={formData.reporterName}
                    onChange={(e) => setFormData({ ...formData, reporterName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="form-label">Email for Ticket Status</label>
                  <input
                    type="email"
                    className="form-input"
                    placeholder="student@gect.ac.in"
                    value={formData.contactEmail}
                    onChange={(e) => setFormData({ ...formData, contactEmail: e.target.value })}
                  />
                </div>
              </div>
            )}
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '16px' }}>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setIsSubmitModalOpen(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={submitting}
            >
              <Send size={15} />
              <span>{submitting ? 'Registering Ticket...' : 'Submit Grievance'}</span>
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
}
