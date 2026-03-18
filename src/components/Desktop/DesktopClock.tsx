import React, { useEffect, useState } from 'react';
import './DesktopClock.css';
import { useDraggable } from '../hooks/useDraggable';

function formatDay(date: Date) {
  return date.toLocaleDateString('en-US', { weekday: 'long' }).toUpperCase();
}
function formatDate(date: Date) {
  return date.toLocaleDateString('en-US', { day: '2-digit', month: 'long', year: 'numeric' });
}
function formatTime(date: Date) {
  return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false });
}

const DesktopClock: React.FC<{ scale: number }> = ({ scale }) => {
  const [now, setNow] = useState(new Date());
  const [pos, setPos] = useState({ x:870, y: 90 });
  const { onMouseDown } = useDraggable(pos, setPos, false, scale);

  useEffect(() => {
    const timer = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div
      className="desktop-center-clock draggable-clock"
      style={{
        position: 'absolute',
        left: pos.x,
        top: pos.y,
        cursor: 'grab',
        display: 'inline-block',
        zIndex: 1,
      }}
    >
      <div
        className="clock-content"
        style={{ position: 'relative', cursor: 'grab' }}
        onMouseDown={onMouseDown}
      >
        <div className="dcc-day">{formatDay(now)}</div>
        <div className="dcc-date">{formatDate(now)}</div>
        <div className="dcc-time">{formatTime(now)}</div>
      </div>
    </div>
  );
};

export default DesktopClock;
