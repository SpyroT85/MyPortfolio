import "./LookingFor.css";

const IconBriefcase = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" />
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2" />
    <path d="M2 12h20" />
  </svg>
);

const IconGlobe = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10" />
    <line x1="2" y1="12" x2="22" y2="12" />
    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
  </svg>
);

const IconPin = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" />
    <circle cx="12" cy="10" r="3" />
  </svg>
);

const IconCode = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="16 18 22 12 16 6" />
    <polyline points="8 6 2 12 8 18" />
  </svg>
);

const IconTrendingUp = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18" />
    <polyline points="17 6 23 6 23 12" />
  </svg>
);

const IconUsers = () => (
  <svg viewBox="0 0 24 24" width="24" height="24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const LookingFor = () => {
  return (
    <div className="lf-app">

      <div className="lf-header">
        <span className="lf-badge">✦ Looking for</span>
        <p className="lf-subtitle">
          Here's what I'm looking for in my next role, feel free to reach out if it sounds like a match.
        </p>
      </div>

      <div className="lf-divider" />

      <div className="lf-grid">

        <div className="lf-card">
          <span className="lf-card-icon" style={{ color: '#a78bfa' }}><IconBriefcase /></span>
          <div className="lf-card-body">
            <span className="lf-card-label">Role</span>
            <span className="lf-card-value">Junior Fullstack Developer</span>
          </div>
        </div>

        <div className="lf-card">
          <span className="lf-card-icon" style={{ color: '#38bdf8' }}><IconGlobe /></span>
          <div className="lf-card-body">
            <span className="lf-card-label">Work type</span>
            <div className="lf-tags">
              <span className="lf-tag">Remote</span>
              <span className="lf-tag">Hybrid</span>
            </div>
          </div>
        </div>

        <div className="lf-card">
          <span className="lf-card-icon" style={{ color: '#fb923c' }}><IconPin /></span>
          <div className="lf-card-body">
            <span className="lf-card-label">Location</span>
            <div className="lf-tags">
              <span className="lf-tag">Athens</span>
              <span className="lf-tag">Europe</span>
              <span className="lf-tag">Worldwide</span>
            </div>
          </div>
        </div>

        <div className="lf-card">
          <span className="lf-card-icon" style={{ color: '#4ade80' }}><IconCode /></span>
          <div className="lf-card-body">
            <span className="lf-card-label">Stack</span>
            <div className="lf-tags">
              <span className="lf-tag">React</span>
              <span className="lf-tag">TypeScript</span>
              <span className="lf-tag">Node.js</span>
              <span className="lf-tag">PostgreSQL</span>
              <span className="lf-tag">CSS</span>
              <span className="lf-tag">Tailwind CSS</span>
              <span className="lf-tag">Git</span>
              <span className="lf-tag">JavaScript</span>
              <span className="lf-tag">Docusaurus</span>
            </div>
          </div>
          <div className="lf-stack-logos">
            {/* React */}
            <img src="icons/tools/React.svg" width="30" height="30" />
            {/* TypeScript */}
            <img src="icons/tools/TypeScript.svg" width="30" height="30" />
            {/* JavaScript */}  
            <img src="icons/tools/JavaScript.svg" width="30" height="30" />
            {/* Node.js */}
            <img src="icons/tools/Node.svg" width="30" height="30" />
            {/* PostgreSQL */}
            <img src="icons/tools/Postgresql.svg" width="42" height="42" />
            {/* Tailwind */}
            <img src="icons/tools/Tailwind_CSS.svg" width="30" height="30" />
            {/* Git */}
            <img src="icons/tools/Git.svg" width="30" height="30" />
            {/* Docusaurus */}
            <img src="icons/tools/docusaurus.svg" width="42" height="42" />
          </div>
        </div>

        <div className="lf-card">
          <span className="lf-card-icon" style={{ color: '#f472b6' }}><IconTrendingUp /></span>
          <div className="lf-card-body">
            <span className="lf-card-label">Level</span>
            <div className="lf-tags">
              <span className="lf-tag">Entry</span>
              <span className="lf-tag">Junior</span>
            </div>
          </div>
        </div>

        <div className="lf-card">
          <span className="lf-card-icon" style={{ color: '#facc15' }}><IconUsers /></span>
          <div className="lf-card-body">
            <span className="lf-card-label">Environment</span>
            <div className="lf-tags">
              <span className="lf-tag">Collaborative team</span>
              <span className="lf-tag">Mentorship</span>
            </div>
          </div>
        </div>

      </div>

      <div className="lf-divider" style={{ marginTop: '24px' }} />

      <div className="lf-status">
        <span className="lf-status-dot" />
        <span className="lf-status-text">Open to work opportunities</span>
      </div>

    </div>
  );
};

export default LookingFor;