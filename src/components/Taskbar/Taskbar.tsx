import { useState, useEffect, useRef } from 'react';
import { useWindowStore } from '../store/windowStore';
import VolumeControl from '../VolumeControl/VolumeControl';
import './Taskbar.css';

const Clock = () => {
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const t = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="clock">
      <span className="clock-time">
        {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true })}
      </span>
      <span className="clock-date">
        {time.toLocaleDateString('en-US')}
      </span>
    </div>
  );
};

const StartMenuButton = () => {
  const [showStartMenu, setShowStartMenu] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setShowStartMenu(false);
      }
    };
    if (showStartMenu) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showStartMenu]);

  return (
    <div ref={menuRef} style={{ position: 'relative' }}>
      <button
        onClick={() => setShowStartMenu(!showStartMenu)}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, display: 'flex' }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 80" width="25" height="64" opacity="0.8">
          <rect x="0"  y="0"  width="48" height="36" fill="white"/>
          <rect x="52" y="0"  width="48" height="36" fill="white"/>
          <rect x="0"  y="40" width="48" height="36" fill="white"/>
          <rect x="52" y="40" width="48" height="36" fill="white"/>
        </svg>
      </button>

      {showStartMenu && (
        <div className="start-menu">
          <button className="start-menu-item" onClick={() => window.location.reload()}>
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64" />
              <line x1="12" y1="2" x2="12" y2="12" />
            </svg>
            Shut Down
          </button>
        </div>
      )}
    </div>
  );
};

// No counterZoom prop needed anymore
const Taskbar = () => {
  const { windows, restoreWindow, focusWindow } = useWindowStore();

  const nonMinimized = windows.filter(w => !w.minimized);
  const frontmostWindow = nonMinimized.length > 0
    ? nonMinimized.reduce((max, w) => w.zIndex > max.zIndex ? w : max, nonMinimized[0])
    : null;

  return (
    <div className="taskbar">
      <div className="taskbar-left">
        <StartMenuButton />
        <div className="taskbar-divider" />
      </div>

      <div className="taskbar-windows">
        <div className={`taskbar-group${frontmostWindow ? ' active' : ''}`}>
          {windows.map(win => {
            let iconSrc = '';
            if (win.app === 'about')      iconSrc = '/icons/folder/about-me.png';
            else if (win.app === 'projects')  iconSrc = '/icons/folder/projects.png';
            else if (win.app === 'contact')   iconSrc = '/icons/folder/contact-me.png';
            else if (win.app === 'lookingfor') iconSrc = '/icons/folder/looking-for.png';

            return (
              <button
                key={win.id}
                data-window-id={win.id}
                className={`taskbar-window-btn${frontmostWindow && win.id === frontmostWindow.id ? ' active' : ''}`}
                onClick={() => {
                  if (win.minimized) {
                    restoreWindow(win.id);
                  } else if (frontmostWindow && win.id === frontmostWindow.id) {
                    const windowEl = document.querySelector(`[data-win-id="${win.id}"]`);
                    if (windowEl) {
                      windowEl.dispatchEvent(new CustomEvent('minimize-request', { bubbles: false }));
                    }
                  } else {
                    focusWindow(win.id);
                  }
                }}
                style={{ outline: 'none', border: 'none', padding: 0, background: 'none', height: '100%' }}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', height: '100%', gap: '10px' }}>
                  <span className="taskbar-window-icon">
                    <img src={iconSrc} alt="" style={{ height: '30px', width: '30px', objectFit: 'contain' }} />
                  </span>
                  <span className="taskbar-window-title" style={{ color: '#fff', paddingRight: 12 }}>{win.title}</span>
                </span>
              </button>
            );
          })}
        </div>

        <div className="taskbar-tray">
          <div className="taskbar-divider" />
          <VolumeControl />
          <Clock />
        </div>
      </div>
    </div>
  );
};

export default Taskbar;