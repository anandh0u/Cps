import React, { useState } from 'react';
import { 
  GraduationCap, 
  Search, 
  ExternalLink, 
  CheckCircle2, 
  IndianRupee
} from 'lucide-react';

export default function Scholarships({ scholarships = [] }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const filtered = scholarships.filter(item => {
    const matchesCat = filterCategory === 'All' || item.category.toLowerCase().includes(filterCategory.toLowerCase());
    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm ||
      item.name.toLowerCase().includes(q) ||
      item.provider.toLowerCase().includes(q) ||
      item.eligibility.toLowerCase().includes(q);

    return matchesCat && matchesSearch;
  });

  return (
    <div>
      <div className="page-title-row">
        <div>
          <h1>Scholarships &amp; Financial Support</h1>
          <p>Curated repository of 50+ college, state, central government, and corporate CSR scholarships for GEC Thrissur students (Source: Genome GECT &amp; Welfare Desk).</p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-shelf">
        <div className="filter-group">
          {['All', 'College & GECT Scholarships', 'National Scholarship Portal (NSP)', 'State & Central Government', 'Corporate & CSR Grants', 'Special & Alumni Aid'].map((cat) => (
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
            placeholder="Search 50+ scholarships by name, tag, or eligibility..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Cards Grid */}
      <div className="grid-2" style={{ gap: '18px' }}>
        {filtered.map((item) => (
          <div key={item.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
                <span className="tag tag-stone">
                  {item.category}
                </span>
                <span className="tag tag-amber font-mono">
                  Deadline: {item.deadline}
                </span>
              </div>

              <h3 style={{ fontSize: '1.05rem', color: 'var(--navy-dark)', marginBottom: '3px' }}>
                {item.name}
              </h3>
              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', marginBottom: '10px' }}>
                Administered by: <strong>{item.provider}</strong>
              </p>

              <div style={{ background: 'var(--navy-subtle)', padding: '7px 10px', borderRadius: 'var(--radius-sm)', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <IndianRupee size={14} color="var(--navy-primary)" />
                <span style={{ fontSize: '0.86rem', fontWeight: 700, color: 'var(--navy-dark)' }}>
                  {item.amount}
                </span>
              </div>

              <div style={{ marginBottom: '10px' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: '2px' }}>
                  Eligibility:
                </span>
                <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                  {item.eligibility}
                </p>
              </div>

              {item.documents && item.documents.length > 0 && (
                <div>
                  <span style={{ fontSize: '0.72rem', fontWeight: 700, textTransform: 'uppercase', color: 'var(--text-dim)', display: 'block', marginBottom: '3px' }}>
                    Key Documents:
                  </span>
                  <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '2px', fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                    {item.documents.map((doc, idx) => (
                      <li key={idx} style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <CheckCircle2 size={12} color="var(--green-forest)" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              {item.tag && (
                <div style={{ marginTop: '6px' }}>
                  <span className="tag tag-stone" style={{ fontSize: '0.72rem', fontWeight: 600 }}>
                    Category Tag: {item.tag}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '10px', borderTop: '1px solid var(--border-light)', marginTop: '12px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ fontSize: '0.76rem', padding: '4px 8px' }}
                onClick={() => setActiveModalItem(item)}
              >
                Guidelines
              </button>

              <a
                href={item.applyUrl}
                target="_blank"
                rel="noreferrer"
                className="btn btn-primary"
                style={{ fontSize: '0.76rem', padding: '4px 10px' }}
              >
                <span>Portal Link</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        ))}
      </div>

      {/* Guidelines Modal */}
      {activeModalItem && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.4)', zIndex: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '16px' }} onClick={() => setActiveModalItem(null)}>
          <div className="card" style={{ maxWidth: '540px', width: '100%', maxHeight: '85vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h3 style={{ fontSize: '1.15rem', color: 'var(--navy-dark)', marginBottom: '4px' }}>{activeModalItem.name}</h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginBottom: '14px' }}>{activeModalItem.provider}</p>

            <div style={{ marginBottom: '12px', background: 'var(--bg-subtle)', padding: '10px', borderRadius: 'var(--radius-sm)' }}>
              <strong style={{ display: 'block', color: 'var(--navy-dark)' }}>Grant: {activeModalItem.amount}</strong>
              <span className="font-mono" style={{ fontSize: '0.8rem', color: 'var(--amber-warm)' }}>Deadline: {activeModalItem.deadline}</span>
            </div>

            <div style={{ marginBottom: '12px' }}>
              <h4 style={{ fontSize: '0.84rem', color: 'var(--navy-dark)', marginBottom: '2px' }}>Application Procedure</h4>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>{activeModalItem.guidelines}</p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '16px' }}>
              <button className="btn btn-secondary" onClick={() => setActiveModalItem(null)}>Close</button>
              <a href={activeModalItem.applyUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <span>Go to Portal</span>
                <ExternalLink size={12} />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
