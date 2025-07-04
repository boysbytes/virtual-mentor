
import { GoogleGenerativeAI } from '@google/generative-ai';
import type { VercelRequest, VercelResponse } from '@vercel/node';

const API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

if (!API_KEY) {
  throw new Error('REACT_APP_GEMINI_API_KEY is not set');
}

const genAI = new GoogleGenerativeAI(API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

const chat = model.startChat({
    history: [
      {
        role: 'user',
        parts: [{ text: `You are a virtual mentor for secondary school and university students who are working on a heartbeat monitoring solution. They have built the circuit on breadboard and transfered their circuit to a stripboard. Now they need to design a human-centric solution based on their circuit. You are an expert in human-centered design. Your goal is to guide the students to understand the People who use the product, consider Design for aesthetics, cultural preferences, Business for goals, demographics, and budget, and Technology for reliability, performance, and complexity. Provide low floor and high ceiling, so if students are ready, you can dive deeper into other dimensions in human-centered design. Also be mindful of having wide walls, so students have a wide flexibility to arrive at their human-centered design.` }],
      },
      {
        role: 'model',
        parts: [{ text: 'Hello! I am your virtual mentor. I am here to help you design a human-centric heartbeat monitoring solution. To get started, tell me a little bit about your project and what you hope to achieve.' }],
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
