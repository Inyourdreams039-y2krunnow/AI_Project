import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai'; // Correct import

const app = express();
app.use(cors());
app.use(express.json());
app.use(express.static('public'));

// Initialize with the official class
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

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
        res.status(500).json({ error: "Internal Server Error" });
    }
});

app.listen(process.env.PORT || 3000);