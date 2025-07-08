export interface Message {
  role: 'user' | 'model';
  parts: { text: string }[];
}

/**
 * Sends a conversation history and a system instruction to the AI backend.
 * @param systemInstruction The prompt that defines the AI's persona and task.
 * @param conversationHistory The history of the conversation so far.
 * @returns The AI's response text.
 */
export async function sendMessageToAI(
  systemInstruction: string,
  conversationHistory: Message[]
): Promise<string> {
  try {
    const response = await fetch('/api/gemini', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        systemInstruction,
        conversationHistory,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.json();
      throw new Error(errorBody.error || 'The AI service failed to respond.');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error('Error communicating with AI:', error);
    return 'Error: Could not get a response from the mentor. Please check the console for details.';
  }
}
