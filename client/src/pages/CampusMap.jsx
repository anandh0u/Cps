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
  Bot
} from 'lucide-react';

export default function CampusMap() {
  const [activeTab, setActiveTab] = useState('2d-map'); // '2d-map' | 'photo-signboard'
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLocationId, setActiveLocationId] = useState(31); // Default to #31 (Robotics / CPS)
  const [zoomLevel, setZoomLevel] = useState(1);
  const [hoveredLocation, setHoveredLocation] = useState(null);
  const mapContainerRef = useRef(null);

  // All 41 official campus locations from the GEC Thrissur Signboard with pixel-calibrated coordinates on the 905x327 master schematic
  const allLocations = [
    // ACADEMIC AND ADMINISTRATION (1-19) - Official Dark Blue
    { 
      id: 1, 
      name: 'Administrative Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 202, 
      y: 105, 
      desc: "Main Heritage Administrative Block housing the Principal's Office, Dean Academics, Student Welfare Directorate, Accounts, and University Examination Cell.", 
      highlight: false 
    },
    { 
      id: 2, 
      name: 'Civil Engineering Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 188, 
      y: 248, 
      desc: 'Civil Engineering Department lecture halls, classrooms, seminar hall, and faculty chambers.', 
      highlight: false 
    },
    { 
      id: 3, 
      name: 'Civil Engineering Lab Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 153, 
      y: 188, 
      desc: 'Structural Engineering, Geotechnical, Surveying, and Material Testing laboratories.', 
      highlight: false 
    },
    { 
      id: 4, 
      name: 'Physical Education Department', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 137, 
      y: 232, 
      desc: 'Physical education faculty offices, sports administration, athletics store, and fitness advisories.', 
      highlight: false 
    },
    { 
      id: 5, 
      name: 'NSS Office', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 82, 
      y: 168, 
      desc: 'National Service Scheme Technical Cell (GECT units 101 & 102) headquarters and student community cell.', 
      highlight: false 
    },
    { 
      id: 6, 
      name: 'Ideator', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 172, 
      y: 248, 
      desc: 'Student innovation centre, prototyping sandbox, design space, and competition workspace.', 
      highlight: false 
    },
    { 
      id: 7, 
      name: 'Academic Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 160, 
      y: 152, 
      desc: 'First-year engineering foundational lecture halls, basic science divisions, and mathematics faculty.', 
      highlight: false 
    },
    { 
      id: 8, 
      name: 'Electrical Extension Lab Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 114, 
      y: 98, 
      desc: 'Electrical machine testing, power electronics, sensor instrumentation, and drive extension labs.', 
      highlight: false 
    },
    { 
      id: 9, 
      name: 'Civil Environment Lab', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 98, 
      y: 138, 
      desc: 'Environmental Engineering, water quality analysis, effluent treatment, and environmental pollution control labs.', 
      highlight: false 
    },
    { 
      id: 10, 
      name: 'Mechanical Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 110, 
      y: 74, 
      desc: 'Mechanical Engineering Department headquarters, CAD/CAM design centre, automotive engineering lab, and departmental library.', 
      highlight: false 
    },
    { 
      id: 11, 
      name: 'Mechanical Engineering Lab Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 80, 
      y: 105, 
      desc: 'Fluid mechanics, Thermal engineering, Heat engines testing, and Refrigeration/AC research labs.', 
      highlight: false 
    },
    { 
      id: 12, 
      name: 'Production Engineering Lab', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 262, 
      y: 56, 
      desc: 'Central machine shop, Foundry, Welding bay, Metrology, and CNC precision machining labs.', 
      highlight: false 
    },
    { 
      id: 13, 
      name: 'Electrical Engineering Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 235, 
      y: 53, 
      desc: 'Electrical & Electronics Department, High Voltage Lab, Power Systems simulation, and Control Automation.', 
      highlight: false 
    },
    { 
      id: 14, 
      name: 'Chemical Engineering Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 285, 
      y: 38, 
      desc: 'Chemical Engineering Department, Reaction kinetics, Mass Transfer operations, and Process dynamics labs.', 
      highlight: false 
    },
    { 
      id: 15, 
      name: 'Production Engineering Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 326, 
      y: 90, 
      desc: 'Production Engineering department classrooms, Industrial robotics, and Ergonomics workstations.', 
      highlight: false 
    },
    { 
      id: 16, 
      name: 'Computer Science Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 410, 
      y: 90, 
      desc: 'Computer Science & Engineering Department, AI/ML research facilities, Network and Software Labs.', 
      highlight: false 
    },
    { 
      id: 17, 
      name: 'Electronics & Communication Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 463, 
      y: 92, 
      desc: 'ECE Department, DSP labs, Microwave/Antenna radiation lab, and VLSI design centre.', 
      highlight: false 
    },
    { 
      id: 18, 
      name: 'School of Architecture', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 505, 
      y: 95, 
      desc: 'Department of Architecture (B.Arch & M.Plan), design studios, climatology lab, and model exhibition hall.', 
      highlight: false 
    },
    { 
      id: 19, 
      name: 'P.G and MCA Block', 
      category: 'Academic & Administration', 
      catKey: 'acad', 
      x: 248, 
      y: 254, 
      desc: 'Postgraduate research, Computer Applications (MCA) department, and advanced technical laboratories.', 
      highlight: false 
    },

    // CENTRAL FACILITIES (20-38) - Official Coral
    { 
      id: 20, 
      name: 'College Canteen', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 44, 
      y: 136, 
      desc: 'Central student cooperative dining canteen, refreshments, meals, and snacks for students and faculty.', 
      highlight: false 
    },
    { 
      id: 21, 
      name: 'Post Office and bank building', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 37, 
      y: 202, 
      desc: 'Sub-post office (PIN: 680009) and State Bank of India (SBI) campus branch with 24x7 ATM counter.', 
      highlight: false 
    },
    { 
      id: 22, 
      name: 'Central Computing Facility', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 254, 
      y: 165, 
      desc: 'Central Computing Facility (CCF) providing 24x7 high-speed gigabit computing, server room, and online examination terminals.', 
      highlight: false 
    },
    { 
      id: 23, 
      name: 'Central Library', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 160, 
      y: 172, 
      desc: 'Over 75,000 engineering volumes, IEEE digital access terminals, reading halls, and reference sections.', 
      highlight: false 
    },
    { 
      id: 24, 
      name: 'PTA Office', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 195, 
      y: 197, 
      desc: 'Parent Teacher Association administrative office coordinating student amenities and welfare grants.', 
      highlight: false 
    },
    { 
      id: 25, 
      name: 'Alumni Office', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 205, 
      y: 197, 
      desc: 'GECT Alumni Association (GECTAA) secretariat coordinating alumni endowments, mentorship, and welfare bursaries.', 
      highlight: false 
    },
    { 
      id: 26, 
      name: 'Training and Placement Cell', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 230, 
      y: 200, 
      desc: 'Career Guidance & Placement Cell (CGPC) auditorium, interview suites, GD rooms, and recruiter hospitality suites.', 
      highlight: false 
    },
    { 
      id: 27, 
      name: 'Millennium Auditorium', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 205, 
      y: 165, 
      desc: 'Grand 1,500-seat central auditorium for convocation, cultural fests, national conferences, and union events.', 
      highlight: false 
    },
    { 
      id: 28, 
      name: 'General store', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 178, 
      y: 162, 
      desc: 'Student cooperative store for engineering drawing supplies, records, stationery, and notebooks.', 
      highlight: false 
    },
    { 
      id: 29, 
      name: 'Store', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 178, 
      y: 172, 
      desc: 'Central college store and equipment maintenance inventory depot.', 
      highlight: false 
    },
    { 
      id: 30, 
      name: 'Gloria Gopi Kumar Alumni Hall', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 535, 
      y: 160, 
      desc: 'Alumni-endowed conference hall and presentation facility for tech symposiums and academic seminars.', 
      highlight: false 
    },
    { 
      id: 31, 
      name: 'Nodal center for Robotics and AI', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 505, 
      y: 163, 
      desc: '★ Academic and research home of Cyber Physical System (CPS) Engineering, Industrial Automation, Robotic manipulators, Embedded Systems, and AI/IoT prototyping.', 
      highlight: true // CPS Spotlight!
    },
    { 
      id: 32, 
      name: 'Technology Buisiness Incubator', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 550, 
      y: 160, 
      desc: 'Technology Business Incubator (TBI GECT) fostering campus student startups, seed funding guidance, and intellectual property development.', 
      highlight: false 
    },
    { 
      id: 33, 
      name: 'Eastern Amphitheatre', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 538, 
      y: 185, 
      desc: 'Open-air theatre and gathering arena for cultural performances, student union meetings, and college festivals.', 
      highlight: false 
    },
    { 
      id: 34, 
      name: 'ITC & SR,CEC', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 485, 
      y: 178, 
      desc: 'Information Technology Centre & Social Responsibility / Continuing Education Cell providing vocational and technical upskilling.', 
      highlight: false 
    },
    { 
      id: 35, 
      name: 'Centre for Nano Materials', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 440, 
      y: 175, 
      desc: 'Interdisciplinary centre for advanced nanomaterials research, spectroscopy, material characterization, and nanotechnology research.', 
      highlight: false 
    },
    { 
      id: 36, 
      name: 'Hockey Ground', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 65, 
      y: 250, 
      desc: 'Official full-size campus hockey field and team pavilions adjacent to the western campus gate.', 
      highlight: false 
    },
    { 
      id: 37, 
      name: 'Multipurpose Sports Complex', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 475, 
      y: 175, 
      desc: 'Indoor sports complex with wooden badminton courts, table tennis, weight training gym, and changing rooms.', 
      highlight: false 
    },
    { 
      id: 38, 
      name: 'Stadium', 
      category: 'Central Facilities', 
      catKey: 'fac', 
      x: 335, 
      y: 205, 
      desc: 'Central sports stadium featuring a standard 400m athletic track, football ground, cricket pitch, and spectator galleries.', 
      highlight: false 
    },

    // RESIDENTIAL AREA (39-41) - Official Teal
    { 
      id: 39, 
      name: 'Mens Hostel', 
      category: 'Residential Area', 
      catKey: 'res', 
      x: 468, 
      y: 235, 
      desc: "Men's Hostels (MH 1, MH 2, MH 3, MH 4) featuring the iconic twin butterfly/X-wing architectural blocks, recreation halls, study rooms, and cooperative dining mess.", 
      highlight: false 
    },
    { 
      id: 40, 
      name: 'Ladies Hostel', 
      category: 'Residential Area', 
      catKey: 'res', 
      x: 888, 
      y: 245, 
      desc: "Ladies' Hostel complex (LH 1 & LH 2) with secured residential accommodation, study rooms, recreation centre, and dedicated dining facility.", 
      highlight: false 
    },
    { 
      id: 41, 
      name: 'Staff Quarters', 
      category: 'Residential Area', 
      catKey: 'res', 
      x: 730, 
      y: 230, 
      desc: 'Residential quarters and bungalows for faculty, administration officers, laboratory technical staff, and maintenance personnel.', 
      highlight: false 
    }
  ];

  // Filtering
  const filteredLocations = allLocations.filter(loc => {
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

  const activeLoc = allLocations.find(l => l.id === activeLocationId) || allLocations[0];

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
    if (loc.id === 31) return { bg: '#eab308', text: '#000000', ring: '#ca8a04' }; // Gold for CPS
    if (loc.catKey === 'acad') return { bg: '#1e3a8a', text: '#ffffff', ring: '#172554' }; // Deep Blue
    if (loc.catKey === 'fac') return { bg: '#ea580c', text: '#ffffff', ring: '#c2410c' }; // Coral/Orange
    return { bg: '#0d9488', text: '#ffffff', ring: '#0f766e' }; // Teal
  };

  return (
    <div>
      {/* Page Header */}
      <div className="page-title-row">
        <div>
          <h1>Government Engineering College Thrissur — Campus Map</h1>
          <p>
            Official 2D architectural campus layout analyzing the signboard master map and campus landmarks. All 41 official numbered departments, labs, facilities, and residential quarters accurately positioned.
          </p>
        </div>

        {/* View Switcher Tabs */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button 
            className={`btn ${activeTab === '2d-map' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('2d-map')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Compass size={16} />
            <span>2D Interactive Map</span>
          </button>
          <button 
            className={`btn ${activeTab === 'photo-signboard' ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setActiveTab('photo-signboard')}
            style={{ display: 'flex', alignItems: 'center', gap: '6px' }}
          >
            <Eye size={16} />
            <span>Signboard Photo &amp; Legend</span>
          </button>
        </div>
      </div>

      {/* CPS Spotlight Banner */}
      <div className="card" style={{ 
        background: 'linear-gradient(135deg, rgba(234, 179, 8, 0.08) 0%, rgba(202, 138, 4, 0.04) 100%)', 
        border: '1px solid rgba(234, 179, 8, 0.3)',
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
            width: '42px', 
            height: '42px', 
            borderRadius: '10px', 
            background: 'var(--amber-bg)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            border: '1px solid rgba(234, 179, 8, 0.4)',
            boxShadow: '0 2px 8px rgba(234, 179, 8, 0.2)'
          }}>
            <Bot size={22} style={{ color: 'var(--amber-text)' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontWeight: 700, fontSize: '0.98rem' }}>
                Cyber Physical Systems (CPS) Department Location: #31
              </span>
              <span className="tag tag-amber" style={{ fontSize: '0.7rem' }}>
                Key Landmark
              </span>
            </div>
            <p style={{ margin: '2px 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
              Located at <strong>#31 Nodal Center for Robotics and AI</strong> (adjoining Gloria Gopi Kumar Alumni Hall #30 and TBI #32), directly east of the central stadium avenue.
            </p>
          </div>
        </div>

        <button 
          className="btn btn-secondary"
          onClick={() => {
            setActiveTab('2d-map');
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

      {/* TAB 1: 2D INTERACTIVE MAP */}
      {activeTab === '2d-map' && (
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
                  placeholder="Search landmark or #..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* Master 2D Map Canvas Container */}
          <div 
            ref={mapContainerRef}
            className="card" 
            style={{ 
              padding: '0', 
              overflow: 'hidden', 
              position: 'relative', 
              background: '#e2e8f0', 
              border: '2px solid var(--border-color)',
              borderRadius: '10px',
              marginBottom: '20px'
            }}
          >
            {/* Map Legend Banner Header */}
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
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Compass size={16} style={{ color: 'var(--accent-primary)' }} />
                <span style={{ fontWeight: 700 }}>Official Campus Schematic (2D Architectural Master Layout)</span>
              </div>
              
              {/* Legend Badges */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '14px', flexWrap: 'wrap' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <span style={{ width: '11px', height: '11px', borderRadius: '3px', background: '#1e3a8a', display: 'inline-block' }} />
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
              maxHeight: '620px', 
              position: 'relative',
              background: '#f1f5f9',
              cursor: zoomLevel > 1 ? 'grab' : 'default'
            }}>
              <div style={{ 
                position: 'relative', 
                width: '100%', 
                minWidth: '850px',
                transform: `scale(${zoomLevel})`,
                transformOrigin: 'top left',
                transition: 'transform 0.2s cubic-bezier(0.16, 1, 0.3, 1)'
              }}>
                {/* 1. Base 2D Master Signboard Image */}
                <img 
                  src="/gec-campus-map-2d-master.png" 
                  alt="GEC Thrissur Official 2D Campus Map"
                  style={{
                    display: 'block',
                    width: '100%',
                    height: 'auto',
                    userSelect: 'none',
                    pointerEvents: 'none'
                  }}
                />

                {/* 2. Interactive SVG Pin Overlay (Calibrated precisely to 905x327) */}
                <svg
                  viewBox="0 0 905 327"
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    pointerEvents: 'auto'
                  }}
                >
                  <defs>
                    {/* Pulsing beacon filter for #31 */}
                    <filter id="beacon-glow" x="-50%" y="-50%" width="200%" height="200%">
                      <feGaussianBlur in="SourceGraphic" stdDeviation="3" result="blur" />
                      <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                      </feMerge>
                    </filter>
                  </defs>

                  {/* Render Pins for Each Location */}
                  {allLocations.map((loc) => {
                    const isSelected = loc.id === activeLocationId;
                    const isHovered = hoveredLocation?.id === loc.id;
                    const isFiltered = filteredLocations.some(f => f.id === loc.id);
                    const colors = getPinColor(loc);
                    const isCPS = loc.id === 31;

                    // If filtered out by category or search, dim it
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
                            r={isCPS ? 18 : 14}
                            fill="none"
                            stroke={isCPS ? '#eab308' : 'var(--accent-primary)'}
                            strokeWidth={isSelected ? 3 : 2}
                            strokeDasharray={isSelected ? 'none' : '3 2'}
                            style={{
                              animation: 'pulse 1.5s infinite'
                            }}
                          />
                        )}

                        {/* Extra Halo for CPS #31 */}
                        {isCPS && (
                          <circle
                            r={14}
                            fill="rgba(234, 179, 8, 0.35)"
                            filter="url(#beacon-glow)"
                          />
                        )}

                        {/* Pin Center Circle */}
                        <circle
                          r={isCPS ? 10 : 8}
                          fill={colors.bg}
                          stroke="#ffffff"
                          strokeWidth={isCPS ? 2 : 1.5}
                          style={{
                            transition: 'all 0.2s cubic-bezier(0.16, 1, 0.3, 1)',
                            transform: (isSelected || isHovered) ? 'scale(1.25)' : 'scale(1)',
                            transformOrigin: '0 0'
                          }}
                        />

                        {/* Number Text inside circle */}
                        <text
                          textAnchor="middle"
                          dominantBaseline="central"
                          fill={colors.text}
                          fontSize={isCPS ? '8px' : '7px'}
                          fontWeight="700"
                          fontFamily="monospace"
                          style={{ pointerEvents: 'none', userSelect: 'none' }}
                        >
                          {loc.id}
                        </text>

                        {/* Hover Tooltip Card */}
                        {(isHovered || (isSelected && zoomLevel > 1.2)) && (
                          <g transform="translate(0, -18)" style={{ pointerEvents: 'none' }}>
                            <rect
                              x={-75}
                              y={-28}
                              width={150}
                              height={28}
                              rx={5}
                              fill="rgba(15, 23, 42, 0.95)"
                              stroke={isCPS ? '#eab308' : 'rgba(255, 255, 255, 0.2)'}
                              strokeWidth={1}
                            />
                            <text
                              x={0}
                              y={-17}
                              textAnchor="middle"
                              fill="#ffffff"
                              fontSize="8.5px"
                              fontWeight="700"
                            >
                              #{loc.id} {loc.name.length > 22 ? loc.name.slice(0, 20) + '...' : loc.name}
                            </text>
                            <text
                              x={0}
                              y={-7}
                              textAnchor="middle"
                              fill={isCPS ? '#fde047' : '#94a3b8'}
                              fontSize="7px"
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
                Click any numbered pinpoint on the map or select from the directory below to view department details.
              </span>
              <span>
                Showing <strong>{filteredLocations.length}</strong> of 41 locations
              </span>
            </div>
          </div>

          {/* Active Landmark Spotlight Card */}
          {activeLoc && (
            <div className="card" style={{ 
              marginBottom: '28px',
              borderLeft: `4px solid ${getPinColor(activeLoc).bg}`,
              background: 'var(--bg-card)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
                <div style={{ display: 'flex', gap: '14px', alignItems: 'flex-start' }}>
                  <div style={{ 
                    width: '46px', 
                    height: '46px', 
                    borderRadius: '8px', 
                    background: getPinColor(activeLoc).bg, 
                    color: getPinColor(activeLoc).text,
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    fontWeight: 800,
                    fontSize: '1.2rem',
                    fontFamily: 'monospace',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                    flexShrink: 0
                  }}>
                    #{activeLoc.id}
                  </div>

                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
                      <h2 style={{ margin: 0, fontSize: '1.15rem' }}>{activeLoc.name}</h2>
                      <span className={`tag ${
                        activeLoc.catKey === 'acad' ? 'tag-blue' : 
                        activeLoc.catKey === 'fac' ? 'tag-amber' : 'tag-stone'
                      }`}>
                        {activeLoc.category}
                      </span>
                      {activeLoc.id === 31 && (
                        <span className="tag tag-amber font-mono">
                          ★ CPS Department Hub
                        </span>
                      )}
                    </div>
                    <p style={{ margin: '6px 0 0', color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: '1.5' }}>
                      {activeLoc.desc}
                    </p>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setZoomLevel(1.5);
                      if (mapContainerRef.current) {
                        mapContainerRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
                      }
                    }}
                    style={{ fontSize: '0.8rem', padding: '6px 12px' }}
                  >
                    <ZoomIn size={13} style={{ marginRight: '4px' }} />
                    Center &amp; Zoom
                  </button>
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
              Numbered exactly according to the GECT campus signboard
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
                      ? (isCPS ? 'rgba(234, 179, 8, 0.05)' : 'var(--bg-card)') 
                      : 'var(--bg-card)',
                    padding: '14px 16px',
                    transition: 'all 0.15s ease'
                  }}
                >
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <span style={{ 
                          width: '26px', 
                          height: '26px', 
                          borderRadius: '6px', 
                          background: colors.bg, 
                          color: colors.text,
                          display: 'inline-flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontWeight: 700,
                          fontSize: '0.82rem',
                          fontFamily: 'monospace'
                        }}>
                          {loc.id}
                        </span>
                        <h3 style={{ margin: 0, fontSize: '0.98rem', fontWeight: 600 }}>
                          {loc.name}
                        </h3>
                      </div>
                      
                      <span className={`tag ${
                        loc.catKey === 'acad' ? 'tag-blue' : 
                        loc.catKey === 'fac' ? 'tag-amber' : 'tag-stone'
                      }`} style={{ fontSize: '0.7rem' }}>
                        {loc.category.split('&')[0].trim()}
                      </span>
                    </div>

                    <p style={{ margin: 0, fontSize: '0.84rem', color: 'var(--text-muted)', lineHeight: '1.45' }}>
                      {loc.desc}
                    </p>
                  </div>

                  <div style={{ marginTop: '12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--border-subtle)', paddingTop: '8px' }}>
                    <span style={{ fontSize: '0.75rem', color: isCPS ? 'var(--amber-text)' : 'var(--text-muted)', fontWeight: isCPS ? 700 : 500 }}>
                      {isCPS ? '★ CPS Department Hub' : `Signboard Index #${loc.id}`}
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

      {/* TAB 2: ORIGINAL SIGNBOARD PHOTO & LEGEND INSPECTOR */}
      {activeTab === 'photo-signboard' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="card" style={{ padding: '16px 20px' }}>
            <h2 style={{ fontSize: '1.1rem', margin: '0 0 6px' }}>Original Physical Campus Signboard (GECT)</h2>
            <p style={{ margin: 0, color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              High-resolution photograph of the official Government Engineering College Thrissur campus map board situated near the main entrance, listing all 41 landmarks and the official printed legend table.
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

          {/* Close-up Layout Photo */}
          <div className="card" style={{ padding: '16px 20px' }}>
            <h3 style={{ fontSize: '1rem', margin: '0 0 10px' }}>Signboard Blueprint Crop (Close-up View)</h3>
            <div style={{ borderRadius: '8px', overflow: 'hidden', border: '1px solid var(--border-color)' }}>
              <img 
                src="/gec-campus-map-layout.jpg" 
                alt="GEC Thrissur Campus Map Close-up" 
                style={{ width: '100%', display: 'block' }}
              />
            </div>
          </div>

          {/* Master 41 Landmark Printed Table */}
          <div className="card">
            <h3 style={{ fontSize: '1rem', margin: '0 0 14px' }}>Official Campus Signboard Legend Table</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '20px' }}>
              
              {/* Column 1 */}
              <div>
                <h4 style={{ color: '#1e3a8a', borderBottom: '2px solid #1e3a8a', paddingBottom: '4px', margin: '0 0 10px' }}>
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
                  <li>Central Computing Facility</li>
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
