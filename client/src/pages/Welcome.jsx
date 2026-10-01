import React from 'react';
import {
  ArrowRight,
  Bell,
  BrainCircuit,
  CalendarDays,
  Cog,
  Cpu,
  ExternalLink,
  GraduationCap,
  Instagram,
  Linkedin,
  MapPin,
  Activity,
  Radio,
  RefreshCw,
  ShieldCheck,
} from 'lucide-react';

const externalLinks = [
  {
    label: 'GEC Thrissur',
    detail: 'Official college website',
    href: 'https://gectcr.ac.in/',
    icon: ExternalLink
  },
  {
    label: 'B.Tech in CPS',
    detail: 'Official ECE programme page',
    href: 'https://gectcr.ac.in/department/ece/programs',
    icon: Cpu
  },
  {
    label: 'CPS on LinkedIn',
    detail: 'Department community and updates',
    href: 'https://www.linkedin.com/company/cyber-physical-systems-gecthrissur',
    icon: Linkedin
  },
  {
    label: 'GEC on Instagram',
    detail: 'Find campus posts and communities',
    href: 'https://www.instagram.com/explore/search/keyword/?q=gec%20thrissur',
    icon: Instagram
  }
];

export default function Welcome({ data, onNavigate }) {
  const openScholarships = data.scholarships?.length || 0;
  const upcomingEvents = data.events?.length || 0;
  const announcements = data.announcements?.length || 0;

  return (
    <div className="welcome-page">
      <section className="welcome-hero">
        <div className="welcome-hero-copy">
          <span className="welcome-eyebrow"><ShieldCheck size={15} /> CPS Student Welfare Portal</span>
          <h1>Welcome to Cyber Physical Systems at GEC Thrissur</h1>
          <p>
            Cyber Physical Systems connect computation, sensors, communication and physical machines.
            They power robotics, smart infrastructure, automation, medical monitoring and autonomous systems.
          </p>
          <div className="welcome-actions">
            <button className="btn btn-primary" onClick={() => onNavigate('scholarships')}>
              <GraduationCap size={16} /> Explore scholarships
            </button>
            <button className="btn btn-secondary" onClick={() => onNavigate('map')}>
              <MapPin size={16} /> View campus map
            </button>
          </div>
        </div>
        <div className="welcome-system" aria-label="Cyber Physical Systems feedback loop">
          <div className="system-loop-title"><RefreshCw size={15} /> Real-time feedback loop</div>
          <div className="system-loop-grid">
            <div className="system-stage"><span><Activity size={20} /></span><div><strong>Physical world</strong><small>Machines &amp; environment</small></div></div>
            <ArrowRight className="system-arrow" size={17} />
            <div className="system-stage"><span><Radio size={20} /></span><div><strong>Sense</strong><small>Collect live data</small></div></div>
            <div className="system-stage"><span><Cog size={20} /></span><div><strong>Actuate</strong><small>Control the system</small></div></div>
            <ArrowRight className="system-arrow system-arrow-reverse" size={17} />
            <div className="system-stage system-stage-primary"><span><BrainCircuit size={20} /></span><div><strong>Decide</strong><small>Compute &amp; respond</small></div></div>
          </div>
          <div className="system-feedback"><RefreshCw size={13} /> Continuous sensing, decision and control</div>
        </div>
      </section>

      <section className="welcome-stats" aria-label="Portal summary">
        <button onClick={() => onNavigate('scholarships')}><GraduationCap size={18} /><span><strong>{openScholarships}</strong> scholarship listings</span></button>
        <button onClick={() => onNavigate('events')}><CalendarDays size={18} /><span><strong>{upcomingEvents}</strong> college events</span></button>
        <button onClick={() => onNavigate('announcements')}><Bell size={18} /><span><strong>{announcements}</strong> announcements</span></button>
      </section>

      <div className="welcome-grid">
        <section className="card welcome-about">
          <span className="tag tag-blue">Kerala's first B.Tech CPS programme</span>
          <h2>Engineering the link between software and the real world</h2>
          <p>
            The programme combines embedded systems, electronics, control, networks and intelligent
            computing. Students learn to build dependable systems that observe their environment,
            make decisions and respond in real time.
          </p>
          <div className="welcome-pillars">
            <span>Sensors &amp; IoT</span><span>Embedded systems</span><span>Robotics</span>
            <span>Control &amp; automation</span><span>AI at the edge</span><span>Smart infrastructure</span>
          </div>
        </section>

        <section className="card welcome-links">
          <div className="welcome-section-heading">
            <div><span className="section-kicker">Useful links</span><h2>Connect with GEC &amp; CPS</h2></div>
          </div>
          <div className="welcome-link-list">
            {externalLinks.map(({ label, detail, href, icon: Icon }) => (
              <a key={label} href={href} target="_blank" rel="noopener noreferrer">
                <span className="welcome-link-icon"><Icon size={18} /></span>
                <span><strong>{label}</strong><small>{detail}</small></span>
                <ArrowRight size={16} />
              </a>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
