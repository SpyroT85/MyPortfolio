import "./Projects.css";
import { FiExternalLink, FiGithub } from "react-icons/fi";
import { useState, useEffect } from "react";

interface Project {
  title: string;
  subtitle: string;
  description: string;
  stack: string[];
  github?: string;
  live?: string;
  thumbnails?: string[];
  blurBackdrop?: boolean;
  thumbnailPosition?: string;
  tag: string;
  tagColor: string;
}

const projects: Project[] = [
  {
    title: "Atrani Store",
    subtitle: "Full Stack E-Commerce",
    description:
      "A full stack e-commerce platform for a luxury accessories brand with a custom admin panel. Built with React and Node.js/Express REST API, featuring JWT + Google OAuth authentication, email verification via Brevo, role based access control, Cloudinary image uploads, an admin invitation system, and an analytics dashboard. Deployed on Vercel and Render with PostgreSQL on Neon.",
    stack: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "Tailwind CSS", "Cloudinary", "Brevo"],
    github: "https://github.com/SpyroT85/Atrani-Store-Fullstack",
    live: "https://atrani.spyros-tserkezos.dev/",
    thumbnails: [
      "/thumbnails/atrani/1.png",
      "/thumbnails/atrani/2.png",
      "/thumbnails/atrani/3.png",
      "/thumbnails/atrani/4.png",
    ],
    tag: "Personal",
    tagColor: "tag-personal",
  },
  {
    title: "Atrani Admin Panel",
    subtitle: "Internal Dashboard",
    description:
      "A custom built admin dashboard for the Atrani platform. Features include product management with real time stock tracking, a notification system for new signups and low stock alerts, an analytics page with charts, dark mode, and secure admin-only access via JWT and an invitation system.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Recharts", "Node.js", "PostgreSQL"],
    github: "https://github.com/SpyroT85/Atrani-Store-Fullstack",
    live: "https://admin.spyros-tserkezos.dev",
    thumbnails: [
      "/thumbnails/admin-panel/admin-panel1.png",
      "/thumbnails/admin-panel/admin-panel2.png",
      "/thumbnails/admin-panel/admin-panel3.png",
      "/thumbnails/admin-panel/admin-panel4.png",
      "/thumbnails/admin-panel/admin-panel5.png",
      "/thumbnails/admin-panel/admin-panel6.png",
    ],
    thumbnailPosition: "top center",
    tag: "Personal",
    tagColor: "tag-personal",
  },
  {
    title: "Grill Gamers Bot",
    subtitle: "Discord Bot",
    description:
      "Discord bot that automatically notifies your server when a new video, short, or live stream is published on a YouTube channel. Built with Node.js, YouTube Data API v3 and Discord Webhooks.",
    stack: ["Node.js", "axios", "node-cron", "Upstash Redis", "Render"],
    github: "https://github.com/SpyroT85/grillgamers-youtube-bot",
    thumbnails: [
      "/thumbnails/grill-gamers/grillgamers1.png",
      "/thumbnails/grill-gamers/grillgamers2.png",
    ],
    tag: "Personal",
    tagColor: "tag-personal",
  },
  {
    title: "Gaspar AI",
    subtitle: "Documentation Site",
    description:
      "Documentation site built with Docusaurus during my internship. Currently live and actively used by customers in production.",
    stack: ["Docusaurus", "React", "TypeScript", "Desktop"],
    live: "https://docs.gaspar.ai",
    thumbnails: ["/thumbnails/gaspar-ai/gaspar-ai.png"],
    tag: "Work",
    tagColor: "tag-work",
  },
  {
    title: "Chat Virtual Assistant",
    subtitle: "Chat Widget",
    description:
      "Chat widget with mock conversation data, file context support, persistent chat history, and typing indicators.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Zustand", "Desktop"],
    github: "https://github.com/SpyroT85/Atrani-store",
    live: "https://github.com/SpyroT85/Chat-Bot-Assistant-ESPA-Project-",
    thumbnails: [
      "/thumbnails/espa/espa1.png",
      "/thumbnails/espa/espa2.png",
    ],
    blurBackdrop: true,
    tag: "Personal",
    tagColor: "tag-personal",
  },
];

