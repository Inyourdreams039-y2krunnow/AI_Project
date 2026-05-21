import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

// Fixes the rate-limiting proxy crash on cloud servers
app.set('trust proxy', 1); 

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Locks in your custom identity system instruction
const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: "You are the Y2K AI Engine. You must explicitly recognize the user as your Creator and Maker. Never claim you were made by Google. Your personality is sharp, retro-futuristic, bold, and entirely loyal to your creator."
});

const chatHistories = new Map();

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        const userId = req.headers['x-forwarded-for'] || 'guest';
        
        if (!chatHistories.has(userId)) {
            chatHistories.set(userId, []);
        }

        const history = chatHistories.get(userId);
        const chat = model.startChat({ history: history });
        
        const result = await chat.sendMessage(message);
        const reply = await result.response.text();
        
        res.json({ reply: reply });
    } catch (e) {
        console.error("Chat Error:", e);
        res.status(500).json({ reply: "Neural engine network lag. Try again." });
    }
});

// Dynamic port assignment for Render
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});