import React, { useState, useRef } from 'react';
import { 
  MapPin, 
  Building2, 
  Navigation, 
  Layers, 
  Info, 
  Search,
  ExternalLink,
  Compass,
  Phone,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Eye,
  CheckCircle2,
  Sparkles,
  Bot,
  Map as MapIcon,
  ShieldCheck,
  GraduationCap
} from 'lucide-react';
import { campusBounds, campusRoads, campusGrounds, campusLandmarks } from '../data/campusMapData';

export default function CampusMap() {
  const [activeTab, setActiveTab] = useState('vector-map'); // 'vector-map' | 'signboard-reference'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocationId, setActiveLocationId] = useState(31); // Default to #31 (Robotics / CPS)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const mapContainerRef = useRef(null);

  // Filter landmarks
  const filteredLocations = campusLandmarks.filter(loc => {
    const matchesCat = 
      selectedCategory === 'All' ||
      (selectedCategory === 'Academic & Administration' && loc.catKey === 'acad') ||
      (selectedCategory === 'Central Facilities' && loc.catKey === 'fac') ||
      (selectedCategory === 'Residential Area' && loc.catKey === 'res') ||
      (selectedCategory === 'CPS Spotlight' && loc.highlight);

    const q = searchQuery.toLowerCase().trim();
    const matchesQuery = !q || 
      loc.name.toLowerCase().includes(q) ||
      loc.id.toString() === q ||
      loc.desc.toLowerCase().includes(q) ||
      loc.category.toLowerCase().includes(q);

    return matchesCat && matchesQuery;
  });

  const activeLoc = campusLandmarks.find(l => l.id === activeLocationId) || campusLandmarks[0];

  const handlePinClick = (loc) => {
    setActiveLocationId(loc.id);
  };

  const handleCardClick = (loc) => {
    setActiveLocationId(loc.id);
    if (mapContainerRef.current) {
      mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const getPinColor = (loc) => {
    if (loc.id === 31) return { bg: '#eab308', text: '#000000', ring: '#ca8a04', badge: 'tag-amber' }; // Gold for CPS
    if (loc.catKey === 'acad') return { bg: '#1e40af', text: '#ffffff', ring: '#1d4ed8', badge: 'tag-blue' }; // Royal Blue
    if (loc.catKey === 'fac') return { bg: '#ea580c', text: '#ffffff', ring: '#c2410c', badge: 'tag-amber' }; // Coral/Orange
    return { bg: '#0d9488', text: '#ffffff', ring: '#0f766e', badge: 'tag-stone' }; // Teal for Hostels & Quarters
  };

  return (
    <div>
      {/* Page Title & View Switcher */}
      <div className="page-title-row">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
            <span className="tag tag-blue" style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              True-North Geographic Layout &bull; Google Maps Aligned
            </span>
          </div>
          <h1>Government Engineering College Thrissur — Campus Map</h1>
          <p>
            Redesigned digital 2D architectural master map finalized using real Google Maps and OpenStreetMap coordinates. All 41 campus departments, Central Computing Facility (CCF), athletic stadium, and residential blocks accurately positioned with True North alignment.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === 'vector-map' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('vector-map')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Compass size={16} />
            <span>2D Interactive Map</span>
          </button>
          <button 
            className={`btn ${activeTab === 'signboard-reference' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('signboard-reference')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={16} />
            <span>Physical Signboard Reference</span>
          </button>
          <a
            href="https://www.google.com/maps/search/?api=1&query=Government+Engineering+College+Thrissur"
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-secondary"
            style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}
          >
            <ExternalLink size={15} />
            <span>Google Maps</span>
          </a>
        </div>
      </div>

      {/* CPS Department Spotlight Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.1) 0%, rgba(202, 138, 4, 0.05) 100%)', 
        border: '1px solid rgba(234, 179, 8, 0.35)',
        marginBottom: '20px',
        padding: '16px 20px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '12px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          <div style={{ 
            width: '44px', 
            height: '44px', 
            borderRadius: '10px', 
            background: 'var(--amber-bg)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            boxShadow: '0 2px 10px rgba(234, 179, 8, 0.25)'
          }}>
            <Bot size={24} style={{ color: 'var(--amber-text)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                Cyber Physical Systems (CPS) Department Location: #31
              </span>
              <span className="tag tag-amber" style={{ fontSize: '0.7rem' }}>
                Department Headquarters
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Situated at <strong>#31 Nodal Center for Robotics and AI (NCRAI)</strong>, directly north of the Central Library and Main Administrative Quadrangle (Lat: 10.5545° N, Lon: 76.2243° E).
            </p>
          </div>
        </div>

        <div style={{ display: 'flex', gap: '8px' }}>
          <button 
            className="btn btn-secondary"
            onClick={() => {
              setActiveTab('vector-map');
              setActiveLocationId(31);
              setZoomLevel(1.5);
              if (mapContainerRef.current) {
                mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
              }
            }}
            style={{ fontSize: '0.82rem', padding: '6px 14px', borderColor: 'rgba(234, 179, 8, 0.4)' }}
          >
            <Sparkles size={14} style={{ color: 'var(--amber-text)', marginRight: '4px' }} />
            Spotlight #31 on Map
          </button>
        </div>
      </div>

      {/* TAB 1: 2D VECTOR INTERACTIVE MAP */}
      {activeTab === 'vector-map' && (
        <>
          {/* Controls Bar */}
          <div className="filter-shelf" style={{ marginBottom: '14px' }}>
            <div className="filter-group">
              {['All', 'Academic & Administration', 'Central Facilities', 'Residential Area', 'CPS Spotlight'].map(cat => (
                <button
                  key={cat}
                  className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(cat)}
                >
                  {cat === 'All' ? 'All (41)' : cat}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
              {/* Zoom Controls */}
              <div style={{ display: 'inline-flex', alignItems: 'center', background: 'var(--bg-card)', border: '1px solid var(--border-color)', borderRadius: '6px', overflow: 'hidden' }}>
                <button 
                  onClick={() => setZoomLevel(prev => Math.min(prev + 0.25, 2.5))}
                  title="Zoom In"
                  style={{ background: 'transparent', border: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}
                >
                  <ZoomIn size={15} />
                </button>
                <span style={{ fontSize: '0.75rem', fontWeight: 600, padding: '0 4px', minWidth: '40px', textAlign: 'center', color: 'var(--text-muted)' }}>
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button 
                  onClick={() => setZoomLevel(prev => Math.max(prev - 0.25, 1))}
                  title="Zoom Out"
                  style={{ background: 'transparent', border: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-main)' }}
                >
                  <ZoomOut size={15} />
                </button>
                <button 
                  onClick={() => setZoomLevel(1)}
                  title="Reset Zoom"
                  style={{ background: 'transparent', borderLeft: '1px solid var(--border-color)', borderTop: 'none', borderRight: 'none', borderBottom: 'none', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center', color: 'var(--text-muted)' }}
                >
                  <RotateCcw size={14} />
                </button>
              </div>

              {/* Search Field */}
              <div className="search-field" style={{ minWidth: '220px' }}>
                <Search size={14} />
                <input 
                  type="text" 
                  placeholder="Search landmark, CCF, #..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Master 2D Vector Map Canvas Container */}
          <div 
            ref={mapContainerRef}
            className="card" 
            style={{ 
              padding: '0', 
              overflow: 'hidden', 
              position: 'relative', 
              background: '#0f172a', 
              border: '2px solid var(--border-color)',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          >
            {/* Map Top Bar with Compass and Legend */}
            <div style={{ 
              padding: '10px 16px', 
              background: 'var(--bg-card)', 
              borderBottom: '1px solid var(--border-color)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              fontSize: '0.82rem'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                {/* Compass Rose */}
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: '4px',
                  background: 'rgba(59, 130, 246, 0.1)',
                  padding: '3px 8px',
                  borderRadius: '4px',
                  border: '1px solid rgba(59, 130, 246, 0.3)'
                }}>
                  <Navigation size={14} style={{ transform: 'rotate(0deg)', color: '#3b82f6' }} />
                  <span style={{ fontWeight: 800, fontSize: '0.75rem', color: '#3b82f6' }}>N ↑ TRUE NORTH</span>
                </div>
                <span style={{ fontWeight: 700 }}>GEC Thrissur Digital 2D Campus Layout</span>
              </div>
              
              {/* Legend Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: '#1e40af', display: 'inline-block' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>1-19 Academic &amp; Admin</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: '#ea580c', display: 'inline-block' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>20-38 Central Facilities</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: '#0d9488', display: 'inline-block' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>39-41 Residential</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '50%', background: '#eab308', display: 'inline-block', boxShadow: '0 0 6px rgba(234, 179, 8, 0.8)' }} />
                  <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem', fontWeight: 600 }}>#31 CPS &amp; Robotics Hub</span>
                </div>
              </div>
            </div>

            {/* Scrollable / Zoomable Wrapper */}
            <div style={{ 
              overflow: 'auto', 
              maxHeight: '660px', 
              position: 'relative',
              background: '#090d16',
              cursor: zoomLevel > 1 ? 'grab' : 'default'
            }}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                minWidth: '950px',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {/* SVG Vector Campus Blueprint */}
                <svg
                  viewBox={`0 0 ${campusBounds.width} ${campusBounds.height}`}
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    background: '#0f172a'
                  }}
                >
                  <defs>
                    {/* Grid Pattern */}
                    <pattern id="campus-grid" width="40" height="40" patternUnits="userSpaceOnUse">
                      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
                    </pattern>

                    {/* Beacon glow for CPS #31 */}
                    <filter id="beacon-glow-2d" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="4" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* 1. Background Grid */}
                  <rect width="100%" height="100%" fill="#0f172a" />
                  <rect width="100%" height="100%" fill="url(#campus-grid)" />

                  {/* 2. Campus Grounds / Fields / Stadium */}
                  {campusGrounds.map((g, idx) => {
                    const isStadium = g.d.includes('683.5 418.0') || g.type === 'stadium' || g.name.includes('Main Ground');
                    const fill = isStadium ? 'rgba(16, 185, 129, 0.12)' : 'rgba(34, 197, 94, 0.08)';
                    const stroke = isStadium ? 'rgba(16, 185, 129, 0.4)' : 'rgba(34, 197, 94, 0.25)';
                    return (
                      <path
                        key={`ground-${idx}`}
                        d={g.d}
                        fill={fill}
                        stroke={stroke}
                        strokeWidth="1.5"
                      />
                    );
                  })}

                  {/* 3. Real Campus Road Network */}
                  {campusRoads.map((r, idx) => {
                    const isMain = r.hw === 'secondary' || r.name.includes('Viyyur') || r.name.includes('Cheroor');
                    const w = isMain ? 7 : 3.5;
                    return (
                      <g key={`road-${idx}`}>
                        {/* Road Base Underlay */}
                        <path
                          d={r.d}
                          fill="none"
                          stroke="#1e293b"
                          strokeWidth={w + 3}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                        {/* Road Surface */}
                        <path
                          d={r.d}
                          fill="none"
                          stroke={isMain ? '#475569' : '#334155'}
                          strokeWidth={w}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </g>
                    );
                  })}

                  {/* 4. Road Labels */}
                  <text x="600" y="735" fill="rgba(255, 255, 255, 0.4)" fontSize="11" fontWeight="700" letterSpacing="0.08em" textAnchor="middle">
                    ← VIYYUR / CHEROOR ROAD (SOUTH PERIMETER) →
                  </text>
                  <text x="618" y="300" fill="rgba(16, 185, 129, 0.6)" fontSize="13" fontWeight="800" letterSpacing="0.1em" textAnchor="middle">
                    GECT ATHLETIC STADIUM (#38)
                  </text>
                  <text x="960" y="150" fill="rgba(16, 185, 129, 0.6)" fontSize="11" fontWeight="700" letterSpacing="0.08em" textAnchor="middle">
                    HOCKEY GROUND (#36)
                  </text>
                  <text x="120" y="270" fill="rgba(13, 148, 136, 0.6)" fontSize="11" fontWeight="700" letterSpacing="0.08em" textAnchor="middle">
                    STAFF QUARTERS COLONY (#41)
                  </text>
                  <text x="470" y="180" fill="rgba(13, 148, 136, 0.6)" fontSize="11" fontWeight="700" letterSpacing="0.08em" textAnchor="middle">
                    MENS HOSTELS (#39)
                  </text>

                  {/* 5. Interactive Calibrated Landmarks (1-41) */}
                  {campusLandmarks.map((loc) => {
                    const isSelected = loc.id === activeLocationId;
                    const isHovered = hoveredLocation?.id === loc.id;
                    const isFiltered = filteredLocations.some(f => f.id === loc.id);
                    const colors = getPinColor(loc);
                    const isCPS = loc.id === 31;
                    const opacity = isFiltered ? 1 : 0.2;

                    return (
                      <g 
                        key={loc.id}
                        transform={`translate(${loc.x}, ${loc.y})`}
                        onClick={() => handlePinClick(loc)}
                        onMouseEnter={() => setHoveredLocation(loc)}
                        onMouseLeave={() => setHoveredLocation(null)}
                        style={{ cursor: 'pointer', opacity, transition: 'opacity 0.2s ease' }}
                      >
                        {/* Selected / Hover Ring */}
                        {(isSelected || isHovered) && (
                          <circle
                            r={isCPS ? 22 : 17}
                            fill="none"
                            stroke={isCPS ? '#eab308' : '#38bdf8'}
                            strokeWidth={isSelected ? 3 : 2}
                            strokeDasharray={isSelected ? 'none' : '3 2'}
                            style={{ animation: 'pulse 1.5s infinite' }}
                          />
                        )}

                        {/* Extra Beacon for CPS #31 */}
                        {isCPS && (
                          <circle
                            r={18}
                            fill="rgba(234, 179, 8, 0.4)"
                            filter="url(#beacon-glow-2d)"
                          />
                        )}

                        {/* Center Pin Circle */}
                        <circle
                          r={isCPS ? 13 : 10}
                          fill={colors.bg}
                          stroke="#ffffff"
                          strokeWidth={isCPS ? 2.5 : 1.5}
                          style={{
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: (isSelected || isHovered) ? 'scale(1.25)' : 'scale(1)',
                            transformOrigin: '0 0',
                            filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.5))'
                          }}
                        />

                        {/* Number Text inside circle */}
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={colors.text}
                          fontSize={isCPS ? '10px' : '9px'}
                          fontWeight="800"
                          fontFamily="monospace"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {loc.id}
                        </text>

                        {/* Hover / Focused Tooltip Card */}
                        {(isHovered || (isSelected && zoomLevel > 1.2)) && (
                          <g transform="translate(0, -22)" style={{ pointerEvents: 'none' }}>
                            <rect
                              x={-90}
                              y={-34}
                              width={180}
                              height={34}
                              rx={6}
                              fill="rgba(15, 23, 42, 0.95)"
                              stroke={isCPS ? '#eab308' : 'rgba(255, 255, 255, 0.25)'}
                              strokeWidth={1.5}
                            />
                            <text
                              x={0}
                              y={-20}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="10px"
                              fontWeight="700"
                            >
                              #{loc.id} {loc.name.length > 22 ? loc.name.slice(0, 20) + '...' : loc.name}
                            </text>
                            <text
                              x={0}
                              y={-8}
                              textAnchor="middle"
                              fill={isCPS ? '#fde047' : '#94a3b8'}
                              fontSize="8px"
                            >
                              {loc.category}
                            </text>
                          </g>
                        )}
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>

            {/* Bottom Status Bar */}
            <div style={{ 
              padding: '8px 16px', 
              background: 'var(--bg-card)', 
              borderTop: '1px solid var(--border-color)',
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              fontSize: '0.78rem',
              color: 'var(--text-muted)'
            }}>
              <span>
                Accurate True-North Layout. Click any numbered pinpoint on the map to inspect department details.
              </span>
              <span>
                Showing <strong>{filteredLocations.length}</strong> of 41 locations
              </span>
            </div>
          </div>

          {/* Active Landmark Detail Spotlight Card */}
          {activeLoc && (
            <div className="card" style={{ 
              marginBottom: '28px',
              borderLeft: `5px solid ${getPinColor(activeLoc).bg}`,
              background: 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px' }}>
                <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '50px', 
                    height: '50px', 
                    borderRadius: '10px', 
                    background: getPinColor(activeLoc).bg, 
                    color: getPinColor(activeLoc).text,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.3rem',
                    fontFamily: 'monospace',
                    boxShadow: '0 3px 10px rgba(0,0,0,0.2)',
                    flexShrink: 0
                  }}>
                    #{activeLoc.id}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{activeLoc.name}</h2>
                      <span className={`tag ${getPinColor(activeLoc).badge}`}>
                        {activeLoc.category}
                      </span>
                      {activeLoc.id === 31 && (
                        <span className="tag tag-amber font-mono">
                          ★ CPS Department Hub
                        </span>
                      )}
                      <span className="tag tag-stone font-mono" style={{ fontSize: '0.7rem' }}>
                        {activeLoc.lat.toFixed(4)}° N, {activeLoc.lon.toFixed(4)}° E
                      </span>
                    </div>

                    <p style={{ margin: '8px 0 0', color: 'var(--text-muted)', fontSize: '0.92rem', lineHeight: '1.55' }}>
                      {activeLoc.desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setZoomLevel(1.5);
                      if (mapContainerRef.current) {
                        mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    style={{ fontSize: '0.82rem', padding: '6px 12px' }}
                  >
                    <ZoomIn size={14} style={{ marginRight: '4px' }} />
                    Center &amp; Zoom
                  </button>

                  <a 
                    href={`https://www.google.com/maps/search/?api=1&query=${activeLoc.lat},${activeLoc.lon}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: '0.82rem', padding: '6px 12px', display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <ExternalLink size={14} />
                    <span>Open in Google Maps</span>
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* Directory of All 41 Locations (Cards Grid) */}
          <div style={{ marginBottom: '14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: '1.1rem', margin: 0 }}>
              Campus Landmark Directory ({filteredLocations.length} locations)
            </h2>
            <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
              Numbered 1 through 41 with verified Google Maps GPS coordinates
            </span>
          </div>

          <div className="grid-2" style={{ gap: '14px' }}>
            {filteredLocations.map(loc => {
              const colors = getPinColor(loc);
              const isSelected = loc.id === activeLocationId;
              const isCPS = loc.id === 31;

              return (
                <div 
                  key={loc.id}
                  className="card"
                  onClick={() => handleCardClick(loc)}
                  style={{ 
                    cursor: 'pointer',
                    display: 'flex', 
                    flexDirection: 'column', 
                    justifyContent: 'space-between',
                    border: isSelected 
                      ? `2px solid ${isCPS ? '#eab308' : 'var(--accent-primary)'}` 
                      : '1px solid var(--border-color)',
                    background: isSelected 
                      ? (isCPS ? 'rgba(234, 179, 8, 0.06)' : 'var(--bg-card)') 
                      : 'var(--bg-card)',
                    padding: '14px 16px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '28px', 
                          height: '28px', 
                          borderRadius: '6px', 
                          background: colors.bg, 
                          color: colors.text,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 800,
                          fontSize: '0.85rem',
                          fontFamily: 'monospace'
                        }}>
                          {loc.id}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600 }}>
                          {loc.name}
                        </h3>
                      </div>
                      
                      <span className={`tag ${colors.badge}`} style={{ fontSize: '0.7rem' }}>
                        {loc.category.split('&')[0].trim()}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                      {loc.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: isCPS ? 'var(--amber-text)' : 'var(--text-muted)', fontWeight: isCPS ? 700 : 500 }}>
                      {isCPS ? '★ CPS Department Hub' : `Index #${loc.id} &bull; ${loc.lat.toFixed(4)}° N`}
                    </span>
                    <span style={{ fontSize: '0.78rem', color: 'var(--accent-primary)', fontWeight: 600 }}>
                      {isSelected ? 'Currently Selected' : 'Locate on Map →'}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </>
      )}

      {/* TAB 2: PHYSICAL SIGNBOARD REFERENCE */}
      {activeTab === 'signboard-reference' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '16px 20px' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 6px' }}>Original Physical Campus Signboard (GECT)</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Photograph of the original physical campus signboard positioned near the college entrance gate. Note that some locations on this historical board (such as CCF #22 and the residential quadrant) differed in orientation compared to the real-world Google Maps geographic layout.
            </p>
          </div>

          {/* Full Signboard Photo */}
          <div className="card" style={{ padding: '0', overflow: 'hidden', textAlign: 'center', background: '#0f172a' }}>
            <img 
              src="/gec-campus-map-full.jpg" 
              alt="GEC Thrissur Campus Map Signboard" 
              style={{ width: '100%', maxHeight: '700px', objectFit: 'contain', display: 'block' }}
            />
          </div>

          {/* Master 41 Landmark Table */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', margin: '0 0 14px' }}>Official Campus Signboard Legend Table</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Column 1 */}
              <div>
                <h4 style={{ color: '#1e40af', borderBottom: '2px solid #1e40af', paddingBottom: '4px', margin: '0 0 10px' }}>
                  ACADEMIC AND ADMINISTRATION (1-19)
                </h4>
                <ol start={1} style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', lineHeight: '1.8' }}>
                  <li>Administrative Block</li>
                  <li>Civil Engineering Block</li>
                  <li>Civil Engineering Lab Block</li>
                  <li>Physical Education Department</li>
                  <li>NSS Office</li>
                  <li>Ideator</li>
                  <li>Academic Block</li>
                  <li>Electrical Extension Lab Block</li>
                  <li>Civil Environment Lab</li>
                  <li>Mechanical Block</li>
                  <li>Mechanical Engineering Lab Block</li>
                  <li>Production Engineering Lab</li>
                  <li>Electrical Engineering Block</li>
                  <li>Chemical Engineering Block</li>
                  <li>Production Engineering Block</li>
                  <li>Computer Science Block</li>
                  <li>Electronics &amp; Communication Block</li>
                  <li>School of Architecture</li>
                  <li>P.G and MCA Block</li>
                </ol>
              </div>

              {/* Column 2 */}
              <div>
                <h4 style={{ color: '#ea580c', borderBottom: '2px solid #ea580c', paddingBottom: '4px', margin: '0 0 10px' }}>
                  CENTRAL FACILITIES (20-38)
                </h4>
                <ol start={20} style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', lineHeight: '1.8' }}>
                  <li>College Canteen</li>
                  <li>Post Office and bank building</li>
                  <li>Central Computing Facility (CCF)</li>
                  <li>Central Library</li>
                  <li>PTA Office</li>
                  <li>Alumni Office</li>
                  <li>Training and Placement Cell</li>
                  <li>Millennium Auditorium</li>
                  <li>General store</li>
                  <li>Store</li>
                  <li>Gloria Gopi Kumar Alumni Hall</li>
                  <li><strong>Nodal center for Robotics and AI (CPS Hub)</strong></li>
                  <li>Technology Buisiness Incubator</li>
                  <li>Eastern Amphitheatre</li>
                  <li>ITC &amp; SR,CEC</li>
                  <li>Centre for Nano Materials</li>
                  <li>Hockey Ground</li>
                  <li>Multipurpose Sports Complex</li>
                  <li>Stadium</li>
                </ol>
              </div>

              {/* Column 3 */}
              <div>
                <h4 style={{ color: '#0d9488', borderBottom: '2px solid #0d9488', paddingBottom: '4px', margin: '0 0 10px' }}>
                  RESIDENTIAL AREA (39-41)
                </h4>
                <ol start={39} style={{ paddingLeft: '20px', margin: 0, fontSize: '0.85rem', lineHeight: '1.8' }}>
                  <li>Mens Hostel</li>
                  <li>Ladies Hostel</li>
                  <li>Staff Quarters</li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