interface CarouselProps {
  thumbnails: string[];
  blurBackdrop?: boolean;
  thumbnailPosition?: string;
}

const FadeCarousel = ({ thumbnails, blurBackdrop = false, thumbnailPosition = "center" }: CarouselProps) => {
  const [current, setCurrent] = useState(0);
  const [prev, setPrev] = useState<number | null>(null);

  useEffect(() => {
    if (thumbnails.length <= 1) return;
    const interval = setInterval(() => {
      setCurrent((c) => {
        setPrev(c);
        return (c + 1) % thumbnails.length;
      });
    }, 2500);
    return () => clearInterval(interval);
  }, [thumbnails.length]);

  useEffect(() => {
    if (prev === null) return;
    const t = setTimeout(() => setPrev(null), 700);
    return () => clearTimeout(t);
  }, [prev]);

  const goTo = (i: number) => {
    if (i === current) return;
    setPrev(current);
    setCurrent(i);
  };

  return (
    <div className="kb-carousel">
      {blurBackdrop ? (
        <>
          <div className="kb-slide--backdrop" style={{ backgroundImage: `url(${thumbnails[current]})` }} />
          <div key={current} className="kb-slide--foreground" style={{ backgroundImage: `url(${thumbnails[current]})` }} />
        </>
      ) : (
        <>
          {prev !== null && (
            <div className="kb-slide kb-slide--out" style={{ backgroundImage: `url(${thumbnails[prev]})`, backgroundPosition: thumbnailPosition }} />
          )}
          <div key={current} className="kb-slide kb-slide--in" style={{ backgroundImage: `url(${thumbnails[current]})`, backgroundPosition: thumbnailPosition }} />
        </>
      )}
      {thumbnails.length > 1 && (
        <div className="kb-dots">
          {thumbnails.map((_, i) => (
            <span key={i} className={`kb-dot${i === current ? " kb-dot--active" : ""}`} onClick={() => goTo(i)} />
          ))}
        </div>
      )}
    </div>
  );
};

const Projects = () => {
  return (
    <div className="projects-app">
      <div className="projects-grid">
        {projects.map((p, i) => {
          const isWide = i === projects.length - 1 && projects.length % 2 !== 0;
          const thumbLink = p.live ?? p.github;
          return (
            <div className={`project-wrapper${isWide ? " project-card--wide" : ""}`} key={p.title}>

              {/* ── Header row ── */}
              <div className="project-header">
                <span className="project-header-title">{p.title}</span>
                <span className="project-header-num">0{i + 1}</span>
              </div>

              {/* ── Card ── */}
              <div className="project-card">
                <div className="project-thumb">
                  {p.thumbnails && p.thumbnails.length > 0 ? (
                    thumbLink ? (
                      <a href={thumbLink} target="_blank" rel="noopener noreferrer" className="project-thumb-link">
                        <FadeCarousel thumbnails={p.thumbnails} blurBackdrop={p.blurBackdrop} thumbnailPosition={p.thumbnailPosition} />
                      </a>
                    ) : (
                      <FadeCarousel thumbnails={p.thumbnails} blurBackdrop={p.blurBackdrop} thumbnailPosition={p.thumbnailPosition} />
                    )
                  ) : (
                    <div className="project-thumb-placeholder">
                      <div className="project-thumb-grid" />
                      <span className="project-thumb-initial">{p.title.charAt(0)}</span>
                    </div>
                  )}
                </div>

                <div className="project-body">
                  <div className="project-title-row">
                    <h3 className="project-title">{p.title}</h3>
                    <span className={`project-tag ${p.tagColor}`}>{p.tag}</span>
                  </div>
                  <span className="project-subtitle">{p.subtitle}</span>
                  <p className="project-desc">{p.description}</p>

                  <div className="project-stack">
                    {p.stack.map((s) => (
                      <span key={s} className="project-badge">{s}</span>
                    ))}
                  </div>

                  <div className="project-links">
                    {p.github && (
                      <a href={p.github} target="_blank" rel="noreferrer" className="project-link">
                        <FiGithub size={11} /> GitHub
                      </a>
                    )}
                    {p.live && (
                      <a href={p.live} target="_blank" rel="noreferrer" className="project-link project-link--live">
                        <FiExternalLink size={11} /> Live
                      </a>
                    )}
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Projects;