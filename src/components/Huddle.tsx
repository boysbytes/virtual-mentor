import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI, Message } from '../lib/ai';
import { ArrowRight } from 'lucide-react';

interface HuddleProps {
  projectIdea: string;
  onProceedToBuild: (conversation: Message[]) => void;
}

const HUDDLE_SYSTEM_INSTRUCTION = `You are a design thinking coach. A student has a project idea: "[projectIdea]". Your goal is to guide them to think deeply about their user by asking ONE insightful question at a time. Help them define who the user is, what their needs are, and in what context they would use this device. Keep your responses concise (2-3 sentences). Ask open-ended questions and wait for the student to respond. Never suggest moving to the next stage yourself.`;

const Huddle: React.FC<HuddleProps> = ({ projectIdea, onProceedToBuild }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchInitialMessage = async () => {
      setIsAiTyping(true);
      const systemInstruction = HUDDLE_SYSTEM_INSTRUCTION.replace('[projectIdea]', projectIdea);
      const initialUserMessage: Message = {
        role: 'user',
        parts: [{ text: `Let's start the huddle for my project idea: "${projectIdea}"` }],
      };
      const firstAiResponse = await sendMessageToAI(systemInstruction, [initialUserMessage]);
      setConversation([{ role: 'model', parts: [{ text: firstAiResponse }] }]);
      setIsAiTyping(false);
    };
    fetchInitialMessage();
  }, [projectIdea]);

  useEffect(() => {
    terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation, isAiTyping]);

  const handleUserInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUserInput(e.target.value);
  };

  const handleUserSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isAiTyping) return;

    const userMessage: Message = { role: 'user', parts: [{ text: userInput }] };
    const newConversation = [...conversation, userMessage];
    setConversation(newConversation);
    setUserInput('');
    setIsAiTyping(true);

    const systemInstruction = HUDDLE_SYSTEM_INSTRUCTION.replace('[projectIdea]', projectIdea);
    const aiResponse = await sendMessageToAI(systemInstruction, newConversation);
    
    setConversation([...newConversation, { role: 'model', parts: [{ text: aiResponse }] }]);
    setIsAiTyping(false);
  };

  return (
    <div>
      <div className="terminal-border" style={{ height: '32rem', display: 'flex', flexDirection: 'column' }}>
        <div style={{ flexGrow: 1, overflowY: 'auto', padding: '1rem' }}>
          {conversation.map((msg, index) => (
            <div key={index} style={{ marginBottom: '1rem' }}>
              <span style={{ fontWeight: 'bold', color: msg.role === 'model' ? '#39FF14' : '#1E90FF' }}>
                {msg.role === 'model' ? 'MENTOR: ' : 'USER: '}
              </span>
              <span>{msg.parts[0].text}</span>
            </div>
          ))}
          {isAiTyping && (
            <div>
              <span style={{ fontWeight: 'bold' }}>MENTOR: </span>
              <span>Typing...</span>
            </div>
          )}
          <div ref={terminalEndRef} />
        </div>
        <form onSubmit={handleUserSubmit} style={{ display: 'flex', padding: '1rem', borderTop: '2px solid #00ff41' }}>
          <span style={{ marginRight: '0.5rem' }}>&gt;</span>
          <input
            type="text"
            value={userInput}
            onChange={handleUserInput}
            disabled={isAiTyping}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#00ff41',
              flexGrow: 1,
              outline: 'none',
              fontFamily: 'inherit',
              fontSize: 'inherit'
            }}
            autoFocus
          />
          <div className="cursor"></div>
        </form>
      </div>
      <div style={{ marginTop: '1rem', textAlign: 'center' }}>
        <button onClick={() => onProceedToBuild(conversation)} disabled={isAiTyping || conversation.length < 2} className="terminal-button">
          PROCEED TO BUILD
          <ArrowRight width={20} height={20} />
        </button>
      </div>
    </div>
  );
};

export default Huddle;
