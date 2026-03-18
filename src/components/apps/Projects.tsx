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
  tag: string;
  tagColor: string;
}
const projects: Project[] = [
  {
    title: "Atrani Store",
    subtitle: "E-Commerce",
    description:
      "E-commerce demo for a luxury accessories brand, watches, pens, inkwells & compasses. Product pages, cart with Zustand, smooth animations with Framer Motion.",
    stack: ["React", "TypeScript", "Tailwind CSS", "Responsive"],
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
    live: "https://virtual-assistant.spyros-tserkezos.dev/",
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
}

const FadeCarousel = ({ thumbnails, blurBackdrop = false }: CarouselProps) => {
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
            <div className="kb-slide kb-slide--out" style={{ backgroundImage: `url(${thumbnails[prev]})` }} />
          )}
          <div key={current} className="kb-slide kb-slide--in" style={{ backgroundImage: `url(${thumbnails[current]})` }} />
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
                    p.live ? (
                      <a href={p.live} target="_blank" rel="noopener noreferrer" className="project-thumb-link">
                        <FadeCarousel thumbnails={p.thumbnails} blurBackdrop={p.blurBackdrop} />
                      </a>
                    ) : (
                      <FadeCarousel thumbnails={p.thumbnails} blurBackdrop={p.blurBackdrop} />
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