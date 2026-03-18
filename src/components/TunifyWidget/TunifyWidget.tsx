import { useState, useRef, useEffect } from "react";
import { FiPlay, FiPause, FiList, FiVolume2, FiVolumeX, FiRadio, FiSkipBack, FiSkipForward } from "react-icons/fi";
import "./TunifyWidget.css";
import Tooltip from "../Tooltip/Tooltip";
import { useAudioStore } from "../store/audioStore";

interface Station {
  id: number;
  name: string;
  genre: string;
  streamUrl: string;
  bg: string;
}

const stations: Station[] = [
  { id: 1, name: "Fallout Radio", genre: "Vintage, Oldies & Jazz", streamUrl: "https://cast2.asurahosting.com/proxy/1940sradio/stream/", bg: "linear-gradient(135deg, #2c1810, #8b4513)" },
  { id: 2, name: "Silent Hill Station", genre: "SH Ambience Music", streamUrl: "https://ice1.somafm.com/dronezone-128-mp3", bg: "linear-gradient(135deg, #0a0a1a, #680b0b)" },
  { id: 3, name: "Left Coast", genre: "1920s & 30s Jazz & Blues", streamUrl: "https://ice1.somafm.com/folkfwd-128-mp3", bg: "linear-gradient(135deg, #1a0a00, #4a2000)" },
  { id: 4, name: "Country Station", genre: "Country Music", streamUrl: "https://ice1.somafm.com/bootliquor-128-mp3", bg: "linear-gradient(135deg, #1a1a2e, #4a3728)" },
  { id: 5, name: "Illinois Street Lounge", genre: "Retro Lounge 50s/60s", streamUrl: "https://ice1.somafm.com/illstreet-128-mp3", bg: "linear-gradient(135deg, #1b1b2f, #3d3d6e)" },
];

const TunifyWidget = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showQueue, setShowQueue] = useState(true);
  const [showVolumeTooltip, setShowVolumeTooltip] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const { volume, muted, setVolume, setMuted, setAudioRef } = useAudioStore();

  const current = stations[currentIndex];

  useEffect(() => {
    const audio = new Audio();
    audio.crossOrigin = "anonymous";
    audio.volume = volume / 100;
    audio.muted = true;
    audio.src = stations[0].streamUrl;
    audioRef.current = audio;
    setAudioRef(audioRef);
    setMuted(true);
    audio.play().then(() => setIsPlaying(true)).catch(() => {});
    return () => {
      audio.pause();
    };
  }, []);

  const loadStation = async (url: string) => {
    if (!audioRef.current) {
      audioRef.current = new Audio();
    }
    const audio = audioRef.current;
    try {
      audio.pause();
      setIsPlaying(false);
      audio.crossOrigin = "anonymous";
      audio.src = url;
      audio.volume = volume / 100;
      audio.muted = muted;
      audio.load();
      await audio.play();
      setIsPlaying(true);
    } catch (err) {
      const error = err as DOMException;
      if (error.name !== 'AbortError') {
        console.error('Audio error:', error.name, error.message);
      }
    }
  };

  const togglePlay = () => {
    if (!audioRef.current || !audioRef.current.src) {
      loadStation(current.streamUrl);
      return;
    }
    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(console.error);
    }
  };

  const toggleMute = () => {
    setMuted(!muted);
  };

  const handleStationClick = (index: number) => {
    setCurrentIndex(index);
    setShowQueue(true);
    loadStation(stations[index].streamUrl);
  };

  const handleVolume = (val: number) => {
    setVolume(val);
    if (val > 0) setMuted(false);
  };

  const handleVolumeScroll = (e: React.WheelEvent<HTMLInputElement>) => {
    e.preventDefault();
    const delta = e.deltaY < 0 ? 5 : -5;
    const newVolume = Math.min(100, Math.max(0, volume + delta));
    setVolume(newVolume);
    if (newVolume > 0) setMuted(false);
  };

  return (
    <div className="tunify-widget">
      <div className="tunify-album-art" style={{ background: current.bg }}>
        <div className="tunify-art-inner">
          <FiRadio size={32} color="rgba(255,255,255,0.4)" />
        </div>
        {isPlaying && <div className="tunify-live-badge">LIVE</div>}
      </div>

      <div className="tunify-info-row">
        <div className="tunify-info">
          <p className="tunify-title">{current.name}</p>
          <p className="tunify-artist">{current.genre}</p>
        </div>
        <Tooltip text="Stations">
          <button className={`tunify-icon-btn ${showQueue ? "active" : ""}`} onClick={() => setShowQueue(!showQueue)}>
            <FiList size={16} />
          </button>
        </Tooltip>
      </div>

      <div className="tunify-controls">
        <Tooltip text="Previous Station">
          <button className="tunify-icon-btn" onClick={() => handleStationClick(currentIndex === 0 ? stations.length - 1 : currentIndex - 1)}>
            <FiSkipBack size={20} />
          </button>
        </Tooltip>

        <Tooltip text={isPlaying ? "Pause" : "Play"}>
          <button className="tunify-play" onClick={togglePlay}>
            {isPlaying ? <FiPause size={18} /> : <FiPlay size={18} />}
          </button>
        </Tooltip>

        <Tooltip text="Next Station">
          <button className="tunify-icon-btn" onClick={() => handleStationClick((currentIndex + 1) % stations.length)}>
            <FiSkipForward size={20} />
          </button>
        </Tooltip>
      </div>

      <div className="tunify-volume">
        <Tooltip text={muted ? "Unmute" : "Mute"}>
          <button className="tunify-icon-btn" onClick={toggleMute}>
            {muted ? <FiVolumeX size={16} /> : <FiVolume2 size={16} />}
          </button>
        </Tooltip>
        <div className="tunify-volume-wrapper">
          {showVolumeTooltip && (
            <div className="tunify-volume-tooltip">{volume}%</div>
          )}
          <input
            type="range"
            min={0}
            max={100}
            value={volume}
            onChange={(e) => handleVolume(Number(e.target.value))}
            onMouseDown={() => setShowVolumeTooltip(true)}
            onMouseUp={() => setShowVolumeTooltip(false)}
            onWheel={handleVolumeScroll}
            className="tunify-volume-slider"
          />
        </div>
      </div>

      {showQueue && (
        <div className="tunify-queue">
          {stations.map((station, index) => (
            <div
              key={station.id}
              className={`tunify-queue-item ${index === currentIndex ? "active" : ""}`}
              onClick={() => handleStationClick(index)}
            >
              <div className="tunify-queue-art" style={{ background: station.bg }}>
                <FiRadio size={14} color="rgba(255,255,255,0.6)" />
              </div>
              <div className="tunify-queue-info">
                <p className="tunify-queue-title">{station.name}</p>
                <p className="tunify-queue-artist">{station.genre}</p>
              </div>
              {index === currentIndex && isPlaying && (
                <span className="tunify-queue-live">LIVE</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default TunifyWidget;