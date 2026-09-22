import React from 'react';

export default function TopHeader() {
  return (
    <header className="institutional-top-bar">
      <div className="top-bar-inner">
        {/* Logo 1: GEC Thrissur Crest & College Title */}
        <div className="top-brand-left">
          <div className="crest-box">
            <img 
              src="/gect-emblem.png" 
              alt="Government Engineering College Thrissur Emblem" 
              className="crest-img"
            />
          </div>
          <div className="college-text">
            <h1 className="college-main-title">GOVERNMENT ENGINEERING COLLEGE THRISSUR</h1>
            <p className="college-sub-text">Autonomous Institution &bull; Govt. of Kerala &bull; Estd. 1957</p>
          </div>
        </div>

        {/* Logo 2: Association of Cyber Physical Systems Logo (Center) */}
        <div className="top-brand-center">
          <div className="association-logo-box">
            <img 
              src="/association-cps-logo.png" 
              alt="Association of Cyber Physical Systems" 
              className="association-img"
            />
          </div>
        </div>

        {/* Logo 3: CPS GECT Department Emblem & Department Title */}
        <div className="top-brand-right">
          <div className="dept-text">
            <h2 className="dept-main-title">DEPARTMENT OF CYBER PHYSICAL SYSTEMS</h2>
            <p className="dept-sub-text">Student Welfare &amp; Grievance Redressal Cell</p>
          </div>
          <div className="crest-box cps-crest-box">
            <img 
              src="/cps-gect-emblem.png" 
              alt="CPS GECT Emblem" 
              className="crest-img"
            />
          </div>
        </div>
      </div>
    </header>
  );
}
