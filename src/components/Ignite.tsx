import React, { useState, useEffect, useRef } from 'react';
import { Zap, Brain, ArrowRight } from 'lucide-react';
import { sendMessageToAI, Message } from '../lib/ai';

export interface ElectronicComponent {
  name: string;
  description: string;
  icon: string;
}

interface IgniteProps {
  onIdeaGenerated: (idea: string, components: ElectronicComponent[]) => void;
}

const IGNITE_SYSTEM_INSTRUCTION = `You are an electronics project mentor helping secondary and university students. They have a heartbeat detection circuit and a set of three components. 

Your task is to suggest ONE creative, practical project idea that:
1. Uses their heartbeat detection circuit as the main sensor.
2. Incorporates all three provided components meaningfully.
3. Solves a real problem for students. The themes can be diverse: focus and productivity, physical activity and health, art and music, social connection, or gaming and entertainment.
4. Is achievable with basic electronics knowledge.
5. Has clear educational value.

Format your response as a brief, enthusiastic project description (2-3 sentences max) that starts with a clear and descriptive project name in quotes. Make it inspiring and practical. **Vary the project themes.**`;

const availableComponents: ElectronicComponent[] = [
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

const Ignite: React.FC<IgniteProps> = ({ onIdeaGenerated }) => {
  const [components, setComponents] = useState<ElectronicComponent[]>([]);
  const [idea, setIdea] = useState<string>('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [terminalLines, setTerminalLines] = useState<string[]>([
    'INITIALIZING... HEARTBEAT CIRCUIT IDEATION TERMINAL v2.1',
    'Copyright (c) 1985 BioTech Systems Inc.',
    '',
    'Ready to generate component combinations...',
    'Press [GENERATE COMPONENTS] to begin.',
    ''
  ]);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  const generateComponents = () => {
    setIdea('');
    const shuffled = [...availableComponents].sort(() => Math.random() - 0.5);
    const selected = shuffled.slice(0, 3);
    setComponents(selected);
    
    const newLines = [
      ...terminalLines,
      '> GENERATE_COMPONENTS',
      'Scanning component database... Done.',
      'Random selection algorithm initiated... Done.',
      '',
      'SELECTED COMPONENTS:',
      ...selected.map(comp => `  ${comp.icon} ${comp.name} - ${comp.description}`),
      '',
      'Components ready for ideation process.',
      'Press [GENERATE IDEA] for AI suggestion.',
      ''
    ];
    setTerminalLines(newLines);
  };

  const generateIdea = async () => {
    if (components.length === 0) return;
    
    setIsGenerating(true);
    
    let newLines = [
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
      const userPrompt: Message = {
        role: 'user',
        parts: [{ text: `The components are: ${componentNames}.` }]
      };

      const generatedIdea = await sendMessageToAI(IGNITE_SYSTEM_INSTRUCTION, [userPrompt]);
      setIdea(generatedIdea);
      
      newLines = [
        ...newLines,
        'AI IDEATION COMPLETE',
        '================================',
        `"${generatedIdea}"`,
        '================================',
        '',
        'Press [PROCEED TO HUDDLE] to refine this idea.',
        ''
      ];
      setTerminalLines(newLines);
    } catch (error) {
      console.error("Error generating idea:", error);
      const errorLines = [
        ...newLines,
        'ERROR: AI ideation network unavailable.',
        'Please check the console for details or try again.',
        ''
      ];
      setTerminalLines(errorLines);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleProceed = () => {
    if (idea) {
      onIdeaGenerated(idea, components);
    }
  };

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [terminalLines, isGenerating]);

  return (
    <div>
      <div className="terminal-border" style={{ height: '24rem', overflowY: 'auto', position: 'relative' }}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', padding: '0.5rem' }}>
          {terminalLines.map((line, index) => (
            <div key={index} style={{ fontSize: '0.875rem' }}>
              {line}
            </div>
          ))}
          {isGenerating && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>Processing...</span>
            </div>
          )}
        </div>
        <div ref={terminalEndRef} />
      </div>

      <div style={{ marginTop: '1rem', display: 'flex', gap: '1rem', justifyContent: 'center' }}>
        {!idea ? (
          <>
            <button onClick={generateComponents} disabled={isGenerating} className="terminal-button">
              <Zap width={20} height={20} />
              GENERATE COMPONENTS
            </button>
            <button onClick={generateIdea} disabled={isGenerating || components.length === 0} className="terminal-button">
              <Brain width={20} height={20} />
              GENERATE IDEA
            </button>
          </>
        ) : (
          <button onClick={handleProceed} className="terminal-button">
            PROCEED TO HUDDLE
            <ArrowRight width={20} height={20} />
          </button>
        )}
      </div>

      {components.length > 0 && (
        <div className="terminal-border" style={{ marginTop: '1rem', position: 'relative' }}>
          <div style={{ textAlign: 'center', marginBottom: '0.75rem' }}>
            <h3 style={{ fontSize: '1.125rem', fontWeight: 'bold' }}>SELECTED COMPONENTS</h3>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
            {components.map((comp, index) => (
              <div key={index} className="terminal-border" style={{ textAlign: 'center', padding: '0.75rem' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{comp.icon}</div>
                <div style={{ fontWeight: 'bold', fontSize: '0.875rem' }}>{comp.name}</div>
                <div style={{ fontSize: '0.75rem', opacity: 0.75 }}>{comp.description}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Ignite;

