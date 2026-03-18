import { create } from 'zustand';

interface AudioStore {
  volume: number;
  muted: boolean;
  audioRef: React.MutableRefObject<HTMLAudioElement | null> | null;
  setVolume: (v: number) => void;
  setMuted: (m: boolean) => void;
  setAudioRef: (ref: React.MutableRefObject<HTMLAudioElement | null>) => void;
}

export const useAudioStore = create<AudioStore>((set, get) => ({
  volume: 10,
  muted: false,
  audioRef: null,

  setVolume: (v) => {
    set({ volume: v });
    const ref = get().audioRef;
    if (ref?.current) {
      ref.current.volume = v / 100;
    }
  },

  setMuted: (m) => {
    set({ muted: m });
    const ref = get().audioRef;
    if (ref?.current) {
      ref.current.muted = m;
    }
  },

  setAudioRef: (ref) => set({ audioRef: ref }),
}));