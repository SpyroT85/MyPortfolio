import { create } from 'zustand'

export type AppType = 'about' | 'projects' | 'contact' | 'lookingfor'

export interface WindowState {
  id: string
  app: AppType
  title: string
  position: { x: number; y: number }
  size: { w: number; h: number }
  previousPosition?: { x: number; y: number }
  previousSize?: { w: number; h: number }
  minimized: boolean
  maximized: boolean
  isRestoring: boolean
  zIndex: number
  minimizeOrigin: { x: number; y: number }
}

interface Store {
  windows: WindowState[]
  topZIndex: number
  openWindow: (app: AppType) => void
  closeWindow: (id: string) => void
  minimizeWindow: (id: string, origin?: { x: number; y: number }) => void
  focusWindow: (id: string) => void
  moveWindow: (id: string, position: { x: number; y: number }) => void
  maximizeWindow: (id: string) => void
  restoreWindow: (id: string) => void
  resizeWindow: (id: string, size: { w: number; h: number }) => void
  finishRestore: (id: string) => void
}

const APP_TITLES: Record<AppType, string> = {
  about: 'About Me',
  projects: 'Projects',
  contact: 'Contact',
  lookingfor: 'Looking For',
}

const BASE_WIDTH = 1440;
const BASE_HEIGHT = 900;
const TASKBAR_HEIGHT = 45;

export const useWindowStore = create<Store>((set) => ({
  windows: [{
    id: 'about-default',
    app: 'about',
    title: 'About Me',
    position: { x: 20, y: 20 },
    size: { w: 750, h: 850 },
    minimized: false,
    maximized: false,
    isRestoring: false,
    zIndex: 11,
    minimizeOrigin: { x: 0, y: 0 },
  }],
  topZIndex: 10,

  openWindow: (app) => set((state) => {
    const existing = state.windows.find(w => w.app === app)
    if (existing) {
      return {
        windows: state.windows.map(w =>
          w.id === existing.id
            ? { ...w, minimized: false, isRestoring: true, zIndex: state.topZIndex + 1 }
            : w
        ),
        topZIndex: state.topZIndex + 1,
      }
    }
    const newWindow: WindowState = {
      id: `${app}-${Date.now()}`,
      app,
      title: APP_TITLES[app],
      position: { x: 20 + state.windows.length * 30, y: 20 + state.windows.length * 30 },
      size: app === 'projects' ? { w: 1500, h: 830 } : { w: 1100, h: 750 },
      minimized: false,
      maximized: false,
      isRestoring: false,
      zIndex: state.topZIndex + 1,
      minimizeOrigin: { x: 0, y: 0 },
    }
    return { windows: [...state.windows, newWindow], topZIndex: state.topZIndex + 1 }
  }),

  closeWindow: (id) => set((state) => ({
    windows: state.windows.filter(w => w.id !== id),
  })),

  minimizeWindow: (id, origin) => set((state) => ({
    windows: state.windows.map(w =>
      w.id === id ? { ...w, minimized: true, isRestoring: false, minimizeOrigin: origin ?? { x: 0, y: 0 } } : w
    ),
  })),

  focusWindow: (id) => set((state) => ({
    windows: state.windows.map(w =>
      w.id === id ? { ...w, zIndex: state.topZIndex + 1 } : w
    ),
    topZIndex: state.topZIndex + 1,
  })),

  moveWindow: (id, position) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, position } : w),
  })),

  maximizeWindow: (id) => set((state) => ({
    windows: state.windows.map(w => {
      if (w.id !== id) return w
      if (w.maximized) {
        return {
          ...w,
          maximized: false,
          position: w.previousPosition ?? { x: 100, y: 80 },
          size: w.previousSize ?? { w: 600, h: 400 },
        }
      } else {
        // Windows are inside the scaled container so use BASE coords
        return {
          ...w,
          maximized: true,
          previousPosition: w.position,
          previousSize: w.size,
          position: { x: 0, y: 0 },
          size: { w: BASE_WIDTH, h: BASE_HEIGHT - TASKBAR_HEIGHT },
        }
      }
    }),
  })),

  restoreWindow: (id) => set((state) => ({
    windows: state.windows.map(w =>
      w.id === id ? { ...w, minimized: false, isRestoring: true, zIndex: state.topZIndex + 1 } : w
    ),
    topZIndex: state.topZIndex + 1,
  })),

  finishRestore: (id) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, isRestoring: false } : w),
  })),

  resizeWindow: (id, size) => set((state) => ({
    windows: state.windows.map(w => w.id === id ? { ...w, size } : w),
  })),
}))