import { useState, useEffect } from 'react';
import AboutMe from '../apps/AboutMe';
import Projects from '../apps/Projects';
import ContactMe from '../apps/ContactMe';
import LookingFor from '../apps/LookingFor';
import './Desktop.css';
import GlassIcons from '../GlassIcons/GlassIcons';
import WeatherWidget from "../WeatherWidget/WeatherWidget";
import DesktopClock from './DesktopClock';
import Window from '../Window/Window';
import { useWindowStore } from '../store/windowStore';
import { FiUser, FiFolder, FiMail, FiSearch, FiX } from 'react-icons/fi';
import TunifyWidget from "../TunifyWidget/TunifyWidget";
import Taskbar from '../Taskbar/Taskbar';
import { LuDownload } from 'react-icons/lu';

const BASE_WIDTH = 1440;
const BASE_HEIGHT = 900;

const MOBILE_APPS = [
  { label: 'About Me\n& Resume', icon: <FiUser size={28} />,   app: 'about'      as const },
  { label: 'Projects',           icon: <FiFolder size={28} />, app: 'projects'   as const },
  { label: 'Contact Me',         icon: <FiMail size={28} />,   app: 'contact'    as const },
  { label: 'Looking For',        icon: <FiSearch size={28} />, app: 'lookingfor' as const },
];

const Desktop = () => {
  const { windows, openWindow, closeWindow, restoreWindow, focusWindow } = useWindowStore();
  const topZIndex = useWindowStore(s => s.topZIndex);

  const [scale, setScale] = useState(() =>
    Math.max(0.6, Math.min(window.innerWidth / BASE_WIDTH, (window.innerHeight - 40) / BASE_HEIGHT))
  );
  const [isMobile, setIsMobile] = useState(() => window.innerWidth < 768);
  const [mobileActiveApp, setMobileActiveApp] = useState<string | null>(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setScale(Math.max(0.6, Math.min(window.innerWidth / BASE_WIDTH, (window.innerHeight - 40) / BASE_HEIGHT)));
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleIconClick = (app: 'about' | 'projects' | 'contact' | 'lookingfor') => {
    const existing = windows.find(w => w.app === app);
    if (!existing) { openWindow(app); return; }
    if (existing.minimized) { restoreWindow(existing.id); return; }
    const isActive = existing.zIndex === topZIndex;
    if (isActive) {
      const el = document.querySelector(`[data-win-id="${existing.id}"]`);
      el?.dispatchEvent(new Event('minimize-request'));
    } else {
      focusWindow(existing.id);
    }
  };

  const items = [
    { icon: <FiUser size={20} />,   color: 'hsla(0, 0%, 50%, 0.6)', label: 'About Me\n& Resume', onClick: () => handleIconClick('about') },
    { icon: <FiFolder size={20} />, color: 'hsla(0, 0%, 50%, 0.6)', label: 'Projects',    onClick: () => handleIconClick('projects') },
    { icon: <FiMail size={20} />,   color: 'hsla(0, 0%, 50%, 0.6)', label: 'Contact me',  onClick: () => handleIconClick('contact') },
    { icon: <FiSearch size={20} />, color: 'hsla(0, 0%, 50%, 0.6)', label: 'Looking For', onClick: () => handleIconClick('lookingfor') },
  ];

  const [iconPositionsState, setIconPositionsState] = useState([
    { x: BASE_WIDTH * 0.60, y: BASE_HEIGHT * 0.46 },
    { x: BASE_WIDTH * 0.71, y: BASE_HEIGHT * 0.46 },
    { x: BASE_WIDTH * 0.82, y: BASE_HEIGHT * 0.46 },
    { x: BASE_WIDTH * 0.93, y: BASE_HEIGHT * 0.46 },
  ]);

  const iconDragProps = items.map((_item, idx) => ({
    position: iconPositionsState[idx],
    setPosition: (pos: { x: number; y: number }, ..._args: any[]) => {
      setIconPositionsState(prev => prev.map((p, i) => i === idx ? pos : p));
    },
  }));

  const openMobileApp = (app: typeof MOBILE_APPS[0]['app']) => {
    setMobileActiveApp(app);
    openWindow(app);
  };

  const closeMobileApp = () => {
    if (mobileActiveApp) {
      const win = windows.find(w => w.app === mobileActiveApp);
      if (win) closeWindow(win.id);
    }
    setMobileActiveApp(null);
  };

  if (isMobile) {
    const activeWindow = windows.find(w => w.app === mobileActiveApp && !w.minimized);
    return (
      <div className="desktop mobile-desktop">
        {activeWindow && (
          <div className="mobile-app-overlay">
            <div className="mobile-app-header">
              <a href="/spyros-tserkezos-cv.pdf" download="spyros-tserkezos-cv.pdf" target="_blank" rel="noopener noreferrer"
                className="mobile-download-btn" style={{ visibility: activeWindow.app === 'about' ? 'visible' : 'hidden' }}>
                <LuDownload size={13} /> Download CV
              </a>
              <span className="mobile-app-title">{activeWindow.title}</span>
              <button className="mobile-close-btn" onClick={closeMobileApp}><FiX size={18} /></button>
            </div>
            <div className="mobile-app-content">
              {activeWindow.app === 'about'      && <AboutMe />}
              {activeWindow.app === 'projects'   && <Projects />}
              {activeWindow.app === 'contact'    && <ContactMe />}
              {activeWindow.app === 'lookingfor' && <LookingFor />}
            </div>
          </div>
        )}
        {!activeWindow && (
          <>
            <div className="mobile-weather-bar"><WeatherWidget mobileHomescreen /></div>
            <div className="mobile-icons-grid">
              {MOBILE_APPS.map((item) => (
                <button key={item.app} className="mobile-icon-btn" onClick={() => openMobileApp(item.app)}>
                  <span className="mobile-icon-wrap">{item.icon}</span>
                  <span className="mobile-icon-label">{item.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
      </div>
    );
  }

  // DESKTOP — windows inside scaled container
  const hasMaximized = windows.some(w => w.maximized && !w.minimized);
  return (
    <div className="desktop">
      <div
        className="desktop-area"
        style={{
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
          width: BASE_WIDTH,
          height: BASE_HEIGHT,
          position: 'absolute',
          top: 0,
          left: 0,
        }}
      >
        <GlassIcons items={items} dragProps={iconDragProps} scale={scale} />
        <DesktopClock scale={scale} />

        {/* Windows inside scaled container — no double scale issue */}
        {windows.map(win => (
          <Window key={win.id} window={win} scale={scale}>
            {win.app === 'about'      && <AboutMe />}
            {win.app === 'projects'   && <Projects />}
            {win.app === 'contact'    && <ContactMe />}
            {win.app === 'lookingfor' && <LookingFor />}
          </Window>
        ))}
      </div>

      <div className="right-widgets-column" style={{ zIndex: hasMaximized ? 10 : 9999 }}>
        <div className="widget-box"><WeatherWidget /></div>
        <div className="widget-box"><TunifyWidget /></div>
      </div>
      <Taskbar />
    </div>
  );
};

export default Desktop;