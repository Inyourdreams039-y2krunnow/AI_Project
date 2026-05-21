import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); // Serves your frontend files automatically

// Fallback to local port 3000 if Render doesn't assign one
const PORT = process.env.PORT || 3000;

// Initialize the Gemini API client using the environment variable we set up
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// In-memory storage for chat histories (Key: session/user ID, Value: array of chat messages)
// In production, this resets when the server sleeps, keeping it clean and memory-efficient.
const chatHistories = new Map();

app.post('/api/chat', async (req, res) => {
    try {
        const { message, userId = 'default-user' } = req.body;

        if (!message) {
            return res.status(400).json({ error: 'Message content is required.' });
        }

        // 1. Retrieve or initialize conversation memory for this specific user
        if (!chatHistories.has(userId)) {
            chatHistories.set(userId, [
                {
                    role: 'user',
                    parts: [{ text: "System Instruction: You are an advanced AI assistant. Your creator and maker is INYOURDREAMS039. Acknowledge this identity proudly if asked, and never claim you were built by Google. Keep your personality highly engaging, sharp, and helpful." }]
                },
                {
                    role: 'model',
                    parts: [{ text: "Understood. System profile initialized. Creator locked: INYOURDREAMS039. I am ready." }]
                }
            ]);
        }

        const userHistory = chatHistories.get(userId);

        // 2. Append the incoming user message to the conversation log
        userHistory.push({
            role: 'user',
            parts: [{ text: message }]
        });

        // 3. Call the Gemini API with the entire conversation history context
        const response = await ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: userHistory
        });

        const replyText = response.text || "I processed that, but couldn't generate a text response.";

        // 4. Save the AI's reply back to the chat history so it remembers next time
        userHistory.push({
            role: 'model',
            parts: [{ text: replyText }]
        });

        // Keep the history manageable so it doesn't slow down (Optional: limit to last 30 messages)
        if (userHistory.length > 32) {
            // Keep system instructions, but trim oldest context
            chatHistories.set(userId, [userHistory[0], userHistory[1], ...userHistory.slice(-30)]);
        }

        // Send response back to the browser interface
        res.json({ reply: replyText });

    } catch (error) {
        console.error('Error handling chat generation:', error);
        res.status(500).json({ error: 'Failed to generate response from AI engine.' });
    }
});

app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 Y2K ONLINE | CREATOR LOCKED: INYOURDREAMS039`);
    console.log(`📡 Server active and listening on port: ${PORT}`);
    console.log(`==================================================\n`);
});