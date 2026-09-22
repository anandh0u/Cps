import React, { useState } from 'react';
import { 
  Lightbulb, 
  Send, 
  ThumbsUp, 
  CheckCircle2
} from 'lucide-react';

export default function Suggestions({ suggestions = [], onRefresh }) {
  const [formData, setFormData] = useState({
    title: '',
    category: 'Lab Facilities',
    idea: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSuggestionSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!formData.title || !formData.idea) {
      setErrorMsg('Please provide a title and your suggestion.');
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch('/api/suggestions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (data.success) {
        setSubmitSuccess(true);
        setFormData({ title: '', category: 'Lab Facilities', idea: '' });
        if (onRefresh) onRefresh();
      } else {
        setErrorMsg(data.error || 'Failed to submit suggestion.');
      }
    } catch (err) {
      setErrorMsg('Network error submitting suggestion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleUpvote = async (id) => {
    try {
      await fetch(`/api/suggestions/${id}/upvote`, { method: 'POST' });
      if (onRefresh) onRefresh();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Student Suggestions</h1>
          <p>Submit ideas for department improvements, lab facilities, or activities. Reviewed by the committee.</p>
        </div>
      </div>

      <div className="grid-2" style={{ gap: '20px' }}>
        {/* Left Form */}
        <div>
          <div className="card" style={{ padding: '20px' }}>
            <h2 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
              Submit a Suggestion
            </h2>
            <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', marginBottom: '14px' }}>
              Ideas are submitted anonymously.
            </p>

            {submitSuccess && (
              <div style={{ background: 'var(--green-light)', border: '1px solid var(--green-border)', color: 'var(--green-forest)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '14px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <CheckCircle2 size={15} />
                <span>Suggestion submitted for committee review.</span>
              </div>
            )}

            {errorMsg && (
              <div style={{ background: 'var(--red-light)', border: '1px solid var(--red-border)', color: 'var(--red-crimson)', padding: '8px 12px', borderRadius: 'var(--radius-sm)', fontSize: '0.82rem', marginBottom: '14px' }}>
                {errorMsg}
              </div>
            )}

            <form onSubmit={handleSuggestionSubmit}>
              <div className="form-row">
                <label className="form-label">Title *</label>
                <input
                  type="text"
                  className="form-input"
                  placeholder="e.g. Open Lab Access on Saturdays..."
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  required
                />
              </div>

              <div className="form-row">
                <label className="form-label">Category</label>
                <select
                  className="form-select"
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                >
                  <option value="Lab Facilities">Lab Facilities & Equipment</option>
                  <option value="Curriculum & Workshops">Workshops & Seminars</option>
                  <option value="Student Resources">Component Lending Library</option>
                  <option value="Campus & Hostel">Hostel & Amenities</option>
                  <option value="General Welfare">General Student Welfare</option>
                </select>
              </div>

              <div className="form-row">
                <label className="form-label">Suggestion *</label>
                <textarea
                  className="form-textarea"
                  rows={4}
                  placeholder="Explain the idea and how it benefits students..."
                  value={formData.idea}
                  onChange={(e) => setFormData({ ...formData, idea: e.target.value })}
                  required
                />
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={isSubmitting}
                >
                  <Send size={14} />
                  <span>{isSubmitting ? 'Posting...' : 'Post Suggestion'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>

        {/* Right List */}
        <div>
          <h2 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '12px' }}>
            Submitted Suggestions ({suggestions.length})
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {suggestions.map((item) => {
              const isImplemented = item.status === 'Implemented';
              const isConsidered = item.status === 'Considered';

              return (
                <div key={item.id} className="card" style={{ padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '4px' }}>
                    <span className="tag tag-stone">
                      {item.category}
                    </span>

                    <span className={`tag ${isImplemented ? 'tag-green' : isConsidered ? 'tag-amber' : 'tag-navy'}`}>
                      {item.status}
                    </span>
                  </div>

                  <h3 style={{ fontSize: '1rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>
                    {item.title}
                  </h3>

                  <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '10px' }}>
                    {item.idea}
                  </p>

                  {item.officialResponse && (
                    <div style={{ background: 'var(--bg-subtle)', padding: '8px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', fontSize: '0.8rem', marginBottom: '10px' }}>
                      <strong style={{ color: 'var(--navy-dark)' }}>Committee Response: </strong>
                      <span style={{ color: 'var(--text-muted)' }}>{item.officialResponse}</span>
                    </div>
                  )}

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '0.76rem' }}>
                    <span style={{ color: 'var(--text-dim)' }}>
                      {new Date(item.submittedAt).toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>

                    <button
                      className="btn btn-secondary"
                      style={{ fontSize: '0.74rem', padding: '3px 8px' }}
                      onClick={() => handleUpvote(item.id)}
                    >
                      <ThumbsUp size={12} color="var(--navy-primary)" />
                      <span>Upvote ({item.upvotes})</span>
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
