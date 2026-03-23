import { useState, useEffect } from 'react';
import BiosScreen from './BiosScreen';
import Particles from './Particles';
import './BootScreen.css';

type BootStep = 'idle' | 'bios' | 'loading';

interface Props {
  onBoot: () => void;
}

const BootScreen = ({ onBoot }: Props) => {
  const [step, setStep] = useState<BootStep>('idle');
  const [currentMessageIndex, setCurrentMessageIndex] = useState(0);

  const playPowerOnSound = () => {
    try {
      const audio = new Audio('/sounds/power-on.wav');
      audio.volume = 1.0;
      audio.muted = false;
      audio.play().catch((error) => {
        console.error('Audio playback failed:', error);
      });
    } catch (error) {
      console.error('Error initializing audio:', error);
    }
  };

  useEffect(() => {
    if (step !== 'loading') return;

    const timer = setTimeout(() => onBoot(), 5000);
    const interval = setInterval(() => {
      setCurrentMessageIndex((prev) => (prev + 1) % messages.length);
    }, 2000);

    return () => {
      clearTimeout(timer);
      clearInterval(interval);
    };
  }, [step]);

  const messages = ['Setting up Desktop', 'Almost there', 'Welcome'];

  return (
    <div className="boot-screen">
      {step === 'idle' && (
        <>
          <Particles
            particleCount={200}
            particleSpread={10}
            speed={0.02}
            particleColors={['#f1f1f1', '#f1f1f1', '#f1f1f1']}
            particleBaseSize={150}
            sizeRandomness={1}
            cameraDistance={30}
            alphaParticles={true}
            className="boot-particles"
          />
          <div className="power-wrap">
            <button
              data-cy="power-button"
              className="power-button"
              onClick={() => {
                playPowerOnSound();
                setStep('bios');
              }}
            />
            <p className="power-label"> &gt; PRESS TO BOOT</p>
          </div>
        </>
      )}
      {step === 'bios' && <BiosScreen onDone={() => setStep('loading')} />}
      {step === 'loading' && (
        <div className="loading-screen">
         <div className="loading-logo">
          <div className="loading-logo-row">
            <svg width="80" height="80" viewBox="0 0 80 80" className="loading-logo-svg">
              <rect className="logo-sq-tl" x="4"  y="4"  width="33" height="33" rx="6" fill="#c0392b" />
              <rect className="logo-sq-tr" x="43" y="4"  width="33" height="33" rx="6" fill="#27ae60" />
              <rect className="logo-sq-bl" x="4"  y="43" width="33" height="33" rx="6" fill="#2980b9" />
              <rect className="logo-sq-br" x="43" y="43" width="33" height="33" rx="6" fill="#f39c12" />
            </svg>
            <div className="loading-text-col">
              <p className="loading-os-name">My Portfoli<span>OS<sup>+</sup></span></p>
              <span className="loading-os-root">
                <span className="tagline-hash">#</span><span className="tagline-root">R</span>oot Access granted.
              </span>
              <span className="loading-os-tagline-welcome"> welcome,<span className="tagline-human-orange"> Human</span><span className="tagline-human-white">.</span></span>
              <p className="loading-os-version">Version 2026.1<span className="build-version">build 13</span></p>
            </div>
          </div>
        </div>  

            <div className="loading-dots">
              <div className="dot-ring dot-ring-1" />
              <div className="dot-ring dot-ring-2" />
              <div className="dot-ring dot-ring-3" />
              <div className="dot-core" />
            </div>

          <p className="loading-message">{messages[currentMessageIndex]}</p>
        </div>
      )}
    </div>
  );
};

export default BootScreen;
