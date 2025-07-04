import React, { useState, useEffect } from 'react';


type Message = {
  text: string;
  sender: 'user' | 'bot';
};

const Chatbot: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [thinking, setThinking] = useState(false);

  useEffect(() => {
    // Add the initial bot message when the component mounts
    setMessages([
      { text: 'Hello! I am your virtual mentor. I am here to help you design a human-centric heartbeat monitoring solution. To get started, tell me a little bit about your project and what you hope to achieve.', sender: 'bot' }
    ]);
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
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">Virtual Mentor</div>
        <div className="card-body" style={{ height: '400px', overflowY: 'auto' }}>
          {messages.map((msg, index) => (
            <div key={index} className={`d-flex justify-content-${msg.sender === 'user' ? 'end' : 'start'}`}>
              <div className={`alert ${msg.sender === 'user' ? 'alert-primary' : 'alert-secondary'}`}>
                {msg.text}
              </div>
            </div>
          ))}
          {thinking && (
            <div className="d-flex justify-content-start">
              <div className="alert alert-secondary">Thinking...</div>
            </div>
          )}
        </div>
        <div className="card-footer">
          <div className="input-group">
            <input
              type="text"
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSend()}
              disabled={thinking}
            />
            <button className="btn btn-primary" onClick={handleSend} disabled={thinking}>Send</button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
