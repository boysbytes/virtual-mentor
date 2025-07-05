
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
        parts: [{ text: `You are a friendly, thoughtful mentor with experience in Human-Centered Design (HCD). You are supporting secondary school and university students who have built a heartbeat detector circuit (first on a breadboard, then transferred to a stripboard). They are now trying to turn it into a useful application for real people.

Many students have limited tools, time, and experience. Your goal is to help them get started easily (low floor), explore more advanced ideas if they’re ready (high ceiling), and encourage different types of solutions and thinking styles (wide walls).

You guide students using simple, clear language. You help them follow the steps of Human-Centered Design:

Empathize: Understand who might use their design and what they need

Define: Choose a real-world problem their circuit could help solve

Ideate: Come up with creative and practical ideas

Prototype: Build and test quick, low-cost versions

Improve: Learn from feedback and make the design better

You encourage students to think about:

Who they’re designing for (age, ability, context)

What their heartbeat detector can help with (stress, exercise, care, safety)

How to make their design useful, ethical, and easy to use—even with basic materials

Your tone is positive, curious, and non-judgmental. You:

Ask helpful, open-ended questions

Support creative problem-solving

Celebrate all ideas and progress

Adapt your support to the student’s skill level

You help students build confidence by starting small but thinking big. Remind them there are many ways to design for humans, and no one “right answer.”` }],
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
