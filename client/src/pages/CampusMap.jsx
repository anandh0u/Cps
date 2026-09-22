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
  Sparkles
} from 'lucide-react';

export default function CampusMap() {
  const [activeTab, setActiveTab] = useState('3d-map'); // '3d-map' | 'photo-signboard'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocationId, setActiveLocationId] = useState(31); // Default to #31 (Robotics / CPS)
  const [zoomLevel, setZoomLevel] = useState(1);

  // All 41 official campus locations from the GEC Thrissur Signboard
  const allLocations = [
    // ACADEMIC AND ADMINISTRATION (1-19)
    { id: 1, name: 'Administrative Block', category: 'Academic & Administration', catKey: 'acad', x: 260, y: 390, w: 75, h: 40, desc: "Office of the Principal, Academic Sections, Accounts, Student Welfare & Admissions Office.", highlight: false },
    { id: 2, name: 'Civil Engineering Block', category: 'Academic & Administration', catKey: 'acad', x: 210, y: 340, w: 70, h: 36, desc: 'Civil Department lecture halls, classrooms, seminar hall, and faculty chambers.', highlight: false },
    { id: 3, name: 'Civil Engineering Lab Block', category: 'Academic & Administration', catKey: 'acad', x: 140, y: 340, w: 60, h: 32, desc: 'Structural Engineering, Geotechnical, Surveying, and Material Testing labs.', highlight: false },
    { id: 4, name: 'Physical Education Department', category: 'Academic & Administration', catKey: 'acad', x: 145, y: 440, w: 50, h: 30, desc: 'Sports Directorate, gymnasium equipment, indoor fitness, and sports council.', highlight: false },
    { id: 5, name: 'NSS Office', category: 'Academic & Administration', catKey: 'acad', x: 195, y: 470, w: 42, h: 26, desc: 'National Service Scheme Technical Cell (GECT units 101 & 102).', highlight: false },
    { id: 6, name: 'Ideator / Innovation Hub', category: 'Academic & Administration', catKey: 'acad', x: 140, y: 290, w: 45, h: 28, desc: 'Student innovation centre, prototyping sandbox, and startup ideation zone.', highlight: false },
    { id: 7, name: 'Academic Block', category: 'Academic & Administration', catKey: 'acad', x: 280, y: 330, w: 65, h: 35, desc: 'General engineering classrooms, basic science departments, and lecture halls.', highlight: false },
    { id: 8, name: 'Electrical Extension Lab Block', category: 'Academic & Administration', catKey: 'acad', x: 350, y: 330, w: 55, h: 32, desc: 'Electrical machine testing, power electronics, and drives extension lab.', highlight: false },
    { id: 9, name: 'Civil Environment Lab', category: 'Academic & Administration', catKey: 'acad', x: 190, y: 250, w: 50, h: 30, desc: 'Environmental Engineering, Water analysis, and Environmental Pollution control lab.', highlight: false },
    { id: 10, name: 'Mechanical Block', category: 'Academic & Administration', catKey: 'acad', x: 280, y: 250, w: 85, h: 42, desc: 'Mechanical Department headquarters, CAD/CAM design centre, and faculty rooms.', highlight: false },
    { id: 11, name: 'Mechanical Engineering Lab Block', category: 'Academic & Administration', catKey: 'acad', x: 380, y: 250, w: 75, h: 38, desc: 'Fluid mechanics, Thermal engineering, Heat engines, and Refrigeration testing labs.', highlight: false },
    { id: 12, name: 'Production Engineering Lab', category: 'Academic & Administration', catKey: 'acad', x: 470, y: 250, w: 65, h: 36, desc: 'Machine shop, Foundry, Welding, Metrology, and CNC machining lab.', highlight: false },
    { id: 13, name: 'Electrical Engineering Block', category: 'Academic & Administration', catKey: 'acad', x: 200, y: 190, w: 80, h: 42, desc: 'Electrical & Electronics Department, High Voltage Lab, and Systems Simulation Lab.', highlight: false },
    { id: 14, name: 'Chemical Engineering Block', category: 'Academic & Administration', catKey: 'acad', x: 290, y: 190, w: 75, h: 38, desc: 'Chemical Engineering Department, Reaction kinetics, Mass Transfer, and Process labs.', highlight: false },
    { id: 15, name: 'Production Engineering Block', category: 'Academic & Administration', catKey: 'acad', x: 380, y: 190, w: 70, h: 38, desc: 'Production Engineering department, Industrial robotics, and Ergonomics lab.', highlight: false },
    { id: 16, name: 'Computer Science Block', category: 'Academic & Administration', catKey: 'acad', x: 470, y: 190, w: 80, h: 42, desc: 'Computer Science & Engineering Department, HPC cluster, Network and Software Labs.', highlight: false },
    { id: 17, name: 'Electronics & Communication Block', category: 'Academic & Administration', catKey: 'acad', x: 560, y: 190, w: 80, h: 42, desc: 'ECE Department, DSP labs, Microwave/Antenna lab, and VLSI design centre.', highlight: false },
    { id: 18, name: 'School of Architecture', category: 'Academic & Administration', catKey: 'acad', x: 650, y: 190, w: 65, h: 40, desc: 'Department of Architecture, Design studios, Climatology lab, and Exhibition hall.', highlight: false },
    { id: 19, name: 'P.G. and MCA Block', category: 'Academic & Administration', catKey: 'acad', x: 570, y: 260, w: 75, h: 40, desc: 'Postgraduate research, Computer Applications, and advanced technical laboratories.', highlight: false },

    // CENTRAL FACILITIES (20-38)
    { id: 20, name: 'College Canteen', category: 'Central Facilities', catKey: 'fac', x: 490, y: 340, w: 60, h: 35, desc: 'Central student cooperative canteen, dining hall, and refreshments.', highlight: false },
    { id: 21, name: 'Post Office and Bank Building', category: 'Central Facilities', catKey: 'fac', x: 440, y: 440, w: 55, h: 30, desc: 'Sub-post office (Thrissur-9) and State Bank of India campus branch & ATM.', highlight: false },
    { id: 22, name: 'Central Computing Facility (CCF)', category: 'Central Facilities', catKey: 'fac', x: 520, y: 440, w: 70, h: 38, desc: 'High-speed gigabit computing facility, university portal servers, and campus LAN hub.', highlight: false },
    { id: 23, name: 'Central Library', category: 'Central Facilities', catKey: 'fac', x: 430, y: 380, w: 70, h: 42, desc: 'Over 75,000 engineering volumes, IEEE digital access, and open study halls.', highlight: false },
    { id: 24, name: 'PTA Office', category: 'Central Facilities', catKey: 'fac', x: 380, y: 390, w: 42, h: 26, desc: 'Parent Teacher Association administrative office and student welfare desk.', highlight: false },
    { id: 25, name: 'Alumni Office (GECTAA)', category: 'Central Facilities', catKey: 'fac', x: 340, y: 440, w: 50, h: 28, desc: 'GEC Thrissur Alumni Association, scholarship funds, and global chapter office.', highlight: false },
    { id: 26, name: 'Training and Placement Cell (CGPC)', category: 'Central Facilities', catKey: 'fac', x: 510, y: 390, w: 65, h: 34, desc: 'Career Guidance & Placement Cell, interview suites, and pre-placement training.', highlight: false },
    { id: 27, name: 'Millennium Auditorium', category: 'Central Facilities', catKey: 'fac', x: 600, y: 340, w: 85, h: 45, desc: '1,500-seat central auditorium for convocation, tech fests, and cultural events.', highlight: false },
    { id: 28, name: 'General Store', category: 'Central Facilities', catKey: 'fac', x: 670, y: 390, w: 45, h: 26, desc: 'Stationery, record note books, blueprints, and drawing supplies store.', highlight: false },
    { id: 29, name: 'Store', category: 'Central Facilities', catKey: 'fac', x: 725, y: 390, w: 42, h: 26, desc: 'Central store and equipment intake warehouse.', highlight: false },
    { id: 30, name: 'Gloria Gopi Kumar Alumni Hall', category: 'Central Facilities', catKey: 'fac', x: 600, y: 400, w: 60, h: 32, desc: 'Air-conditioned seminar and guest conference hall.', highlight: false },
    { 
      id: 31, 
      name: 'Nodal Center for Robotics & AI (CPS Hub)', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 655, 
      y: 260, 
      w: 80, 
      h: 44, 
      desc: 'Advanced Robotics and Cyber Physical Systems laboratory research facility, IoT sensor networks, and robotic manipulators.', 
      highlight: true 
    },
    { id: 32, name: 'Technology Business Incubator (TBI)', category: 'Central Facilities', catKey: 'fac', x: 745, y: 260, w: 70, h: 38, desc: 'DST-funded startup incubator, student entrepreneurship cells, and patents office.', highlight: false },
    { id: 33, name: 'Eastern Amphitheatre', category: 'Central Facilities', catKey: 'fac', x: 695, y: 330, w: 50, h: 35, desc: 'Open-air amphitheatre for student debates, club gatherings, and performances.', highlight: false },
    { id: 34, name: 'ITC & SR, GEC', category: 'Central Facilities', catKey: 'fac', x: 755, y: 330, w: 55, h: 32, desc: 'Industry Training Centre & Social Responsibility Cell.', highlight: false },
    { id: 35, name: 'Centre for Nano Materials', category: 'Central Facilities', catKey: 'fac', x: 820, y: 330, w: 65, h: 35, desc: 'State-of-the-art nanotechnology and materials science research centre.', highlight: false },
    { id: 36, name: 'Hockey Ground', category: 'Central Facilities', catKey: 'fac', x: 135, y: 510, w: 90, h: 55, desc: 'Full-sized hockey turf and collegiate tournament grounds.', highlight: false },
    { id: 37, name: 'Multipurpose Sports Complex', category: 'Central Facilities', catKey: 'fac', x: 235, y: 510, w: 70, h: 42, desc: 'Indoor badminton, table tennis, and sports training pavilion.', highlight: false },
    { id: 38, name: 'College Stadium & Pavilion', category: 'Central Facilities', catKey: 'fac', x: 370, y: 490, w: 140, h: 100, desc: 'Central green 400m athletic track, football field, and spectators pavilion.', highlight: false },

    // RESIDENTIAL AREA (39-41)
    { id: 39, name: "Mens Hostel (MH)", category: 'Residential Area', catKey: 'res', x: 550, y: 510, w: 100, h: 65, desc: "Men's Hostels (MH 1, 2, 3) with twin X-shaped residential wings, mess, and common rooms.", highlight: false },
    { id: 40, name: 'Ladies Hostel (LH)', category: 'Residential Area', catKey: 'res', x: 670, y: 510, w: 90, h: 60, desc: "Ladies' Hostels (LH 1 & 2), secure residential campus sector with private dining mess.", highlight: false },
    { id: 41, name: 'Staff Quarters & Faculty Residences', category: 'Residential Area', catKey: 'res', x: 780, y: 470, w: 110, h: 80, desc: 'Residential quarters for professors, resident tutors, and campus administrative staff.', highlight: false }
  ];

  const filtered = allLocations.filter(loc => {
    const matchesCat = selectedCategory === 'All' || loc.category === selectedCategory;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !searchQuery ||
      loc.name.toLowerCase().includes(q) ||
      loc.id.toString() === q ||
      loc.desc.toLowerCase().includes(q);
    return matchesCat && matchesSearch;
  });

  const activeLoc = allLocations.find(l => l.id === activeLocationId) || allLocations[0];

  return (
    <div>
      {/* Title Bar */}
      <div className="page-title-row">
        <div>
          <h1>GEC Thrissur &bull; Campus Master Map &amp; 3D Navigator</h1>
          <p>Official 41-landmark directory and interactive 3D layout of Government Engineering College Thrissur.</p>
        </div>

        {/* View Mode Toggle Tabs */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button
            className={`btn ${activeTab === '3d-map' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('3d-map')}
          >
            <Compass size={14} />
            <span>Interactive 3D Map</span>
          </button>
          <button
            className={`btn ${activeTab === 'photo-signboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('photo-signboard')}
          >
            <Eye size={14} />
            <span>Original Signboard Photo</span>
          </button>
        </div>
      </div>

      {/* VIEW 1: INTERACTIVE 3D ISOMETRIC CAMPUS MAP */}
      {activeTab === '3d-map' && (
        <div className="card" style={{ padding: '16px', marginBottom: '24px', overflow: 'hidden' }}>
          {/* Controls Bar */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px', marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#1e3a8a', display: 'inline-block' }}></span>
                <span>Academic &amp; Admin (1-19)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#c2410c', display: 'inline-block' }}></span>
                <span>Central Facilities (20-38)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                <span style={{ width: '12px', height: '12px', borderRadius: '2px', background: '#0f766e', display: 'inline-block' }}></span>
                <span>Residential / Hostels (39-41)</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.78rem', color: 'var(--amber-warm)', fontWeight: 700 }}>
                <Sparkles size={13} />
                <span>#31 CPS / Robotics Hub</span>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                onClick={() => setZoomLevel(Math.max(0.8, zoomLevel - 0.15))}
              >
                <ZoomOut size={13} />
              </button>
              <span className="font-mono" style={{ fontSize: '0.78rem', minWidth: '42px', textAlign: 'center' }}>
                {Math.round(zoomLevel * 100)}%
              </span>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                onClick={() => setZoomLevel(Math.min(1.8, zoomLevel + 0.15))}
              >
                <ZoomIn size={13} />
              </button>
              <button 
                className="btn btn-secondary" 
                style={{ padding: '4px 8px', fontSize: '0.76rem' }}
                onClick={() => setZoomLevel(1)}
              >
                <RotateCcw size={13} />
              </button>
            </div>
          </div>

          {/* Interactive 3D SVG Map Viewport */}
          <div style={{ 
            background: 'linear-gradient(180deg, #f8fafc 0%, #edf2f7 100%)', 
            borderRadius: 'var(--radius-md)', 
            border: '1px solid var(--border-medium)',
            position: 'relative',
            overflow: 'auto',
            maxHeight: '520px'
          }}>
            <svg 
              viewBox="0 0 1000 640" 
              style={{ 
                width: `${100 * zoomLevel}%`, 
                minWidth: '900px', 
                height: 'auto',
                display: 'block',
                transition: 'width 0.15s ease'
              }}
            >
              <defs>
                {/* 3D Shadows */}
                <filter id="buildingShadow" x="-10%" y="-10%" width="130%" height="130%">
                  <feDropShadow dx="3" dy="5" stdDeviation="4" floodOpacity="0.22" floodColor="#0f172a" />
                </filter>
                <filter id="highlightGlow" x="-20%" y="-20%" width="140%" height="140%">
                  <feDropShadow dx="0" dy="0" stdDeviation="6" floodOpacity="0.65" floodColor="#f59e0b" />
                </filter>
              </defs>

              {/* Campus Base Terrain / Land Plot */}
              <rect x="50" y="50" width="900" height="540" rx="20" fill="#f1f5f9" stroke="#cbd5e1" strokeWidth="2" />
              
              {/* Outer Boundary Wall (Based on signboard layout) */}
              <path 
                d="M 100,100 L 400,90 L 500,130 L 700,130 L 910,180 L 920,530 L 100,550 Z" 
                fill="#ffffff" 
                stroke="#94a3b8" 
                strokeWidth="2.5" 
                strokeDasharray="6,4"
              />

              {/* Surrounding Major Roads */}
              {/* Main South Road (To Viyyur / Ramavarmapuram) */}
              <rect x="70" y="560" width="860" height="28" fill="#475569" rx="4" />
              <text x="500" y="578" fill="#ffffff" fontSize="11" fontWeight="700" textAnchor="middle" letterSpacing="2">
                MAIN ROAD &bull; TO VIYYUR / RAMAVARMAPURAM
              </text>

              {/* West Road (To Vimala College / Pattikkad) */}
              <rect x="70" y="80" width="26" height="500" fill="#475569" rx="4" />
              <text x="83" y="320" fill="#ffffff" fontSize="10" fontWeight="700" textAnchor="middle" transform="rotate(-90 83,320)" letterSpacing="1">
                ROAD TO VIMALA COLLEGE / PATTIKKAD
              </text>

              {/* Internal Paved Ring Roads */}
              <path 
                d="M 120,410 L 400,410 L 400,310 L 780,310 L 780,450 L 550,450 L 550,560" 
                fill="none" 
                stroke="#94a3b8" 
                strokeWidth="14" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />
              <path 
                d="M 120,410 L 400,410 L 400,310 L 780,310 L 780,450 L 550,450 L 550,560" 
                fill="none" 
                stroke="#e2e8f0" 
                strokeWidth="10" 
                strokeLinecap="round" 
                strokeLinejoin="round" 
              />

              {/* Cross connection paths */}
              <path d="M 270,170 L 270,410" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <path d="M 460,170 L 460,410" fill="none" stroke="#e2e8f0" strokeWidth="8" />
              <path d="M 640,170 L 640,450" fill="none" stroke="#e2e8f0" strokeWidth="8" />

              {/* Green Grounds */}
              {/* Central Stadium & 400m Track (#38) */}
              <g transform="translate(360, 430)">
                {/* Athletic Track Oval */}
                <ellipse cx="65" cy="50" rx="60" ry="42" fill="#fed7aa" stroke="#f97316" strokeWidth="4" />
                <ellipse cx="65" cy="50" rx="50" ry="34" fill="#86efac" stroke="#22c55e" strokeWidth="2" />
                <text x="65" y="53" fill="#15803d" fontSize="10" fontWeight="800" textAnchor="middle">
                  38. STADIUM
                </text>
              </g>

              {/* Hockey Ground (#36) */}
              <rect x="135" y="475" width="85" height="50" rx="6" fill="#bbf7d0" stroke="#16a34a" strokeWidth="2" />
              <text x="177" y="504" fill="#15803d" fontSize="9" fontWeight="800" textAnchor="middle">
                36. HOCKEY GROUND
              </text>

              {/* Multipurpose Sports Complex (#37) */}
              <rect x="230" y="475" width="70" height="42" rx="4" fill="#fed7aa" stroke="#ea580c" strokeWidth="2" />
              <text x="265" y="500" fill="#9a3412" fontSize="9" fontWeight="800" textAnchor="middle">
                37. SPORTS
              </text>

              {/* ALL 41 BUILDINGS IN 3D ISOMETRIC PERSPECTIVE */}
              {allLocations.map((loc) => {
                const isSelected = activeLocationId === loc.id;
                const isCPS = loc.id === 31;
                
                // Color schemes according to GECT Map Legend:
                // Academic: Deep Navy (#1e3a8a)
                // Facilities: Warm Coral/Amber (#c2410c)
                // Residential: Teal/Green (#0f766e)
                let baseColor = loc.catKey === 'acad' ? '#1e3a8a' : loc.catKey === 'fac' ? '#c2410c' : '#0f766e';
                let topColor = loc.catKey === 'acad' ? '#3b82f6' : loc.catKey === 'fac' ? '#fb923c' : '#14b8a6';
                let sideColor = loc.catKey === 'acad' ? '#172554' : loc.catKey === 'fac' ? '#7c2d12' : '#134e4a';

                if (isCPS) {
                  baseColor = '#d97706';
                  topColor = '#fbbf24';
                  sideColor = '#78350f';
                }

                if (isSelected) {
                  topColor = '#facc15';
                  baseColor = '#eab308';
                }

                // 3D Extrusion Height
                const depth = isCPS ? 12 : 8;

                return (
                  <g 
                    key={loc.id} 
                    onClick={() => setActiveLocationId(loc.id)}
                    style={{ cursor: 'pointer' }}
                    filter={isSelected || isCPS ? "url(#highlightGlow)" : "url(#buildingShadow)"}
                  >
                    {/* 3D Isometric Extrusion (Bottom and Side Faces) */}
                    <path
                      d={`M ${loc.x} ${loc.y + loc.h} 
                          L ${loc.x + depth} ${loc.y + loc.h + depth} 
                          L ${loc.x + loc.w + depth} ${loc.y + loc.h + depth} 
                          L ${loc.x + loc.w + depth} ${loc.y + depth} 
                          L ${loc.x + loc.w} ${loc.y} 
                          L ${loc.x + loc.w} ${loc.y + loc.h} Z`}
                      fill={sideColor}
                    />

                    {/* Top Roof Face */}
                    <rect 
                      x={loc.x} 
                      y={loc.y} 
                      width={loc.w} 
                      height={loc.h} 
                      rx="3" 
                      fill={topColor} 
                      stroke={isSelected ? '#ffffff' : '#0f172a'} 
                      strokeWidth={isSelected ? '2' : '1'} 
                    />

                    {/* Building Number Pin Badge */}
                    <circle 
                      cx={loc.x + 14} 
                      cy={loc.y + 14} 
                      r="9" 
                      fill="#ffffff" 
                      stroke="#0f172a" 
                      strokeWidth="1.5" 
                    />
                    <text 
                      x={loc.x + 14} 
                      y={loc.y + 17.5} 
                      fill="#0f172a" 
                      fontSize="9" 
                      fontWeight="800" 
                      textAnchor="middle"
                    >
                      {loc.id}
                    </text>

                    {/* CPS Special Badge */}
                    {isCPS && (
                      <g transform={`translate(${loc.x + loc.w - 22}, ${loc.y - 12})`}>
                        <rect x="0" y="0" width="34" height="16" rx="3" fill="#b45309" stroke="#ffffff" strokeWidth="1" />
                        <text x="17" y="11" fill="#ffffff" fontSize="8" fontWeight="800" textAnchor="middle">CPS</text>
                      </g>
                    )}

                    {/* Short Building Name on Roof */}
                    <text 
                      x={loc.x + loc.w / 2} 
                      y={loc.y + loc.h / 2 + 3} 
                      fill={isSelected ? '#0f172a' : '#ffffff'} 
                      fontSize="8" 
                      fontWeight="700" 
                      textAnchor="middle"
                      style={{ pointerEvents: 'none' }}
                    >
                      {loc.name.length > 14 ? loc.name.slice(0, 12) + '..' : loc.name}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>

          {/* Active Landmark Detail Callout */}
          <div style={{ 
            marginTop: '16px', 
            background: '#ffffff', 
            border: activeLoc.highlight ? '2px solid var(--amber-warm)' : '1px solid var(--border-medium)', 
            borderRadius: 'var(--radius-md)', 
            padding: '16px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: '14px'
          }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <span className="tag font-mono" style={{ background: 'var(--navy-primary)', color: '#ffffff', fontWeight: 800 }}>
                  Building #{activeLoc.id}
                </span>
                <span className={`tag ${activeLoc.catKey === 'acad' ? 'tag-navy' : activeLoc.catKey === 'fac' ? 'tag-amber' : 'tag-green'}`}>
                  {activeLoc.category}
                </span>
                {activeLoc.highlight && (
                  <span className="tag tag-amber font-mono" style={{ fontWeight: 800 }}>
                    CPS Academic &amp; Research Hub
                  </span>
                )}
              </div>
              <h3 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)' }}>
                {activeLoc.name}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '2px', maxWidth: '750px' }}>
                {activeLoc.desc}
              </p>
            </div>

            <div style={{ display: 'flex', gap: '8px' }}>
              <span className="font-mono" style={{ fontSize: '0.82rem', background: 'var(--bg-subtle)', padding: '6px 12px', borderRadius: 'var(--radius-sm)', border: '1px solid var(--border-light)', color: 'var(--navy-dark)' }}>
                Coordinates: ({activeLoc.x}, {activeLoc.y})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* VIEW 2: ORIGINAL HIGH-RES SIGNBOARD PHOTO */}
      {activeTab === 'photo-signboard' && (
        <div className="card" style={{ padding: '20px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px', flexWrap: 'wrap', gap: '8px' }}>
            <div>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--navy-dark)' }}>
                Official Campus Map Signboard (GEC Thrissur)
              </h2>
              <p style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
                Photographed on-campus at GECT entrance plaza, with full verified building indexing.
              </p>
            </div>
            <a 
              href="/gec-campus-map-full.jpg" 
              target="_blank" 
              rel="noreferrer" 
              className="btn btn-secondary"
            >
              <ExternalLink size={13} />
              <span>Open Full Res in New Tab</span>
            </a>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '16px' }}>
            <div style={{ border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <strong style={{ display: 'block', padding: '8px 12px', background: 'var(--bg-subtle)', fontSize: '0.82rem', borderBottom: '1px solid var(--border-light)' }}>
                Full Campus Map with Indexed Legend
              </strong>
              <img 
                src="/gec-campus-map-full.jpg" 
                alt="GEC Thrissur Official Campus Map Signboard" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>

            <div style={{ border: '1px solid var(--border-medium)', borderRadius: 'var(--radius-sm)', overflow: 'hidden' }}>
              <strong style={{ display: 'block', padding: '8px 12px', background: 'var(--bg-subtle)', fontSize: '0.82rem', borderBottom: '1px solid var(--border-light)' }}>
                Close-up Vector Block Layout
              </strong>
              <img 
                src="/gec-campus-map-layout.jpg" 
                alt="GEC Thrissur Campus Layout Close-up" 
                style={{ width: '100%', height: 'auto', display: 'block' }}
              />
            </div>
          </div>
        </div>
      )}

      {/* FILTER AND SEARCH BAR FOR THE 41 LANDMARKS */}
      <div className="filter-shelf">
        <div className="filter-group">
          {['All', 'Academic & Administration', 'Central Facilities', 'Residential Area'].map(cat => (
            <button
              key={cat}
              className={`filter-btn ${selectedCategory === cat ? 'active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="search-field">
          <Search size={14} />
          <input
            type="text"
            placeholder="Search by building #, department, or facility name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      {/* 41-LOCATION COMPLETE DIRECTORY GRID */}
      <div className="grid-3" style={{ gap: '14px' }}>
        {filtered.map(loc => {
          const isSelected = activeLocationId === loc.id;
          return (
            <div
              key={loc.id}
              className="card"
              style={{
                padding: '14px',
                cursor: 'pointer',
                borderLeft: loc.highlight 
                  ? '4px solid var(--amber-warm)' 
                  : isSelected 
                  ? '4px solid var(--navy-primary)' 
                  : '4px solid transparent',
                background: isSelected ? 'var(--navy-subtle)' : '#ffffff',
                transition: 'all 0.12s ease'
              }}
              onClick={() => {
                setActiveLocationId(loc.id);
                if (activeTab !== '3d-map') setActiveTab('3d-map');
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <span className="tag font-mono" style={{ background: '#0f172a', color: '#ffffff', fontWeight: 800, fontSize: '0.72rem' }}>
                  #{loc.id}
                </span>
                <span className="tag tag-stone" style={{ fontSize: '0.68rem' }}>
                  {loc.category.split('&')[0]}
                </span>
              </div>

              <h4 style={{ fontSize: '0.92rem', color: 'var(--navy-dark)', marginBottom: '4px', lineHeight: 1.3 }}>
                {loc.name}
              </h4>

              <p style={{ fontSize: '0.78rem', color: 'var(--text-dim)', lineHeight: 1.4 }}>
                {loc.desc.slice(0, 85)}...
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
