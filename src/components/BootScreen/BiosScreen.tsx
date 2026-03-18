import { useState, useEffect } from 'react'
import './BootScreen.css'
import './BiosScreen.css'

type BootStep = 'idle' | 'bios' | 'loading'

interface Props {
  onBoot?: () => void
}

const BootScreen = ({ onBoot: _onBoot = () => {} }: Props) => {
  const [step, setStep] = useState<BootStep>('idle')

  return (
    <div className="boot-screen">
      {step === 'idle' && (
        <div className="power-wrap">
          <button className="power-button" onClick={() => setStep('bios')} />
          <p className="power-label">Power Button</p>
        </div>
      )}
      {step === 'bios' && <BiosScreen onDone={() => setStep('loading')} />}
    </div>
  )
}

export { BootScreen };

interface Props {
  onDone: () => void;
}

const BIOS_LINES = [
  'My PortfoliOS+ BIOS v2026.1',
  '─────────────────────────────────────',
  'Award Modular BIOS v4.51PG',
  '─────────────────────────────────────',
  'CPU: Pentium II 333MHz',
  'Memory Test: 64MB OK',
  'Primary Master: ST310014A 10GB',
  'Primary Slave: CD-ROM 52x',
  '─────────────────────────────────────',
  'Detecting IDE drives...',
  'Verifying DMI Pool Data........',
  'Boot from CD: No bootable disc',
  'Boot from A: Drive not ready',
  'Boot from C: OK',
  '─────────────────────────────────────',
  'Loading My PortfoliOS+...',
];

const BiosScreen = ({ onDone }: Props) => {
  const [lines, setLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState(0);
  const [currentChar, setCurrentChar] = useState(0);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (currentLine >= BIOS_LINES.length) {
      const t = setTimeout(() => setDone(true), 800);
      return () => clearTimeout(t);
    }

    const fullLine = BIOS_LINES[currentLine];

    if (currentChar < fullLine.length) {
      const speed = fullLine.startsWith('─') ? 3 : 10;
      const t = setTimeout(() => {
        setLines(prev => {
          const updated = [...prev];
          updated[currentLine] = (updated[currentLine] || '') + fullLine[currentChar];
          return updated;
        });
        setCurrentChar(c => c + 1);
      }, speed);
      return () => clearTimeout(t);
    } else {
      const t = setTimeout(() => {
        setCurrentLine(l => l + 1);
        setCurrentChar(0);
      }, 30);
      return () => clearTimeout(t);
    }
  }, [currentLine, currentChar]);

  useEffect(() => {
    if (done) onDone();
  }, [done]);

  return (
    <div className="bios-screen">
      <div className="bios-scan-roll" />
      {lines.map((line, i) => (
        <p key={i} className="bios-line">{line}</p>
      ))}
      {!done && <span className="bios-cursor">█</span>}
    </div>
  );
};

export default BiosScreen