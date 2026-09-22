import React, { useState } from 'react';
import { 
  AlertCircle, 
  Send, 
  Search, 
  CheckCircle2, 
  Clock, 
  MapPin, 
  User, 
  ChevronDown, 
  ChevronUp
} from 'lucide-react';

export default function ReportIssue({ issues = [], onRefresh }) {
  const [activeTab, setActiveTab] = useState('submit'); // 'submit' | 'track'
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('All');
  const [expandedId, setExpandedId] = useState(null);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Form State
  const [formData, setFormData] = useState({
    title: '',
    category: 'Lab Equipment',
    location: 'CPS Hardware Lab (Room H-101)',
    priority: 'Medium',
    description: '',
    isAnonymous: true,
    reporterName: '',
    contactEmail: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formError, setFormError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormError('');

    if (!formData.title || !formData.description) {
      setFormError('Please enter an issue title and description.');
      return;
    }

    setIsSubmitting(true);
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

      const res = await fetch('/api/issues', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const data = await res.json();
      if (data.success) {
        setSubmittedTicket(data.data);
        setFormData({
          title: '',
          category: 'Lab Equipment',
          location: 'CPS Hardware Lab (Room H-101)',
          priority: 'Medium',
          description: '',
          isAnonymous: true,
          reporterName: '',
          contactEmail: ''
        });
        if (onRefresh) onRefresh();
      } else {
        setFormError(data.error || 'Failed to submit issue.');
      }
    } catch (err) {
      setFormError('Network error connecting to student helpdesk.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const filteredIssues = issues.filter(issue => {
    const matchesCategory = filterCategory === 'All' || issue.category.toLowerCase().includes(filterCategory.toLowerCase());
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      issue.id.toLowerCase().includes(q) ||
      issue.title.toLowerCase().includes(q) ||
      issue.location.toLowerCase().includes(q) ||
      issue.description.toLowerCase().includes(q);

    return matchesCategory && matchesSearch;
  });

  return (
    <div>
      {/* Title Bar */}
      <div className="page-title-row">
        <div>
          <h1>Report an Issue</h1>
          <p>Submit laboratory equipment faults, classroom infrastructure needs, or welfare grievances.</p>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className={`btn ${activeTab === 'submit' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => {
              setActiveTab('submit');
              setSubmittedTicket(null);
            }}
          >
            <Send size={14} />
            <span>Submit Issue</span>
          </button>
          <button 
            className={`btn ${activeTab === 'track' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('track')}
          >
            <Search size={14} />
            <span>Track Issues ({issues.length})</span>
          </button>
        </div>
      </div>

      {/* SUBMIT FORM TAB */}
      {activeTab === 'submit' && (
        <div style={{ maxWidth: '720px' }}>
          {submittedTicket ? (
            <div className="card" style={{ padding: '24px', textAlign: 'center' }}>
              <div style={{ display: 'inline-flex', padding: '12px', background: 'var(--green-light)', borderRadius: '50%', color: 'var(--green-forest)', marginBottom: '12px' }}>
                <CheckCircle2 size={30} />
              </div>
              <h2 style={{ fontSize: '1.25rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                Issue Submitted Successfully
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '16px' }}>
                Assigned to: <strong>{submittedTicket.assignedCommittee}</strong>
              </p>

              <div style={{ 
                background: 'var(--bg-subtle)', 
                border: '1px solid var(--border-medium)', 
                borderRadius: 'var(--radius-sm)', 
                padding: '12px 20px', 
                display: 'inline-block',
                marginBottom: '18px'
              }}>
                <span style={{ fontSize: '0.72rem', textTransform: 'uppercase', color: 'var(--text-dim)', fontWeight: 700, display: 'block' }}>
                  Tracking Reference ID
                </span>
                <span className="font-mono" style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                  {submittedTicket.id}
                </span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
                <button 
                  className="btn btn-primary"
                  onClick={() => {
                    setSubmittedTicket(null);
                    setActiveTab('track');
                    setSearchTerm(submittedTicket.id);
                  }}
                >
                  <Search size={14} />
                  <span>View Status</span>
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => setSubmittedTicket(null)}
                >
                  Submit Another
                </button>
              </div>
            </div>
          ) : (
            <div className="card" style={{ padding: '22px' }}>
              {formError && (
                <div style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', color: 'var(--red-crimson)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.84rem', marginBottom: '14px' }}>
                  {formError}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="form-row">
                  <label className="form-label">Issue Subject *</label>
                  <input
                    type="text"
                    className="form-input"
                    placeholder="e.g. Oscilloscope Channel 2 noise, Projector HDMI connection..."
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                  />
                </div>

                <div className="grid-2">
                  <div className="form-row">
                    <label className="form-label">Category *</label>
                    <select
                      className="form-select"
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    >
                      <option value="Lab Equipment">Lab Equipment</option>
                      <option value="Software & IT">Software & IT</option>
                      <option value="Classroom Facility">Classroom Facility</option>
                      <option value="Hostel & Amenities">Hostel & Amenities</option>
                      <option value="Academic Welfare">Academic Welfare</option>
                    </select>
                  </div>

                  <div className="form-row">
                    <label className="form-label">Location *</label>
                    <input
                      type="text"
                      className="form-input"
                      placeholder="e.g. Lab H-101, Room 301, Hostel..."
                      value={formData.location}
                      onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      required
                    />
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">Urgency</label>
                  <div style={{ display: 'flex', gap: '14px' }}>
                    {['Low', 'Medium', 'High', 'Critical'].map((lvl) => (
                      <label key={lvl} style={{ display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.84rem', cursor: 'pointer' }}>
                        <input
                          type="radio"
                          name="priority"
                          checked={formData.priority === lvl}
                          onChange={() => setFormData({ ...formData, priority: lvl })}
                        />
                        <span>{lvl}</span>
                      </label>
                    ))}
                  </div>
                </div>

                <div className="form-row">
                  <label className="form-label">Description *</label>
                  <textarea
                    className="form-textarea"
                    rows={4}
                    placeholder="Describe what occurred, station or bench number, error message..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    required
                  />
                </div>

                <div style={{ background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '16px' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.84rem', fontWeight: 600, cursor: 'pointer' }}>
                    <input
                      type="checkbox"
                      checked={formData.isAnonymous}
                      onChange={(e) => setFormData({ ...formData, isAnonymous: e.target.checked })}
                    />
                    <span>Submit Anonymously</span>
                  </label>

                  {!formData.isAnonymous && (
                    <div className="grid-2" style={{ marginTop: '10px' }}>
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
                        <label className="form-label">Email for Status</label>
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

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={isSubmitting}
                  >
                    <Send size={14} />
                    <span>{isSubmitting ? 'Submitting...' : 'Submit Issue'}</span>
                  </button>
                </div>
              </form>
            </div>
          )}
        </div>
      )}

      {/* TRACK ISSUES TAB */}
      {activeTab === 'track' && (
        <div>
          <div className="filter-shelf">
            <div className="filter-group">
              {['All', 'Lab Equipment', 'Software & IT', 'Classroom Facility', 'Hostel & Amenities'].map((cat) => (
                <button
                  key={cat}
                  className={`filter-btn ${filterCategory === cat ? 'active' : ''}`}
                  onClick={() => setFilterCategory(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>

            <div className="search-field">
              <Search size={14} />
              <input
                type="text"
                placeholder="Search ticket reference..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {filteredIssues.map((issue) => {
              const isResolved = issue.status === 'Resolved';
              const isInProgress = issue.status === 'In Progress';
              const isExpanded = expandedId === issue.id;

              return (
                <div key={issue.id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '6px', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', flexWrap: 'wrap' }}>
                      <span className="tag tag-stone font-mono" style={{ fontWeight: 700 }}>
                        {issue.id}
                      </span>
                      <span className={`tag ${issue.priority === 'High' || issue.priority === 'Critical' ? 'tag-red' : 'tag-amber'}`}>
                        {issue.priority}
                      </span>
                      <span className="tag tag-navy">
                        {issue.category}
                      </span>
                    </div>

                    <span className={`tag ${isResolved ? 'tag-green' : isInProgress ? 'tag-amber' : 'tag-stone'}`}>
                      {issue.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                    {issue.title}
                  </h3>

                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '8px', flexWrap: 'wrap' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <MapPin size={12} />
                      <strong>{issue.location}</strong>
                    </span>
                    <span>&bull;</span>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={12} />
                      {new Date(issue.submittedAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                    </span>
                    <span>&bull;</span>
                    <span>{issue.reportedBy}</span>
                  </div>

                  <p style={{ fontSize: '0.86rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '12px' }}>
                    {issue.description}
                  </p>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '0.78rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>
                      Assigned: <strong style={{ color: 'var(--navy-dark)' }}>{issue.assignedCommittee}</strong>
                    </span>

                    <button 
                      className="btn btn-secondary"
                      style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                      onClick={() => setExpandedId(isExpanded ? null : issue.id)}
                    >
                      <span>Committee Updates ({issue.timeline?.length || 0})</span>
                      {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  </div>

                  {isExpanded && (
                    <div style={{ marginTop: '10px', background: 'var(--bg-subtle)', padding: '12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                        {issue.timeline?.map((step, idx) => (
                          <div key={idx} style={{ fontSize: '0.82rem', paddingBottom: '6px', borderBottom: idx < issue.timeline.length - 1 ? '1px dashed var(--border-light)' : 'none' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-dim)', marginBottom: '2px' }}>
                              <strong>{step.actor}</strong>
                              <span className="font-mono">{new Date(step.timestamp).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}</span>
                            </div>
                            <p style={{ color: 'var(--text-main)' }}>{step.note}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
