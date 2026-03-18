import { useState } from 'react';
import BootScreen from './components/BootScreen/BootScreen';
import Desktop from './components/Desktop/Desktop';
import './index.css';

function App() {
  const [booted, setBooted] = useState(false);
  const [visible, setVisible] = useState(true);

  const handleBoot = () => {
    setVisible(false);
    setTimeout(() => {
      setBooted(true);
      setTimeout(() => setVisible(true), 100);
    }, 200);
  };

  return (
      <div style={{
        width: '100vw',
        height: '100vh',
        backgroundColor: '#000',
      opacity: visible ? 1 : 0,
      transition: visible ? 'opacity 0.90s ease' : 'opacity 0.50s ease',
    }}>
      {booted ? <Desktop /> : <BootScreen onBoot={handleBoot} />}
    </div>
  );
}

export default App;