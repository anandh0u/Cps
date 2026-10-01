import React, { useMemo, useState } from 'react';
import {
  BadgeIndianRupee,
  CheckCircle2,
  ExternalLink,
  Search,
  SlidersHorizontal,
  X
} from 'lucide-react';

const categories = [
  'All',
  'College & GECT Scholarships',
  'National Scholarship Portal (NSP)',
  'State & Central Government',
  'Corporate & CSR Grants',
  'Special & Alumni Aid'
];

const commonDocuments = [
  'Recent marksheet and current admission proof',
  'Income certificate, where the scheme requires it',
  'Government identity proof and student ID',
  'Applicant bank passbook with an active, seeded account',
  'Category, disability, service, or minority certificate if applicable'
];

function scholarshipDocuments(item) {
  if (item.documents?.length) return item.documents;
  const documents = [...commonDocuments];
  if (item.tag?.includes('FOR WOMEN')) documents.push('Declaration or certificate required by the women-student scheme');
  if (item.tag?.includes('MINORITY')) documents.push('Valid minority-community certificate');
  if (item.tag?.includes('SC/ST')) documents.push('Valid community certificate');
  return documents;
}

function supportLabel(amount) {
  return amount === 'Check Portal' ? 'Varies by scheme and course' : amount;
}

export default function Scholarships({ scholarships = [] }) {
  const [filterCategory, setFilterCategory] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortMode, setSortMode] = useState('name');
  const [activeModalItem, setActiveModalItem] = useState(null);

  const filtered = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    const list = scholarships.filter((item) => {
      const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
      const haystack = [item.name, item.provider, item.eligibility, item.tag, item.amount]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      return matchesCategory && (!query || haystack.includes(query));
    });

    return [...list].sort((a, b) => {
      if (sortMode === 'category') return a.category.localeCompare(b.category) || a.name.localeCompare(b.name);
      if (sortMode === 'deadline') return a.deadline.localeCompare(b.deadline) || a.name.localeCompare(b.name);
      return a.name.localeCompare(b.name);
    });
  }, [filterCategory, scholarships, searchTerm, sortMode]);

  return (
    <div className="scholarship-page">
      <div className="page-title-row scholarship-heading">
        <div>
          <span className="section-kicker">Scholarships</span>
          <h1>Scholarship Directory</h1>
          <p>Search schemes and open the official portal to apply.</p>
        </div>
        <a className="btn btn-secondary" href="https://scholarships.gov.in/All-Scholarships" target="_blank" rel="noreferrer">
          <span>National Scholarship Portal</span>
          <ExternalLink size={14} />
        </a>
      </div>

      <section className="scholarship-tools" aria-label="Scholarship search and filters">
        <label className="scholarship-search">
          <span>Search scholarships</span>
          <div className="scholarship-search-control">
            <Search size={16} />
            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              aria-label="Search scholarships by name, eligibility, amount, or provider"
            />
          </div>
        </label>

        <label className="scholarship-sort">
          <span><SlidersHorizontal size={14} /> Sort results</span>
          <select value={sortMode} onChange={(event) => setSortMode(event.target.value)}>
            <option value="name">Name A–Z</option>
            <option value="category">Funding group</option>
            <option value="deadline">Deadline label</option>
          </select>
        </label>

        <div className="scholarship-filters" role="group" aria-label="Filter by funding group">
          {categories.map((category) => (
            <button
              key={category}
              type="button"
              className={`filter-btn ${filterCategory === category ? 'active' : ''}`}
              onClick={() => setFilterCategory(category)}
            >
              {category === 'All' ? `All (${scholarships.length})` : category}
            </button>
          ))}
        </div>
      </section>

      <div className="scholarship-results-row">
        <strong>{filtered.length} scholarships</strong>
      </div>

      {filtered.length ? (
        <div className="scholarship-grid">
          {filtered.map((item) => (
            <article key={item.id} className="scholarship-card">
              <div>
                <p className="scholarship-category">{item.category}</p>
                <h2>{item.name}</h2>
                <p className="scholarship-provider">{item.provider}</p>
              </div>
              <div className="scholarship-facts">
                <div><span>Support</span><strong><BadgeIndianRupee size={15} />{supportLabel(item.amount)}</strong></div>
                <div><span>Usual closing window</span><strong>{item.deadline}</strong></div>
              </div>
              <div className="scholarship-eligibility">
                <span>Who can apply</span>
                <p>{item.eligibility}</p>
              </div>
              <div className="scholarship-card-actions">
                <button type="button" className="btn btn-secondary" onClick={() => setActiveModalItem(item)}>Requirements</button>
                <a href={item.applyUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                  <span>Official portal</span><ExternalLink size={13} />
                </a>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="scholarship-empty card">
          <Search size={22} />
          <h2>No matching scholarship</h2>
          <p>Try a broader keyword or choose another funding group.</p>
          <button type="button" className="btn btn-secondary" onClick={() => { setSearchTerm(''); setFilterCategory('All'); }}>Clear filters</button>
        </div>
      )}

      {activeModalItem && (
        <div className="scholarship-modal-backdrop" role="presentation" onClick={() => setActiveModalItem(null)}>
          <section className="scholarship-modal" role="dialog" aria-modal="true" aria-labelledby="scholarship-dialog-title" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="scholarship-modal-close" aria-label="Close scholarship details" onClick={() => setActiveModalItem(null)}><X size={18} /></button>
            <h2 id="scholarship-dialog-title">{activeModalItem.name}</h2>
            <p className="scholarship-provider">{activeModalItem.provider}</p>
            <div className="scholarship-modal-facts">
              <div><span>Support</span><strong>{supportLabel(activeModalItem.amount)}</strong></div>
              <div><span>Usual closing window</span><strong>{activeModalItem.deadline}</strong></div>
            </div>
            <div className="scholarship-modal-section">
              <h3>Eligibility summary</h3>
              <p>{activeModalItem.eligibility}</p>
            </div>
            <div className="scholarship-modal-section">
              <h3>Prepare these documents</h3>
              <ul>
                {scholarshipDocuments(activeModalItem).map((document) => (
                  <li key={document}><CheckCircle2 size={15} /><span>{document}</span></li>
                ))}
              </ul>
            </div>
            <div className="scholarship-modal-section application-steps">
              <h3>Application steps</h3>
              <ol>
                <li>Open the official portal and find the latest notification for this scheme.</li>
                <li>Confirm the current eligibility, award amount, deadline, and document format.</li>
                <li>Complete the application and keep the acknowledgement or registration number.</li>
                <li>Submit institute-verification documents to the college office if the scheme requests them.</li>
              </ol>
            </div>
            <div className="scholarship-modal-actions">
              <button type="button" className="btn btn-secondary" onClick={() => setActiveModalItem(null)}>Close</button>
              <a href={activeModalItem.applyUrl} target="_blank" rel="noreferrer" className="btn btn-primary">
                <span>Open official portal</span><ExternalLink size={13} />
              </a>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}
