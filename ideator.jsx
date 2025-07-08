import React, { useState, useEffect } from 'react';
import { Terminal, Zap, Brain, Volume2 } from 'lucide-react';

const HeartbeatIdeationTerminal = () => {
  const [components, setComponents] = useState([]);
  const [idea, setIdea] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [terminalLines, setTerminalLines] = useState([
    'HEARTBEAT CIRCUIT IDEATION TERMINAL v2.1',
    'Copyright (c) 1985 BioTech Systems Inc.',
    '',
    'Ready to generate component combinations...',
    'Press GENERATE COMPONENTS to begin',
    ''
  ]);
  const [currentTime, setCurrentTime] = useState(new Date());

  const availableComponents = [
    { name: 'LED', description: 'Light Emitting Diode', icon: '💡' },
    { name: 'Speaker', description: 'Audio Output Device', icon: '🔊' },
    { name: 'LDR', description: 'Light Dependent Resistor', icon: '👁️' },
    { name: 'LCD', description: 'Liquid Crystal Display', icon: '📺' },
    { name: 'Piezo Buzzer', description: 'Piezoelectric Sound Generator', icon: '🔔' },
    { name: 'LM35', description: 'Temperature Sensor', icon: '🌡️' },
    { name: '555 Timer', description: 'Precision Timer IC', icon: '⏰' },
    { name: 'Servo Motor', description: 'Precise Position Control', icon: '🎯' },
    { name: 'DC Motor', description: 'Direct Current Motor', icon: '⚙️' }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const playModemSound = () => {
    const audioContext = new (window.AudioContext || window.webkitAudioContext)();
    const duration = 2000; // 2 seconds
    const sampleRate = audioContext.sampleRate;
    const buffer = audioContext.createBuffer(1, duration * sampleRate / 1000, sampleRate);
    const data = buffer.getChannelData(0);

    // Create 56k modem-like sound
    for (let i = 0; i < data.length; i++) {
      const t = i / sampleRate;
      const freq1 = 1200 + Math.sin(t * 10) * 200;
      const freq2 = 2400 + Math.sin(t * 15) * 300;
      const noise = (Math.random() - 0.5) * 0.1;
      data[i] = (Math.sin(t * freq1 * 2 * Math.PI) * 0.3 + 
                 Math.sin(t * freq2 * 2 * Math.PI) * 0.2 + noise) * 
                Math.exp(-t * 2); // Fade out
    }

    const source = audioContext.createBufferSource();
    source.buffer = buffer;
    source.connect(audioContext.destination);
    source.start();
  };

  const generateComponents = () => {
    const shuffled = [...availableComponents].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    setComponents(selected);
    setIdea('');
    
    const newLines = [
      ...terminalLines,
      '> GENERATE_COMPONENTS',
      'Scanning component database...',
      'Random selection algorithm initiated...',
      '',
      'SELECTED COMPONENTS:',
      ...selected.map(comp => `  ${comp.icon} ${comp.name} - ${comp.description}`),
      '',
      'Components ready for ideation process.',
      'Press GENERATE IDEA for AI suggestion.',
      ''
    ];
    setTerminalLines(newLines);
  };

  const generateIdea = async () => {
    if (components.length === 0) return;
    
    setIsGenerating(true);
    playModemSound();
    
    const newLines = [
      ...terminalLines,
      '> GENERATE_IDEA',
      'Connecting to AI ideation network...',
      'Analyzing heartbeat detection integration...',
      'Processing component synergies...',
      ''
    ];
    setTerminalLines(newLines);

    try {
      const componentNames = components.map(c => c.name).join(', ');
      const prompt = `You are an electronics project mentor helping secondary and university students. They have a heartbeat detection circuit and these three components: ${componentNames}. 

Suggest ONE creative, practical project idea that:
1. Uses their heartbeat detection circuit as the main sensor
2. Incorporates all three components meaningfully
3. Solves a real problem for students (health, study habits, social connection, etc.)
4. Is achievable with basic electronics knowledge
5. Has clear educational value

Format your response as a brief, enthusiastic project description (2-3 sentences max) that starts with a catchy project name in quotes. Make it inspiring and practical.`;

      console.log("Sending prompt to Claude...");
      const response = await window.claude.complete(prompt);
      console.log("Received response:", response);
      
      setTimeout(() => {
        setIdea(response);
        const finalLines = [
          ...newLines,
          'AI IDEATION COMPLETE',
          '================================',
          response,
          '================================',
          '',
          'Generate new components for more ideas!',
          ''
        ];
        setTerminalLines(finalLines);
        setIsGenerating(false);
      }, 2000);
      
    } catch (error) {
      console.error("Error generating idea:", error);
      setTimeout(() => {
        const errorLines = [
          ...newLines,
          'ERROR: AI ideation network unavailable.',
          'Please try again.',
          ''
        ];
        setTerminalLines(errorLines);
        setIsGenerating(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen bg-black text-green-400 font-mono p-4 relative overflow-hidden">
      {/* CRT Effect Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Horizontal scanlines */}
        <div className="absolute inset-0" style={{
          backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,255,0,0.08) 2px, rgba(0,255,0,0.08) 4px)',
          animation: 'scanlines 0.1s linear infinite'
        }}></div>
        
        {/* Moving scanline */}
        <div className="absolute inset-0 opacity-20" style={{
          background: 'linear-gradient(to bottom, transparent 0%, rgba(0,255,0,0.3) 50%, transparent 100%)',
          height: '3px',
          animation: 'movingScanline 2s linear infinite'
        }}></div>
        
        {/* Flicker effect */}
        <div className="absolute inset-0 bg-green-400 opacity-5 animate-pulse"></div>
        
        {/* Vignette effect */}
        <div className="absolute inset-0" style={{
          background: 'radial-gradient(ellipse at center, transparent 0%, transparent 70%, rgba(0,0,0,0.3) 100%)'
        }}></div>
        
        {/* Subtle noise */}
        <div className="absolute inset-0 opacity-10" style={{
          background: `url("data:image/svg+xml,%3Csvg width='100' height='100' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)' opacity='0.3'/%3E%3C/svg%3E")`,
          animation: 'noise 0.2s steps(8) infinite'
        }}></div>
      </div>

      {/* Terminal Header */}
      <div className="border-2 border-green-400 p-4 mb-4 bg-black bg-opacity-90 relative">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <Terminal className="w-6 h-6" />
            <span className="text-xl font-bold">BIOTECH IDEATION TERMINAL</span>
          </div>
          <div className="text-sm">
            {currentTime.toLocaleTimeString()}
          </div>
        </div>
        <div className="text-sm opacity-75">
          System: Online | Status: Ready | Memory: 64KB
        </div>
      </div>

      {/* Terminal Window */}
      <div className="border-2 border-green-400 bg-black bg-opacity-90 p-4 h-96 overflow-y-auto relative">
        <div className="space-y-1">
          {terminalLines.map((line, index) => (
            <div key={index} className="text-sm">
              {line}
            </div>
          ))}
          {isGenerating && (
            <div className="flex items-center gap-2 animate-pulse">
              <span>Processing</span>
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce"></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
                <div className="w-2 h-2 bg-green-400 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
              </div>
            </div>
          )}
        </div>
        
        {/* Cursor */}
        <div className="inline-block w-2 h-4 bg-green-400 animate-pulse mt-2"></div>
      </div>

      {/* Control Panel */}
      <div className="mt-4 flex gap-4 justify-center">
        <button
          onClick={generateComponents}
          disabled={isGenerating}
          className="flex items-center gap-2 px-6 py-3 border-2 border-green-400 bg-black text-green-400 hover:bg-green-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
        >
          <Zap className="w-5 h-5" />
          GENERATE COMPONENTS
        </button>
        
        <button
          onClick={generateIdea}
          disabled={isGenerating || components.length === 0}
          className="flex items-center gap-2 px-6 py-3 border-2 border-green-400 bg-black text-green-400 hover:bg-green-400 hover:text-black transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold"
        >
          <Brain className="w-5 h-5" />
          GENERATE IDEA
        </button>
      </div>

      {/* Component Display */}
      {components.length > 0 && (
        <div className="mt-4 border-2 border-green-400 bg-black bg-opacity-90 p-4 relative">
          <div className="text-center mb-3">
            <h3 className="text-lg font-bold">SELECTED COMPONENTS</h3>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {components.map((comp, index) => (
              <div key={index} className="text-center border border-green-400 p-3 bg-black bg-opacity-50">
                <div className="text-2xl mb-2">{comp.icon}</div>
                <div className="font-bold text-sm">{comp.name}</div>
                <div className="text-xs opacity-75">{comp.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="mt-4 text-center text-xs opacity-50">
        <p>Press F1 for help | ESC to exit | © 1985 BioTech Systems</p>
      </div>

      <style jsx>{`
        @keyframes scanlines {
          0% { transform: translateY(0); }
          100% { transform: translateY(4px); }
        }
        
        @keyframes movingScanline {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
        
        @keyframes noise {
          0% { transform: translateX(0) translateY(0); }
          10% { transform: translateX(-1px) translateY(1px); }
          20% { transform: translateX(1px) translateY(-1px); }
          30% { transform: translateX(-1px) translateY(-1px); }
          40% { transform: translateX(1px) translateY(1px); }
          50% { transform: translateX(-1px) translateY(0); }
          60% { transform: translateX(1px) translateY(-1px); }
          70% { transform: translateX(-1px) translateY(1px); }
          80% { transform: translateX(1px) translateY(0); }
          90% { transform: translateX(-1px) translateY(-1px); }
          100% { transform: translateX(0) translateY(0); }
        }
        
        /* Additional glow effect for text */
        .text-green-400 {
          text-shadow: 0 0 5px rgba(0, 255, 0, 0.8);
        }
        
        /* Enhanced border glow */
        .border-green-400 {
          box-shadow: 0 0 10px rgba(0, 255, 0, 0.5), inset 0 0 10px rgba(0, 255, 0, 0.1);
        }
      `}</style>
    </div>
  );
};

export default HeartbeatIdeationTerminal;