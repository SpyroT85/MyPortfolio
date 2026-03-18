import { useRef } from 'react';

// Custom hook to make a component draggable within a fixed area
const BASE_WIDTH = 1440;
const BASE_HEIGHT = 900;
const TASKBAR_HEIGHT = 45;
export function useDraggable(
	position: { x: number; y: number },
	onPositionChange?: (pos: { x: number; y: number }, animate?: boolean) => void,
	_snapToGrid: boolean = false,
	scale: number = 1
) {
	const dragging = useRef(false);
	const offset = useRef({ x: 0, y: 0 });
	const wasDragged = useRef(false);
	// Minimum movement in px to consider as drag
	const DRAG_THRESHOLD = 6;


	// Start dragging: record offset and set up listeners
	const onMouseDown = (e: React.MouseEvent) => {
		dragging.current = true;
		wasDragged.current = false;
		// Calculate offset between mouse and element position
		offset.current = {
			x: e.clientX / scale - position.x,
			y: e.clientY / scale - position.y,
		};
		// Change cursor to indicate dragging
		document.body.style.cursor = 'crosshair';
		// Listen for mouse move and mouse up globally
		document.addEventListener('mousemove', onMouseMove);
		document.addEventListener('mouseup', onMouseUp);
	};


	// Prevent dragging outside the allowed area
	const clampPosition = (x: number, y: number) => {
		return {
			x: Math.max(0, Math.min(x, BASE_WIDTH)),
			y: Math.max(0, Math.min(y, BASE_HEIGHT - TASKBAR_HEIGHT)),
		};
	};


	// Store the last position for use on mouse up
	let lastPos = position;


	// Handle mouse movement while dragging
	const onMouseMove = (e: MouseEvent) => {
		if (!dragging.current) return;
		// Calculate new position based on mouse movement
		const rawX = e.clientX / scale - offset.current.x;
		const rawY = e.clientY / scale - offset.current.y;
		// Check if movement exceeds drag threshold
		const dx = Math.abs(rawX - position.x);
		const dy = Math.abs(rawY - position.y);
		if (dx > DRAG_THRESHOLD || dy > DRAG_THRESHOLD) {
			wasDragged.current = true;
		}
		// Clamp position to allowed area
		const nextPos = clampPosition(rawX, rawY);
		lastPos = nextPos;
		// Notify parent of new position
		if (onPositionChange) {
			onPositionChange(nextPos);
		}
	};


	// End dragging: cleanup listeners and finalize position
	const onMouseUp = () => {
		dragging.current = false;
		document.body.style.cursor = '';
		document.removeEventListener('mousemove', onMouseMove);
		document.removeEventListener('mouseup', onMouseUp);
		// Snap to final clamped position and optionally animate
		if (onPositionChange) {
			onPositionChange(clampPosition(lastPos.x, lastPos.y), true);
		}
		// Reset drag state after event loop
		setTimeout(() => { wasDragged.current = false; }, 0);
	};

	// Return handlers and drag state ref
	return {
		onMouseDown,
		wasDragged,
	};
}