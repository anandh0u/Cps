import React from 'react';
import { 
  Cpu, 
  Layers, 
  DoorOpen, 
  AlertCircle, 
  Award, 
  CalendarDays, 
  BellRing, 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Wrench,
  Microchip,
  Activity,
  ShieldAlert
} from 'lucide-react';

export default function Overview({ data, setCurrentRoute }) {
  const department = data?.department || {};
  const rooms = data?.rooms || [];
  const events = data?.events || [];
  const updates = data?.updates || [];
  const complaints = data?.complaints || [];
  const scholarships = data?.scholarships || [];

  const activeRooms = rooms.filter(r => r.status === 'In Session');
  const availableRooms = rooms.filter(r => r.status === 'Available' || r.status.includes('Ready'));
  const ongoingEvent = events.find(e => e.status === 'Ongoing Today') || events[0];

  return (
    <div className="container" style={{ paddingBottom: '40px' }}>
      {/* Hero Section */}
      <div className="page-header" style={{ alignItems: 'center' }}>
        <div>
          <div className="page-kicker">
            <Activity size={14} />
            <span>CPS Academic & Systems Hub</span>
          </div>
          <h1 className="page-title">{department.name || 'Cyber Physical System Engineering'}</h1>
          <p className="page-subtitle">
            {department.institution || 'Government Engineering College Thrissur'} &bull; {department.motto}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '10px' }}>
          <button 
            className="btn btn-primary"
            onClick={() => setCurrentRoute('rooms')}
          >
            <DoorOpen size={16} />
            <span>View Room Allocations</span>
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => setCurrentRoute('complaints')}
          >
            <AlertCircle size={16} />
            <span>Lodge Grievance</span>
          </button>
        </div>
      </div>

      {/* Cyber-Physical System Architecture Banner: Hardware + Software */}
      <div 
        className="card" 
        style={{ 
          background: 'linear-gradient(135deg, #ffffff 0%, #f0f9ff 100%)', 
          borderColor: '#bae6fd',
          marginBottom: '32px'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
          <div style={{ background: '#0284c7', color: 'white', padding: '6px', borderRadius: '6px' }}>
            <Layers size={20} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.25rem', color: 'var(--blue-navy)' }}>The Cyber-Physical Systems Intersection</h2>
            <p style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
              Where physical mechanical dynamics and electronic hardware fuse seamlessly with computational logic.
            </p>
          </div>
        </div>

        <div className="grid-2" style={{ marginTop: '16px', gap: '16px' }}>
          {/* Hardware Column */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#0369a1' }}>
              <Cpu size={18} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Physical & Hardware Realm</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Embedded microcontrollers, sensor transducers, FPGA synthesis, robotics kinematics, actuators, and signal conditioning testbenches.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-blue">ARM Cortex-M4</span>
              <span className="badge badge-blue">Xilinx Artix-7 FPGA</span>
              <span className="badge badge-blue">6-DOF Robotic Arms</span>
              <span className="badge badge-blue">Siemens S7 PLCs</span>
              <span className="badge badge-blue">LoRaWAN Nodes</span>
            </div>
          </div>

          {/* Software Column */}
          <div style={{ background: 'white', padding: '16px', borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px', color: '#059669' }}>
              <Layers size={18} />
              <h3 style={{ fontSize: '0.95rem', fontWeight: 700 }}>Computational & Software Realm</h3>
            </div>
            <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
              Deterministic real-time scheduling, ROS2 autonomy stacks, industrial SCADA protocols, hardware security, and digital twin virtualization.
            </p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
              <span className="badge badge-green">FreeRTOS / Zephyr</span>
              <span className="badge badge-green">ROS2 Humble Autonomy</span>
              <span className="badge badge-green">Embedded C / C++ / Rust</span>
              <span className="badge badge-green">MQTT & Modbus TCP</span>
              <span className="badge badge-green">Digital Twin Simulations</span>
            </div>
          </div>
        </div>
      </div>

      {/* Operational Metric KPI Counters */}
      <div className="grid-4" style={{ marginBottom: '32px' }}>
        <div className="card" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => setCurrentRoute('rooms')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Labs & Classrooms</p>
              <h4 className="font-mono" style={{ fontSize: '1.8rem', color: 'var(--blue-navy)', margin: '4px 0' }}>
                {rooms.length}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <CheckCircle2 size={13} /> {activeRooms.length} In Session &bull; {availableRooms.length} Ready
              </p>
            </div>
            <div style={{ background: 'var(--blue-light)', color: 'var(--blue-dark)', padding: '8px', borderRadius: '8px' }}>
              <DoorOpen size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => setCurrentRoute('complaints')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Active Helpdesk Tickets</p>
              <h4 className="font-mono" style={{ fontSize: '1.8rem', color: 'var(--blue-navy)', margin: '4px 0' }}>
                {complaints.filter(c => c.status !== 'Resolved').length}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#d97706', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Clock size={13} /> 1 Under Review &bull; 2 In Progress
              </p>
            </div>
            <div style={{ background: 'var(--amber-light)', color: 'var(--amber-warning)', padding: '8px', borderRadius: '8px' }}>
              <AlertCircle size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => setCurrentRoute('scholarships')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Available Scholarships</p>
              <h4 className="font-mono" style={{ fontSize: '1.8rem', color: 'var(--blue-navy)', margin: '4px 0' }}>
                {scholarships.length}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#0369a1', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Award size={13} /> Govt, AICTE & Industry Grants
              </p>
            </div>
            <div style={{ background: 'var(--blue-light)', color: 'var(--blue-dark)', padding: '8px', borderRadius: '8px' }}>
              <Award size={20} />
            </div>
          </div>
        </div>

        <div className="card" style={{ padding: '18px', cursor: 'pointer' }} onClick={() => setCurrentRoute('events')}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <p style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-dim)', textTransform: 'uppercase' }}>Department Events</p>
              <h4 className="font-mono" style={{ fontSize: '1.8rem', color: 'var(--blue-navy)', margin: '4px 0' }}>
                {events.length}
              </h4>
              <p style={{ fontSize: '0.78rem', color: '#059669', display: 'flex', alignItems: 'center', gap: '4px' }}>
                <Activity size={13} /> 1 Ongoing Today &bull; 3 Upcoming
              </p>
            </div>
            <div style={{ background: 'var(--green-light)', color: 'var(--green-hardware)', padding: '8px', borderRadius: '8px' }}>
              <CalendarDays size={20} />
            </div>
          </div>
        </div>
      </div>

      {/* Main 2-Column Section: Live Room Status + Urgent Notices */}
      <div className="grid-2" style={{ gap: '24px' }}>
        {/* Left Column: Live Room & Lab Status Matrix Snapshot */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <DoorOpen size={20} color="var(--blue-primary)" />
              <span>Current Room & Lab Status</span>
            </h2>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
              onClick={() => setCurrentRoute('rooms')}
            >
              <span>Full Schedule</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {rooms.slice(0, 4).map((room) => {
              const isInSession = room.status === 'In Session';
              const isMaintenance = room.status.includes('Maintenance');
              return (
                <div 
                  key={room.id} 
                  className="card" 
                  style={{ padding: '16px', borderLeft: `4px solid ${isInSession ? '#0284c7' : isMaintenance ? '#d97706' : '#10b981'}` }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                    <div>
                      <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)', fontWeight: 600 }}>
                        {room.code} &bull; {room.building}
                      </span>
                      <h4 style={{ fontSize: '1rem', color: 'var(--blue-navy)', marginTop: '2px' }}>{room.name}</h4>
                    </div>
                    <span className={`badge ${isInSession ? 'badge-blue' : isMaintenance ? 'badge-amber' : 'badge-green'}`}>
                      {room.status}
                    </span>
                  </div>

                  <div style={{ background: '#f8fafc', padding: '10px 12px', borderRadius: '6px', fontSize: '0.82rem', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                        Allotted: {room.currentAllotment.class}
                      </span>
                      <span className="font-mono" style={{ color: 'var(--text-dim)', fontSize: '0.78rem' }}>
                        {room.currentAllotment.timeSlot}
                      </span>
                    </div>
                    <p style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                      {room.currentAllotment.subject} {room.currentAllotment.faculty ? `(${room.currentAllotment.faculty})` : ''}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: College Circulars & Today's Highlight */}
        <div>
          {/* Ongoing Event Feature */}
          {ongoingEvent && (
            <div 
              className="card" 
              style={{ 
                marginBottom: '24px', 
                background: '#ffffff', 
                border: '1px solid #7dd3fc', 
                boxShadow: '0 4px 12px rgba(2, 132, 199, 0.08)' 
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className="status-dot" style={{ width: '6px', height: '6px', background: '#059669' }}></span>
                  <span>{ongoingEvent.status}</span>
                </span>
                <span className="font-mono" style={{ fontSize: '0.78rem', color: 'var(--text-dim)' }}>
                  {ongoingEvent.time}
                </span>
              </div>
              <h3 style={{ fontSize: '1.1rem', color: 'var(--blue-navy)', marginBottom: '6px' }}>
                {ongoingEvent.title}
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: '12px' }}>
                {ongoingEvent.speaker} &bull; <strong style={{ color: 'var(--blue-navy)' }}>{ongoingEvent.venue}</strong>
              </p>
              <button 
                className="btn btn-primary" 
                style={{ width: '100%', fontSize: '0.82rem', padding: '7px' }}
                onClick={() => setCurrentRoute('events')}
              >
                <span>View Event Details & Registration</span>
                <ArrowRight size={14} />
              </button>
            </div>
          )}

          {/* Recent Notices */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
            <h2 style={{ fontSize: '1.25rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <BellRing size={20} color="var(--blue-primary)" />
              <span>College & Department Notices</span>
            </h2>
            <button 
              className="btn btn-secondary" 
              style={{ fontSize: '0.8rem', padding: '5px 10px' }}
              onClick={() => setCurrentRoute('updates')}
            >
              <span>View All</span>
              <ArrowRight size={14} />
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {updates.slice(0, 3).map((notice) => (
              <div key={notice.id} className="card" style={{ padding: '14px' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span className={`badge ${notice.importance === 'Urgent' ? 'badge-red' : 'badge-blue'}`}>
                    {notice.category}
                  </span>
                  <span className="font-mono" style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>
                    {notice.date}
                  </span>
                </div>
                <h4 style={{ fontSize: '0.92rem', color: 'var(--blue-navy)', marginBottom: '4px' }}>
                  {notice.title}
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  {notice.summary.slice(0, 110)}...
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
