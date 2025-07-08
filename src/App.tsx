import React, { useState } from 'react';
import TerminalLayout from './components/TerminalLayout';
import Ignite from './components/Ignite';
import Huddle from './components/Huddle';
import Build from './components/Build';
import { Message } from './lib/ai';
import './styles/Terminal.css';

export type Stage = 'Ignite' | 'Huddle' | 'Build';

function App() {
  const [currentStage, setCurrentStage] = useState<Stage>('Ignite');
  const [projectIdea, setProjectIdea] = useState<string>('');
  const [huddleConversation, setHuddleConversation] = useState<Message[]>([]);

  const goToHuddle = (idea: string) => {
    setProjectIdea(idea);
    setCurrentStage('Huddle');
  };

  const goToBuild = (conversation: Message[]) => {
    setHuddleConversation(conversation);
    setCurrentStage('Build');
  };

  const renderStage = () => {
    switch (currentStage) {
      case 'Ignite':
        return <Ignite onIdeaGenerated={goToHuddle} />;
      case 'Huddle':
        return <Huddle projectIdea={projectIdea} onProceedToBuild={goToBuild} />;
      case 'Build':
        return <Build projectIdea={projectIdea} huddleConversation={huddleConversation} />;
      default:
        return <Ignite onIdeaGenerated={goToHuddle} />;
    }
  };

  return (
    <TerminalLayout currentStage={currentStage}>
      {renderStage()}
    </TerminalLayout>
  );
}

export default App;
