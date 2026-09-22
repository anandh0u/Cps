import React, { useState } from 'react';
import { 
  Briefcase, 
  Search, 
  ExternalLink
} from 'lucide-react';

export default function Opportunities({ opportunities = [] }) {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');

  const filtered = opportunities.filter(item => {
    const matchesType = filterType === 'All' || item.type.toLowerCase().includes(filterType.toLowerCase());
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      item.title.toLowerCase().includes(q) ||
      item.organization.toLowerCase().includes(q) ||
      item.description.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Opportunities</h1>
          <p>Technical internships, research fellowships, and student competitions.</p>
        </div>
      </div>

      <div className="filter-shelf">
        <div className="filter-group">
          {['All', 'Internship', 'Competition', 'Fellowship'].map((t) => (
            <button
              key={t}
              className={`filter-btn ${filterType === t ? 'active' : ''}`}
              onClick={() => setFilterType(t)}
            >
              {t === 'All' ? 'All' : t}
            </button>
          ))}
        </div>

        <div className="search-field">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search opportunity..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid-2" style={{ gap: '18px' }}>
        {filtered.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span className="tag tag-stone">
                  {item.type}
                </span>
                <span className="tag tag-amber font-mono">
                  Deadline: {item.deadline}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-dark)', marginBottom: '3px' }}>
                {item.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--navy-primary)', fontWeight: 600, marginBottom: '10px' }}>
                {item.organization}
              </p>

              <div style={{ background: 'var(--bg-subtle)', padding: '6px 10px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', marginBottom: '10px', fontSize: '0.8rem' }}>
                <span style={{ color: 'var(--text-dim)', fontSize: '0.72rem', textTransform: 'uppercase', fontWeight: 700, display: 'block' }}>
                  Stipend / Prize:
                </span>
                <strong style={{ color: 'var(--green-forest)' }}>{item.stipend}</strong>
              </div>

              <p style={{ fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.45', marginBottom: '10px' }}>
                {item.description}
              </p>

              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '4px' }}>
                <strong style={{ color: 'var(--navy-dark)' }}>Location:</strong> {item.location}
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <strong style={{ color: 'var(--navy-dark)' }}>Eligibility:</strong> {item.eligibility}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', paddingTop: '10px', borderTop: '1px solid var(--border-light)', marginTop: '12px' }}>
              <a
                href={item.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '0.78rem', padding: '5px 12px' }}
              >
                <span>Apply Link</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
