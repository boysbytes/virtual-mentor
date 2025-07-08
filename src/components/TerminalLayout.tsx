import React from 'react';

type Stage = 'Ignite' | 'Huddle' | 'Build';

interface TerminalLayoutProps {
  children: React.ReactNode;
  currentStage: Stage;
}

const TerminalLayout: React.FC<TerminalLayoutProps> = ({ children, currentStage }) => {
  const [currentTime, setCurrentTime] = React.useState(new Date());

  React.useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const stages: Stage[] = ['Ignite', 'Huddle', 'Build'];

  return (
    <div className="terminal-app">
      {/* CRT Effect Overlay */}
      <div className="crt-overlay">
        <div className="vignette-effect"></div>
      </div>

      <div style={{ position: 'relative', zIndex: 1 }}>
        {/* Terminal Header */}
        <div className="terminal-border mb-4">
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 'bold' }}>VIRTUAL MENTOR OS</span>
            </div>
            <div style={{ fontSize: '0.875rem' }}>
              {currentTime.toLocaleTimeString()}
            </div>
          </div>
          <div style={{ fontSize: '0.875rem', opacity: 0.75 }}>
            System: Online | Status: Ready
          </div>
        </div>

        {/* System Navigator */}
        <div className="terminal-border mb-4" style={{ textAlign: 'center', padding: '0.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            {stages.map((stage, index) => (
              <span key={stage} style={{
                fontWeight: currentStage === stage ? 'bold' : 'normal',
                color: currentStage === stage ? '#39FF14' : 'inherit', // Brighter green for active
                textShadow: currentStage === stage ? '0 0 8px #39FF14' : 'none'
              }}>
                {currentStage === stage ? `> STAGE ${index + 1}: ${stage.toUpperCase()} <` : `[ STAGE ${index + 1}: ${stage.toUpperCase()} ]`}
              </span>
            ))}
          </div>
        </div>

        {/* Main Content Window */}
        <main>
          {children}
        </main>
      </div>
    </div>
  );
};

export default TerminalLayout;
