import React, { useState } from 'react';
import { 
  Bell, 
  Search, 
  Calendar, 
  AlertTriangle, 
  Building,
  CheckCircle2
} from 'lucide-react';

export default function Announcements({ announcements = [] }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = announcements.filter(item => {
    const matchesCat = filterCategory === 'All' || item.category.toLowerCase().includes(filterCategory.toLowerCase());
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(q) ||
      item.summary.toLowerCase().includes(q) ||
      item.issuedBy.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Announcements</h1>
          <p>Official department circulars, fee concession notices, and student welfare bulletins.</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-shelf">
        <div className="filter-group">
          {['All', 'Academic Welfare', 'Scholarships', 'Student Welfare', 'Safety Notice'].map((cat) => (
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
          <Search size={15} />
          <input
            type="text"
            placeholder="Search circulars, notifications..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Bulletins List */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {filtered.map((item) => (
          <div 
            key={item.id} 
            className="card"
            style={{ 
              borderLeft: `4px solid ${item.urgent ? 'var(--red-crimson)' : 'var(--navy-primary)'}`,
              padding: '18px' 
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span className={`tag ${item.urgent ? 'tag-red' : 'tag-navy'}`}>
                  {item.urgent && <AlertTriangle size={12} />}
                  {item.urgent ? 'Urgent Circular' : item.category}
                </span>
                <span className="tag tag-stone font-mono">
                  {item.id}
                </span>
              </div>

              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Calendar size={13} />
                {item.date}
              </span>
            </div>

            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '8px' }}>
              {item.title}
            </h3>

            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: '1.5', marginBottom: '14px' }}>
              {item.summary}
            </p>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-light)', fontSize: '0.8rem', color: 'var(--text-dim)' }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Building size={13} color="var(--navy-primary)" />
                Authority: <strong style={{ color: 'var(--navy-dark)' }}>{item.issuedBy}</strong>
              </span>

              <span style={{ color: 'var(--green-forest)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> Verified Official Notice
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
