import React, { useState } from 'react';
import { 
  DoorOpen, 
  Cpu, 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Wrench, 
  Search, 
  ShieldCheck, 
  Monitor, 
  Wifi, 
  Tv, 
  Zap, 
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';
import Modal from '../components/Modal';

export default function Rooms({ rooms = [], onReportIssue }) {
  const [filterType, setFilterType] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRoom, setSelectedRoom] = useState(null);

  const filteredRooms = rooms.filter(room => {
    const matchesType = filterType === 'All' || 
      (filterType === 'Labs' && room.type.toLowerCase().includes('lab')) ||
      (filterType === 'Classrooms' && room.type.toLowerCase().includes('classroom')) ||
      (filterType === 'Halls' && room.type.toLowerCase().includes('seminar'));

    const q = searchTerm.toLowerCase();
    const matchesSearch = !searchTerm || 
      room.name.toLowerCase().includes(q) ||
      room.code.toLowerCase().includes(q) ||
      room.currentAllotment.class.toLowerCase().includes(q) ||
      room.currentAllotment.subject.toLowerCase().includes(q);

    return matchesType && matchesSearch;
  });

  return (
    <div className="container" style={{ paddingBottom: '50px' }}>
      {/* Header */}
      <div className="page-header">
        <div>
          <div className="page-kicker">
            <DoorOpen size={14} />
            <span>Facility Operations & Readiness</span>
          </div>
          <h1 className="page-title">Classroom & Lab Allotment Matrix</h1>
          <p className="page-subtitle">
            Real-time schedule allocation, room occupancy, and hardware equipment readiness for Cyber Physical System Engineering.
          </p>
        </div>

        <button 
          className="btn btn-secondary" 
          onClick={() => onReportIssue(null)}
        >
          <AlertCircle size={16} />
          <span>Report Facility Issue</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="filter-bar">
        <div className="filter-tabs">
          {['All', 'Labs', 'Classrooms', 'Halls'].map(type => (
            <button
              key={type}
              className={`filter-tab-btn ${filterType === type ? 'active' : ''}`}
              onClick={() => setFilterType(type)}
            >
              {type === 'All' ? 'All Spaces' : type === 'Labs' ? 'Hardware & Software Labs' : type}
            </button>
          ))}
        </div>

        <div className="search-input-box">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search room code, class, subject..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Rooms Grid */}
      <div className="grid-2" style={{ gap: '24px' }}>
        {filteredRooms.map(room => {
          const isSession = room.status === 'In Session';
          const isMaintenance = room.status.toLowerCase().includes('maintenance');
          const isReady = room.status.toLowerCase().includes('ready') || room.status === 'Available';

          return (
            <div key={room.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                {/* Card Top */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '14px' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span className="badge badge-slate font-mono" style={{ fontSize: '0.8rem', fontWeight: 700 }}>
                        {room.code}
                      </span>
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
                        {room.building} &bull; Cap: {room.capacity} seats
                      </span>
                    </div>
                    <h3 style={{ fontSize: '1.2rem', color: 'var(--blue-navy)' }}>{room.name}</h3>
                  </div>

                  <span className={`badge ${isSession ? 'badge-blue' : isMaintenance ? 'badge-amber' : 'badge-green'}`}>
                    {room.status}
                  </span>
                </div>

                {/* Current Allotment Banner */}
                <div style={{ 
                  background: '#f8fafc', 
                  border: '1px solid #e2e8f0', 
                  borderRadius: '8px', 
                  padding: '14px', 
                  marginBottom: '16px' 
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#0369a1', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                      Current Allotment
                    </span>
                    <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Clock size={13} /> {room.currentAllotment.timeSlot}
                    </span>
                  </div>

                  <p style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '2px' }}>
                    {room.currentAllotment.class}
                  </p>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {room.currentAllotment.subject}
                  </p>
                  {room.currentAllotment.faculty && (
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                      Faculty In-Charge: <strong style={{ color: 'var(--text-main)' }}>{room.currentAllotment.faculty}</strong> ({room.currentAllotment.batch})
                    </p>
                  )}
                </div>

                {/* Next Allotment Row */}
                {room.nextAllotment && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.8rem', color: 'var(--text-muted)', padding: '0 4px 14px', borderBottom: '1px dashed #cbd5e1', marginBottom: '14px' }}>
                    <span>Next Allotment: <strong style={{ color: 'var(--text-main)' }}>{room.nextAllotment.class}</strong> ({room.nextAllotment.subject})</span>
                    <span className="font-mono" style={{ color: 'var(--text-dim)' }}>{room.nextAllotment.timeSlot}</span>
                  </div>
                )}

                {/* Hardware & Facility Readiness Breakdown */}
                <div style={{ marginBottom: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                    <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>
                      Hardware & Facility Readiness
                    </span>
                    <span className={`badge ${room.readiness.overallStatus === 'Ready' ? 'badge-green' : 'badge-amber'}`} style={{ fontSize: '0.7rem' }}>
                      <CheckCircle2 size={12} /> {room.readiness.overallStatus === 'Ready' ? '100% Operational' : 'Under Maintenance'}
                    </span>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '8px', fontSize: '0.8rem' }}>
                    {room.readiness.workstations && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Monitor size={14} color="#0284c7" />
                        <span className="font-mono">{room.readiness.workstations.slice(0, 16)}</span>
                      </div>
                    )}
                    {room.readiness.fpgaKits && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Cpu size={14} color="#059669" />
                        <span>{room.readiness.fpgaKits}</span>
                      </div>
                    )}
                    {room.readiness.oscilloscopes && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Zap size={14} color="#0284c7" />
                        <span>{room.readiness.oscilloscopes}</span>
                      </div>
                    )}
                    {room.readiness.roboticArms && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Cpu size={14} color="#059669" />
                        <span>{room.readiness.roboticArms}</span>
                      </div>
                    )}
                    {room.readiness.smartboard && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                        <Tv size={14} color="#0284c7" />
                        <span>{room.readiness.smartboard.slice(0, 24)}</span>
                      </div>
                    )}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: 'var(--text-muted)' }}>
                      <Wifi size={14} color="#059669" />
                      <span>{room.readiness.lanConnectivity || 'High-Speed LAN Active'}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Card Footer Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '12px', borderTop: '1px solid #e2e8f0' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                  Inspected: {room.readiness.lastInspected}
                </span>

                <div style={{ display: 'flex', gap: '8px' }}>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.78rem', padding: '5px 9px' }}
                    onClick={() => setSelectedRoom(room)}
                  >
                    <span>Full Specs</span>
                  </button>
                  <button 
                    className="btn btn-secondary" 
                    style={{ fontSize: '0.78rem', padding: '5px 9px', color: '#d97706', borderColor: '#fde68a' }}
                    onClick={() => onReportIssue(room.code)}
                  >
                    <Wrench size={13} />
                    <span>Report Issue</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Room Full Details Modal */}
      {selectedRoom && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedRoom(null)}
          title={`${selectedRoom.code} — ${selectedRoom.name}`}
          subtitle={`${selectedRoom.building} • Seating Capacity: ${selectedRoom.capacity}`}
          footer={
            <>
              <button 
                className="btn btn-secondary" 
                onClick={() => setSelectedRoom(null)}
              >
                Close
              </button>
              <button 
                className="btn btn-primary" 
                onClick={() => {
                  const code = selectedRoom.code;
                  setSelectedRoom(null);
                  onReportIssue(code);
                }}
              >
                <Wrench size={15} />
                <span>Report Issue for this Space</span>
              </button>
            </>
          }
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {/* Status & Allocation Banner */}
            <div style={{ background: '#f0f9ff', border: '1px solid #bae6fd', padding: '14px', borderRadius: '8px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge badge-blue">Status: {selectedRoom.status}</span>
                <span className="badge badge-green">Readiness: {selectedRoom.readiness.overallStatus}</span>
              </div>
              <h4 style={{ color: 'var(--blue-navy)', marginBottom: '4px' }}>
                Active Class: {selectedRoom.currentAllotment.class}
              </h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                {selectedRoom.currentAllotment.subject} &bull; Time: {selectedRoom.currentAllotment.timeSlot}
              </p>
              {selectedRoom.currentAllotment.faculty && (
                <p style={{ fontSize: '0.82rem', color: 'var(--text-dim)', marginTop: '4px' }}>
                  Faculty Coordinator: {selectedRoom.currentAllotment.faculty}
                </p>
              )}
            </div>

            {/* Detailed Hardware & Facility Specs */}
            <div>
              <h4 style={{ fontSize: '0.95rem', color: 'var(--blue-navy)', marginBottom: '10px' }}>
                Equipment & Readiness Checklist
              </h4>
              <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.85rem' }}>
                {Object.entries(selectedRoom.readiness).map(([key, val]) => {
                  if (typeof val === 'boolean') {
                    return (
                      <li key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                        <ShieldCheck size={16} color="#059669" />
                        <span style={{ textTransform: 'capitalize' }}>{key.replace(/([A-Z])/g, ' $1')}:</span>
                        <strong style={{ color: '#059669' }}>Verified Active</strong>
                      </li>
                    );
                  }
                  return (
                    <li key={key} style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-main)' }}>
                      <CheckCircle2 size={16} color="#0284c7" />
                      <span style={{ textTransform: 'capitalize', color: 'var(--text-dim)' }}>
                        {key.replace(/([A-Z])/g, ' $1')}:
                      </span>
                      <strong>{val}</strong>
                    </li>
                  );
                })}
              </ul>
            </div>
          </div>
        </Modal>
      )}
    </div>
  );
}
