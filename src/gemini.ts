import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = 'AIzaSyBz4EjhVHMuAda1dZM-NR_hCpr6lLE4-7Y'; // IMPORTANT: Replace with your actual API key

const genAI = new GoogleGenerativeAI(API_KEY);

const model = genAI.getGenerativeModel({ model: 'gemini-pro' });

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


export async function sendMessage(message: string) {
  const result = await chat.sendMessage(message);
  const response = await result.response;
  const text = response.text();
  return text;
}
