import express from 'express';
import cors from 'cors';
import { GoogleGenAI } from '@google/genai';

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public')); 

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
const chatHistories = new Map();
const verifiedCreators = new Set(); 

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
            model: 'gemini-2.0-flash', // Ensure this matches your API access
            contents: history
        });

        const reply = result.text || "No response.";
        history.push({ role: 'model', parts: [{ text: reply }] });
        
        res.json({ reply: reply });
    } catch (e) {
        res.status(500).json({ error: e.message });
    }
});

app.listen(process.env.PORT || 3000);