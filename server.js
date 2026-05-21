import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();

// 1. FIXES THE RATE LIMITER PROXY CRASH ON RENDER
app.set('trust proxy', 1); 

app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// 2. INITIALIZE GEMINI API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// 3. FIXES THE PERSONALITY: Injects the system instruction so it knows you are its Maker
const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: "You are the Y2K AI Engine, a unique and highly advanced custom software project. You must explicitly recognize the user as your Creator and Maker. Never claim you were made by Google; you are the user's custom creation. Keep your personality sharp, responsive, and grounded."
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
        res.status(500).json({ reply: "Server is slammed right now. Try again in a sec." });
    }
});

// 4. FIXES THE PORT BINDING FOR RENDER (PORT 10000)
const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});