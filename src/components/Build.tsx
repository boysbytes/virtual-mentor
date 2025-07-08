import React, { useState, useEffect } from 'react';
import { sendMessageToAI, Message } from '../lib/ai';

interface BuildProps {
  projectIdea: string;
  huddleConversation: Message[];
}

const BUILD_SYSTEM_INSTRUCTION = `You are a technical mentor. A student has defined their project idea and refined it through a conversation. Your task is to generate a clear, actionable 'First Steps' project brief based on the provided project idea and the conversation log.

The brief should include:
1.  **Project Title:** The original project idea name.
2.  **User Profile:** A brief, 1-2 sentence summary of the target user, based on the conversation.
3.  **Problem Solved:** A brief, 1-2 sentence summary of the problem this project solves for the user.
4.  **Bill of Materials:** A list of the required electronic components.
5.  **Circuit Logic:** A high-level, step-by-step overview of how the circuit should be connected.
6.  **Code Plan (Pseudo-code):** A simple pseudo-code outline for the main software logic (e.g., inside a loop function).
7.  **Next Step:** The single most important first action the student should take to start building and testing.

Format the output clearly with markdown-style headings (e.g., "### Bill of Materials").`;

const Build: React.FC<BuildProps> = ({ projectIdea, huddleConversation }) => {
  const [brief, setBrief] = useState<string>('Generating project brief...');

  useEffect(() => {
    const generateBrief = async () => {
      const systemInstruction = BUILD_SYSTEM_INSTRUCTION;
      const fullConversation: Message[] = [
        ...huddleConversation,
        {
          role: 'user',
          parts: [{ text: `Based on our conversation, please generate the final project brief for "${projectIdea}".` }]
        }
      ];
      
      const generatedBrief = await sendMessageToAI(systemInstruction, fullConversation);
      setBrief(generatedBrief);
    };

    generateBrief();
  }, [projectIdea, huddleConversation]);

  return (
    <div className="terminal-border" style={{ height: '32rem', overflowY: 'auto', padding: '1rem' }}>
      <pre style={{ whiteSpace: 'pre-wrap', fontFamily: 'inherit', fontSize: '0.875rem' }}>
        {brief}
      </pre>
    </div>
  );
};

export default Build;
