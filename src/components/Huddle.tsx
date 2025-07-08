import React, { useState, useEffect, useRef } from 'react';
import { sendMessageToAI, Message } from '../lib/ai';
import { ArrowRight } from 'lucide-react';
import { ElectronicComponent } from './Ignite'; // Import type from Ignite

interface HuddleProps {
  projectIdea: string;
  components: ElectronicComponent[];
  onProceedToBuild: (conversation: Message[]) => void;
}

const HUDDLE_SYSTEM_INSTRUCTION = `You are a design thinking coach. A student has a project idea: "[projectIdea]". Your goal is to guide them to think deeply about their user by asking ONE insightful question at a time. Help them define who the user is, what their needs are, and in what context they would use this device. Keep your responses concise (2-3 sentences). Ask open-ended questions and wait for the student to respond. Never suggest moving to the next stage yourself.`;

const Huddle: React.FC<HuddleProps> = ({ projectIdea, components, onProceedToBuild }) => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [userInput, setUserInput] = useState('');
  const [isAiTyping, setIsAiTyping] = useState(false);
  const terminalEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null); // Ref for the input element

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

  // Effect to focus the input when the AI is done typing
  useEffect(() => {
    if (!isAiTyping) {
      inputRef.current?.focus();
    }
  }, [isAiTyping]);

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
      {/* Project Brief Panel */}
      <div className="terminal-border" style={{ marginBottom: '1rem', padding: '0.5rem 1rem' }}>
        <div style={{ borderBottom: '2px solid #00ff41', paddingBottom: '0.5rem', marginBottom: '0.5rem', fontWeight: 'bold' }}>
          PROJECT BRIEF
        </div>
        <p style={{ margin: 0, paddingBottom: '0.25rem' }}><strong>IDEA:</strong> {projectIdea}</p>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <strong>COMPONENTS:</strong>
          {components.map(c => <span key={c.name}>{c.icon} {c.name}</span>)}
        </div>
      </div>

      {/* Conversation Panel */}
      <div className="terminal-border" style={{ height: '28rem', display: 'flex', flexDirection: 'column' }}>
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
        <form onSubmit={handleUserSubmit} style={{ display: 'flex', padding: '1rem', borderTop: '2px solid #00ff41', alignItems: 'center' }}>
          <span style={{ marginRight: '0.5rem' }}>&gt;</span>
          <div style={{ position: 'relative', flexGrow: 1 }}>
            {/* This is the visible text and cursor */}
            <div style={{ position: 'absolute', display: 'flex', alignItems: 'center', pointerEvents: 'none' }}>
              <span>{userInput}</span>
              {!isAiTyping && <div className="cursor"></div>}
            </div>
            {/* This is the actual, invisible input field that captures typing */}
            <input
              ref={inputRef} // Attach the ref here
              type="text"
              value={userInput}
              onChange={handleUserInput}
              disabled={isAiTyping}
              style={{
                width: '100%',
                background: 'transparent',
                border: 'none',
                color: 'transparent', // Hide the actual text
                caretColor: 'transparent', // Hide the native cursor
                outline: 'none',
                fontFamily: 'inherit',
                fontSize: 'inherit'
              }}
              autoFocus
            />
          </div>
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
