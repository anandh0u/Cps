import React, { useState } from 'react';
import { 
  BellRing, 
  Search, 
  Calendar, 
  FileText, 
  AlertTriangle, 
  ExternalLink,
  ShieldAlert,
  Building
} from 'lucide-react';

export default function Updates({ updates = [] }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUpdates = updates.filter(item => {
    const matchesCat = filterCategory === 'All' || item.category.toLowerCase().includes(filterCategory.toLowerCase());
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.issuedBy.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingBottom: '50px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-kicker">
            <BellRing size={14} />
            <span>Official Circulars & Bulletin</span>
          </div>
          <h1 className="page-title">College & Department Updates</h1>
          <p className="page-subtitle">
            Authentic announcements from GEC Thrissur Exam Cell, KTU notifications, placement schedules, and department laboratory circulars.
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {['All', 'Exam Cell', 'Department', 'Placement', 'Scholarship', 'Lab Notice'].map(cat => {
            const raw = cat === 'All' ? 'All' : cat;
            return (
              <button
                key={cat}
                className={`filter-tab-btn ${filterCategory === raw ? 'active' : ''}`}
                onClick={() => setFilterCategory(raw)}
              >
                {cat === 'All' ? 'All Bulletins' : cat}
              </button>
            );
          })}
        </div>

        <div className="search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search circulars, exam cell..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notices List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filteredUpdates.map(item => {
          const isUrgent = item.importance === 'Urgent';
          const isImportant = item.importance === 'Important';

          return (
            <div 
              key={item.id} 
              className="card"
              style={{
                borderLeft: `4px solid ${isUrgent ? '#dc2626' : isImportant ? '#d97706' : '#0284c7'}`
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '8px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                  <span className={`badge ${isUrgent ? 'badge-red' : isImportant ? 'badge-amber' : 'badge-blue'}`}>
                    {isUrgent && <AlertTriangle size={12} />}
                    {item.importance} Notice
                  </span>
                  <span className="badge badge-slate">
                    {item.category}
                  </span>
                </div>

                <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Calendar size={13} /> {item.date}
                </span>
              </div>

              <h3 style={{ fontSize: '1.18rem', color: 'var(--blue-navy)', marginBottom: '8px' }}>
                {item.title}
              </h3>

              <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
                {item.summary}
              </p>

              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                paddingTop: '10px', 
                borderTop: '1px solid #e2e8f0',
                fontSize: '0.8rem'
              }}>
                <span style={{ color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                  <Building size={13} color="var(--blue-primary)" />
                  Issued By: <strong style={{ color: 'var(--text-main)' }}>{item.issuedBy}</strong>
                </span>

                <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Ref: {item.id}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
