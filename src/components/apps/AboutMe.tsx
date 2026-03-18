import "./AboutMe.css";
import avatar from "/src/assets/MyPhoto/spyros-tserkezos.png";
import { LuDownload } from "react-icons/lu";

const skills = ["React", "TypeScript", "Node.js", "Tailwind & Vanilla CSS", "REST APIs", "Git", "GitHub", "Jira", "CI/CD", "Docusaurus"];
const traits = ["Junior Developer", "Athens based", "Team player", "Always learning"];

const AboutMe = () => {
  return (
    <div className="about-app">

      <div className="about-header">
        <div className="about-avatar">
          <img src={avatar} alt="Spyros Tserkezos" />
        </div>
        <div className="about-header-info">
          <h1 className="about-name">Spyros Tserkezos</h1>
          <p className="about-role">Junior Frontend Developer</p>
          <p className="about-location">
            <img src="/icons/pin.svg" alt="Pin" style={{ width: '1.1em', verticalAlign: 'middle' }} /> Athens, Greece
          </p>
          <span className="about-available">✦ Open to work</span>
                    <a
                      href="/spyros-tserkezos-cv.pdf"
                      download="spyros-tserkezos-cv.pdf"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="about-download-btn"
                      style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', textDecoration: 'none' }}
                    >
                      <LuDownload size={16} />
                      Download CV
                    </a>
          <p className="about-open">
            Open to new roles and excited to keep growing whether that's joining a great team, working on interesting projects, or picking up new skills along the way.
          </p>
        </div>
      </div>

      <div className="about-divider" />

      <div className="about-section">
        <p className="about-bio">
          I'm a Junior Frontend Developer with a passion for building clean, functional, and visually polished web interfaces.
          Creative by nature, consistent end always in search of growth, both as a developer and as a person.
        </p>
      </div>

      <div className="about-traits">
        {traits.map((t) => (
          <span key={t} className="about-trait">{t}</span>
        ))}
      </div>

      <div className="about-divider" />

      <div className="about-section">
        <h2 className="about-section-title">Experience</h2>
        <div className="about-exp-card">
          <div className="about-exp-header">
            <img src="/icons/gasparai.svg" alt="GasparAI Logo" style={{ width: '2.6em', verticalAlign: 'middle', marginRight: '10px' }} />
            <span className="about-exp-role">Frontend Developer</span>
            <span className="about-exp-date">Jul – Dec 2025</span>
          </div>
          <span className="about-exp-company gaspar">Gaspar AI · Athens, Greece</span>
          <p className="about-exp-desc">
            Developed and maintained an Admin Portal and Commercial Site. Built reusable
            UI components still in production today, shipped UI/UX improvements that
            made a real difference in usability, and created the company's documentation
            site from scratch using Docusaurus. Collaborated with the dev team through
            Git/GitHub, Jira, and CI/CD pipelines.
          </p>
        </div>
      </div>

      <div className="about-divider" />

      <div className="about-section">
        <h2 className="about-section-title">Skills</h2>
        <div className="about-skills">
          {skills.map((s) => (
            <span key={s} className="about-skill">{s}</span>
          ))}
        </div>
      </div>

      <div className="about-divider" />

      <div className="about-section">
        <h2 className="about-section-title">Education</h2>
        <div className="about-edu">
          <span className="about-edu-title">Web Designer & Video Games Developer</span>
          <span className="about-edu-school">IVT AKMI · Athens, Greece</span>
        </div>
      </div>

    </div>
  );
};

export default AboutMe;