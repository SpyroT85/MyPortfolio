import { useDraggable } from '../hooks/useDraggable'
import { useWindowStore, type WindowState } from '../store/windowStore'
import './Window.css'
import { useState, useRef, useEffect } from 'react';

interface Props {
  window: WindowState
  children: React.ReactNode
  scale?: number
}

type ResizeDirection = 'n' | 's' | 'e' | 'w' | 'ne' | 'nw' | 'se' | 'sw';

const Window = ({ window: win, children, scale = 1 }: Props) => {
  const { closeWindow, minimizeWindow, focusWindow, maximizeWindow, moveWindow, resizeWindow, finishRestore, windows: allWindows } = useWindowStore()
  const isActive = win.zIndex === Math.max(...allWindows.filter((w: WindowState) => !w.minimized).map((w: WindowState) => w.zIndex))
  const { onMouseDown } = useDraggable(win.position, (pos) => moveWindow(win.id, pos), false, scale)
  const [minimizing, setMinimizing] = useState(false);
  const [minimizeTarget, setMinimizeTarget] = useState({ x: 0, y: 0 });
  const [noTransition, setNoTransition] = useState(false);
  const windowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (win.isRestoring) {
      const timer = setTimeout(() => finishRestore(win.id), 400);
      return () => clearTimeout(timer);
    }
  }, [win.isRestoring]);

  useEffect(() => {
    const el = windowRef.current;
    if (!el) return;
    const handler = () => handleMinimize();
    el.addEventListener('minimize-request', handler);
    return () => el.removeEventListener('minimize-request', handler);
  }, []);

  const handleMinimize = () => {
    const taskbarBtn = document.querySelector(`[data-window-id="${win.id}"]`);
    let origin = { x: 0, y: 0 };
    if (taskbarBtn && windowRef.current) {
      const btnRect = taskbarBtn.getBoundingClientRect();
      const winRect = windowRef.current.getBoundingClientRect();
      // Both in screen coords — translate needed to move window center to button center
      origin = {
        x: (btnRect.left + btnRect.width / 2 - (winRect.left + winRect.width / 2)) / scale,
        y: (btnRect.top + btnRect.height / 2 - (winRect.top + winRect.height / 2)) / scale,
      };
      setMinimizeTarget(origin);
    }
    setMinimizing(true);
    setTimeout(() => {
      minimizeWindow(win.id, origin);
      setMinimizing(false);
    }, 400);
  };

  const handleMaximize = () => {
    setNoTransition(true);
    maximizeWindow(win.id);
    requestAnimationFrame(() => requestAnimationFrame(() => setNoTransition(false)));
  };

  const startResize = (e: React.MouseEvent<HTMLDivElement>, direction: ResizeDirection) => {
    e.stopPropagation();
    e.preventDefault();
    const startX = e.clientX / scale;
    const startY = e.clientY / scale;
    const startW = win.size.w;
    const startH = win.size.h;
    const startLeft = win.position.x;
    const startTop = win.position.y;

    const onMove = (moveEvent: MouseEvent) => {
      const dx = moveEvent.clientX / scale - startX;
      const dy = moveEvent.clientY / scale - startY;
      let newW = startW, newH = startH, newX = startLeft, newY = startTop;
      if (direction.includes('e')) newW = Math.max(300, startW + dx);
      if (direction.includes('s')) newH = Math.max(200, startH + dy);
      if (direction.includes('w')) { newW = Math.max(300, startW - dx); newX = startLeft + (startW - newW); }
      if (direction.includes('n')) { newH = Math.max(200, startH - dy); newY = startTop + (startH - newH); }
      resizeWindow(win.id, { w: newW, h: newH });
      if (direction.includes('w') || direction.includes('n')) moveWindow(win.id, { x: newX, y: newY });
    };

    const onUp = () => {
      window.removeEventListener('mousemove', onMove);
      window.removeEventListener('mouseup', onUp);
    };
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onUp);
  };

  return (
    <div
      ref={windowRef}
      data-win-id={win.id}
      className={`window${win.maximized ? ' maximized' : ''}${isActive ? ' active' : ' inactive'}${minimizing ? ' minimizing' : ''}${win.isRestoring ? ' restoring' : ''}`}
      style={{
        left: win.position.x,
        top: win.position.y,
        width: win.size.w,
        height: win.size.h,
        zIndex: win.zIndex,
        display: win.minimized && !minimizing ? 'none' : undefined,
        ...(noTransition && { transition: 'none' }),
        ...((minimizing || win.isRestoring) && {
          '--minimize-x': `${win.isRestoring ? win.minimizeOrigin.x : minimizeTarget.x}px`,
          '--minimize-y': `${win.isRestoring ? win.minimizeOrigin.y : minimizeTarget.y}px`,
        } as React.CSSProperties),
      }}
      onMouseDown={() => focusWindow(win.id)}
    >
      <div className="resize-handle resize-n"  onMouseDown={e => startResize(e, 'n')} />
      <div className="resize-handle resize-s"  onMouseDown={e => startResize(e, 's')} />
      <div className="resize-handle resize-e"  onMouseDown={e => startResize(e, 'e')} />
      <div className="resize-handle resize-w"  onMouseDown={e => startResize(e, 'w')} />
      <div className="resize-handle resize-ne" onMouseDown={e => startResize(e, 'ne')} />
      <div className="resize-handle resize-nw" onMouseDown={e => startResize(e, 'nw')} />
      <div className="resize-handle resize-se" onMouseDown={e => startResize(e, 'se')} />
      <div className="resize-handle resize-sw" onMouseDown={e => startResize(e, 'sw')} />

      <div className="window-titlebar" onMouseDown={e => { onMouseDown(e); focusWindow(win.id); }}>
        <span className="window-title">{win.title}</span>
        <div className="window-controls">
          <button data-cy={`minimize-${win.app}`} className="window-btn minimize" onClick={handleMinimize}>─</button>
          <button data-cy={`maximize-${win.app}`} className="window-btn maximize" onClick={handleMaximize}>
            {win.maximized ? '❐' : '▢'}
          </button>
          <button data-cy={`close-${win.app}`} className="window-btn close" onClick={() => closeWindow(win.id)}>✕</button>
        </div>
      </div>
      <div className="window-content">{children}</div>
      <div className="window-statusbar" />
      <div className="window-resize-handle" onMouseDown={e => startResize(e, 'se')} />
    </div>
  )
}

export default Window