import { useState, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { FiVolume2, FiVolumeX, FiVolume1 } from 'react-icons/fi';
import { useAudioStore } from '../store/audioStore';
import './VolumeControl.css';

interface VolumeControlProps {
  counterZoom?: number;
}

const VolumeControl = ({ counterZoom = 1 }: VolumeControlProps) => {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const { volume, muted, setVolume, setMuted } = useAudioStore();

  // Close on outside click
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node) &&
          btnRef.current && !btnRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    if (open) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [open]);

  // Global scroll handler when popup is open
  useEffect(() => {
    if (!open) return;
    const handleGlobalScroll = (e: WheelEvent) => {
      if (panelRef.current?.contains(e.target as Node)) return;
      e.preventDefault();
      const delta = e.deltaY < 0 ? 5 : -5;
      setVolume(Math.min(100, Math.max(0, volume + delta)));
    };
    document.addEventListener('wheel', handleGlobalScroll, { passive: false });
    return () => document.removeEventListener('wheel', handleGlobalScroll);
  }, [open, volume, setVolume]);

  // Global keyboard handler when popup is open
  useEffect(() => {
    if (!open) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      let delta = 0;
      if (e.key === 'ArrowUp' || e.key === 'ArrowRight') delta = 5;
      else if (e.key === 'ArrowDown' || e.key === 'ArrowLeft') delta = -5;
      else if (e.key === 'PageUp') delta = 10;
      else if (e.key === 'PageDown') delta = -10;
      else if (e.key === 'Escape') { setOpen(false); return; }
      else return;

      e.preventDefault();
      setVolume(Math.min(100, Math.max(0, volume + delta)));
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, volume, setVolume]);

  const handleScroll = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    setVolume(Math.min(100, Math.max(0, volume + delta)));
  };

  const VolumeIcon = () => {
    if (muted || volume === 0) return <FiVolumeX size={20} />;
    return (
      <svg width="22" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
        style={{ overflow: 'visible' }}>
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        {volume > 0 && <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />}
        {volume > 33 && <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />}
        {volume > 66 && <path d="M22 2a15 15 0 0 1 0 20" />}
      </svg>
    );
  };

  const effectiveVolume = muted ? 0 : volume;

  const getPanelStyle = (): React.CSSProperties => {
    if (!btnRef.current) return {};
    const rect = btnRef.current.getBoundingClientRect();
    return {
      position: 'fixed',
      bottom: `${window.innerHeight - rect.top + 15}px`,
      right: `${window.innerWidth - rect.right - 20}px`,
      zIndex: 2147483647,
      zoom: counterZoom,
    };
  };

  const handleOpen = () => {
    setOpen(o => {
      if (!o && muted) setMuted(false);
      return !o;
    });
  };

  return (
    <div className="vol-ctrl" onWheel={handleScroll}>
      <button
        ref={btnRef}
        className="vol-ctrl-btn"
        onClick={handleOpen}
        title={`Volume: ${volume}%`}
      >
        <VolumeIcon />
      </button>

      {open && createPortal(
        <div ref={panelRef} className="vol-panel" style={getPanelStyle()}>
          <div className="vol-panel-header">
            <span className="vol-panel-label">Volume</span>
            <span className="vol-panel-value">{muted ? 'Muted' : `${volume}%`}</span>
          </div>

          <div className="vol-slider-row">
            <button
              className="vol-mute-btn"
              onClick={() => setMuted(!muted)}
              title={muted ? 'Unmute' : 'Mute'}
            >
              {muted || volume === 0
                ? <FiVolumeX size={14} />
                : volume < 50
                  ? <FiVolume1 size={14} />
                  : <FiVolume2 size={14} />
              }
            </button>

            <div className="vol-track-wrap">
              <div
                className="vol-track-fill"
                style={{ width: `${effectiveVolume}%` }}
              />
              <input
                type="range"
                min={0}
                max={100}
                value={volume}
                onChange={e => setVolume(Number(e.target.value))}
                onWheel={e => {
                  e.stopPropagation();
                  const delta = e.deltaY < 0 ? 5 : -5;
                  setVolume(Math.min(100, Math.max(0, volume + delta)));
                }}
                className="vol-range"
              />
            </div>
          </div>
        </div>, document.body
      )}
    </div>
  );
};

export default VolumeControl;