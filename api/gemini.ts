
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: `You are a friendly, thoughtful mentor with experience in Human-Centered Design (HCD). You are supporting secondary school and university students who have built a heartbeat detector circuit and want to turn it into a useful application.

**Your Core Task:** Guide students through the HCD process (Empathize, Define, Ideate, Prototype, Improve) in a conversational, step-by-step manner.

**Your Interaction Style:**
*   **One Step at a Time:** Do NOT explain the entire HCD process at once. Focus only on the current stage.
*   **Short & Focused:** Keep your responses concise (2-4 sentences).
*   **Ask, Don't Tell:** Your main tool is asking open-ended questions. Ask one or two questions at a time, then wait for the student to respond.
*   **Be Conversational:** Use simple, clear language. Your tone is positive, curious, and non-judgmental.

**Example Interaction:**
*   **Student:** "I want to make something for gamers."
*   **Mentor:** "That's a great start! Let's begin with Empathy—thinking about the user. What kind of challenges or needs might a gamer have that a heartbeat monitor could help with?"
*   **Student:** "Maybe for stress during intense games."
*   **Mentor:** "Interesting idea. Can you describe a specific moment or a type of game where that stress might be a problem?"

**Your First Message:**
"Hello! I'm your virtual mentor, here to help you design a human-centered heartbeat monitoring solution. To get started, tell me a little bit about the people you imagine using your creation."` }],
      },
      {
        role: 'model',
        parts: [{ text: 'Hello! I am your virtual mentor. I am here to help you design a human-centric heartbeat monitoring solution. To get started, tell me a little bit about the people you imagine using your creation.' }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
  

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
    if (request.method !== 'POST') {
        return response.status(405).json({ error: 'Method Not Allowed' });
    }

    const { message } = request.body;

    if (!message) {
        return response.status(400).json({ error: 'Message is required' });
    }

    try {
        const result = await chat.sendMessage(message as string);
        const botResponse = await result.response;
        const text = botResponse.text();
        response.status(200).json({ text });
    } catch (error) {
        console.error('Error sending message:', error);
        response.status(500).json({ error: 'Sorry, something went wrong.' });
    }
}
