import React from 'react';

export default function TopHeader() {
  return (
    <header className="institutional-top-bar">
      <div className="top-bar-inner">
        {/* Logo 1: GEC Thrissur Crest & College Title */}
        <div className="top-brand-left">
          <div className="crest-box">
            <img 
              src={`${import.meta.env.BASE_URL}gect-emblem.png`}
              alt="Government Engineering College Thrissur Emblem" 
              className="crest-img"
            />
          </div>
          <div className="college-text">
            <h1 className="college-main-title">GOVERNMENT ENGINEERING COLLEGE THRISSUR</h1>
            <p className="college-sub-text">Govt. of Kerala &bull; Affiliated to APJAKTU &bull; Estd. 1957</p>
          </div>
        </div>

        {/* Association of Cyber Physical Systems Logo */}
        <div className="top-brand-center">
          <div className="association-logo-box">
            <img 
              src={`${import.meta.env.BASE_URL}association-cps-logo.png`}
              alt="Association of Cyber Physical Systems" 
              className="association-img"
            />
          </div>
        </div>

      </div>
    </header>
  );
}
