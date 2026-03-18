import React from 'react';
import { useDraggable } from '../hooks/useDraggable';
import './GlassIcons.css';

export interface GlassIconsItem {
  icon: React.ReactElement;
  color: string;
  label: string;
  customClass?: string;
  onClick?: () => void;
}

export interface GlassIconsProps {
  items: GlassIconsItem[];
  className?: string;
  dragProps?: Array<{ position: { x: number; y: number }; setPosition: (pos: { x: number; y: number }, animate?: boolean) => void }>;
  scale?: number;
}

const gradientMapping: Record<string, string> = {
  blue: 'hsla(0,0%,100%,0.08)',
  purple: 'hsla(0,0%,100%,0.08)',
  red: 'hsla(0,0%,100%,0.08)',
  indigo: 'hsla(0,0%,100%,0.08)',
  orange: 'hsla(0,0%,100%,0.08)',
  green: 'hsla(0,0%,100%,0.08)'
};

const GlassIcons: React.FC<GlassIconsProps> = ({ items, className, dragProps, scale = 1 }) => {
  const getBackgroundStyle = (color: string): React.CSSProperties => {
    if (gradientMapping[color]) {
      return { background: gradientMapping[color] };
    }
    return { background: color };
  };

  return (
    <div className={`icon-btns ${className || ''}`}>
      {items.map((item, index) => {
        const drag = dragProps ? dragProps[index] : undefined;
        const [isDragging, setIsDragging] = React.useState(false);
        const [animateSnap, setAnimateSnap] = React.useState(false);
        const setPosition = (pos: { x: number; y: number }, animate?: boolean) => {
          if (drag && drag.setPosition) drag.setPosition(pos);
          setAnimateSnap(!!animate);
          if (animate) {
            setTimeout(() => setAnimateSnap(false), 350); 
          }
        };
        const { onMouseDown, wasDragged } = useDraggable(
          drag ? drag.position : { x: 100 + index * 120, y: 200 },
          setPosition,
          false,
          scale
        );
        const handleMouseDown = (e: React.MouseEvent) => {
          setIsDragging(true);
          setAnimateSnap(false);
          onMouseDown(e);
          const handleMouseUp = () => setIsDragging(false);
          document.addEventListener('mouseup', handleMouseUp, { once: true });
        };
        const handleClick = (e: React.MouseEvent) => {
          if (wasDragged.current) {
            e.preventDefault();
            e.stopPropagation();
            return;
          }
          if (item.onClick) item.onClick();
        };
        return (
          <button
            key={index}
            type="button"
            className={`icon-btn ${item.customClass || ''}`}
            aria-label={item.label}
            onClick={handleClick}
            onMouseDown={handleMouseDown}
            style={{
              position: 'absolute',
              left: drag ? drag.position.x : 100 + index * 120,
              top: drag ? drag.position.y : 200,
              zIndex: 2,
              cursor: isDragging ? 'crosshair' : 'pointer',
              transition: animateSnap ? 'left 0.35s cubic-bezier(0.83,0,0.17,1), top 0.35s cubic-bezier(0.83,0,0.17,1)' : 'none',
            }}
          >
            <span className="icon-btn__back" style={getBackgroundStyle(item.color)}></span>
            <span className="icon-btn__front">
              <span className="icon-btn__icon" aria-hidden="true">
                {item.icon}
              </span>
            </span>
            <span className="icon-btn__label">{item.label}</span>
          </button>
        );
      })}
    </div>
  );
};

export default GlassIcons;
