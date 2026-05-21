import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Note: I have removed express-rate-limit to stop the 500 error crashes.
const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const chatHistories = new Map();

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.headers['x-forwarded-for'] || 'guest';
        
        if (!chatHistories.has(userId)) {
            chatHistories.set(userId, [{ role: 'user', parts: [{ text: "System: You are an assistant." }] }]);
        }

        const history = chatHistories.get(userId);
        history.push({ role: 'user', parts: [{ text: message }] });

        const result = await ai.models.generateContent({
            model: 'gemini-2.0-flash',
            contents: history
        });

        const reply = result.text || "No response.";
        history.push({ role: 'model', parts: [{ text: reply }] });
        
        res.json({ reply: reply });
    } catch (e) {
        console.error("Chat Error:", e); // This will log the real error in Render
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(process.env.PORT || 3000, () => {
    console.log("Server running on port " + (process.env.PORT || 3000));
});