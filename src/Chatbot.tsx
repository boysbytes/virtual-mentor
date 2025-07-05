import React, { useState, useEffect, useRef } from 'react';

type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  useEffect(() => {
    scrollToBottom();
    if (!thinking) {
      focusInput();
    }
  }, [messages, thinking]);

  useEffect(() => {
    // Add the initial bot message when the component mounts
    setMessages([
      { text: 'Hello! I\'m your virtual mentor, here to help you design a human-centered heartbeat monitoring solution. To get started, tell me a little bit about the people you imagine using your creation.', sender: 'bot' }
    ]);
    focusInput();
  }, []);

  const handleSend = async () => {
    if (input.trim()) {
      const userMessage: Message = { text: input, sender: 'user' };
      const newMessages = [...messages, userMessage];
      setMessages(newMessages);
      setInput('');
      setThinking(true);
      try {
        const response = await fetch('/api/gemini', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message: input }),
        });

        if (!response.ok) {
          throw new Error('Network response was not ok');
        }

        const data = await response.json();
        setMessages([...newMessages, { text: data.text, sender: 'bot' }]);
      } catch (error) {
        console.error('Error sending message:', error);
        setMessages([...newMessages, { text: 'Sorry, something went wrong.', sender: 'bot' }]);
      } finally {
        setThinking(false);
      }
    }
  };

  return (
    <div className="chatbot-container">
      <div className="chatbot-header">
        <h2>Virtual Mentor</h2>
      </div>
      <div className="chatbot-messages">
        {messages.map((msg, index) => (
          <div key={index} className={`message ${msg.sender}`}>
            <div className="message-bubble">{msg.text}</div>
          </div>
        ))}
        {thinking && (
          <div className="message bot">
            <div className="message-bubble">
              <div className="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      <div className="chatbot-input">
        <input
          ref={inputRef}
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSend()}
          disabled={thinking}
        />
        <button onClick={handleSend} disabled={thinking}>Send</button>
      </div>
    </div>
  );
};

export default Chatbot;

