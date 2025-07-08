import React, { useState } from 'react';
import TerminalLayout from './components/TerminalLayout';
import Ignite, { ElectronicComponent } from './components/Ignite';
import Huddle from './components/Huddle';
import Build from './components/Build';
import { Message } from './lib/ai';
import './styles/Terminal.css';

export type Stage = 'Ignite' | 'Huddle' | 'Build';

function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('Ignite');
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [components, setComponents] = useState<ElectronicComponent[]>([]);
  const [huddleConversation, setHuddleConversation] = useState<Message[]>([]);
  const [sessionKey, setSessionKey] = useState(0); // Key for resetting Ignite

  const restartSession = () => {
    setCurrentStage('Ignite');
    setProjectIdea('');
    setComponents([]);
    setHuddleConversation([]);
    setSessionKey(prevKey => prevKey + 1); // Increment key to force re-mount
  };

  const goToHuddle = (idea: string, generatedComponents: ElectronicComponent[]) => {
    setProjectIdea(idea);
    setComponents(generatedComponents);
    setCurrentStage('Huddle');
  };

  const goToBuild = (conversation: Message[]) => {
    setHuddleConversation(conversation);
    setCurrentStage('Build');
  };

  const renderStage = () => {
    switch (currentStage) {
      case 'Ignite':
        return <Ignite key={sessionKey} onIdeaGenerated={goToHuddle} />;
      case 'Huddle':
        return <Huddle projectIdea={projectIdea} components={components} onProceedToBuild={goToBuild} />;
      case 'Build':
        return <Build projectIdea={projectIdea} huddleConversation={huddleConversation} />;
      default:
        return <Ignite key={sessionKey} onIdeaGenerated={goToHuddle} />;
    }
  };

  return (
    <TerminalLayout currentStage={currentStage} onRestart={restartSession}>
      {renderStage()}
    </TerminalLayout>
  );
}

export default App;
