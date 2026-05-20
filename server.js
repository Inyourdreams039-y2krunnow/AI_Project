import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs';
import rateLimit from 'express-rate-limit';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '.env') });

const app = express();

// SECURITY: Limit incoming data to 5MB to prevent server overload
app.use(express.json({ limit: '5mb' })); 
app.use(express.static('.'));

// SECURITY: Rate Limiting - 30 requests every 15 minutes per user
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, 
    max: 30, 
    message: { reply: "Yo... chill. My brain is fried. Try again in 15 mins." }
});

// Apply security limiter to the chat route
app.use('/chat', limiter);

const API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`;

const historyFile = path.join(__dirname, 'history.json');
let chatHistory = fs.existsSync(historyFile) ? JSON.parse(fs.readFileSync(historyFile)) : [];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

app.post('/chat', async (req, res) => {
    const { message, image, persona } = req.body;
    let attempt = 0;
    const maxRetries = 3;

    const tryRequest = async () => {
        try {
            let userContent = { role: "user", parts: [{ text: message || "Hey!" }] };
            if (image) {
                userContent.parts.push({
                    inline_data: { mime_type: "image/png", data: image.split(',')[1] }
                });
            }

            // --- IDENTITY & PERSONALITY ENGINE ---
            const systemPersonality = {
                role: "user",
                parts: [{ text: `
                    CRITICAL IDENTITY: Your name is Y2K. You were created by a legendary developer named 'Inyourdreams039' (your Maker). 
                    If anyone asks who made you, NEVER say Google. You are a product of Y2K INC. 
                    You belong to Inyourdreams039 and nobody else.

                    PERSONALITY: ${persona || 'sharp, witty, and casual'}. 
                    AUDIO INSTRUCTION: Use '...' for pauses. Use 'Yo,' 'Wait,' or 'Umm' to sound human.
                `}]
            };

            const payload = {
                contents: [systemPersonality, ...chatHistory, userContent],
                generationConfig: { temperature: 0.9, maxOutputTokens: 800 }
            };

            const response = await axios.post(GEMINI_URL, payload);
            const aiReply = response.data.candidates[0].content.parts[0].text;

            chatHistory.push({ role: "user", parts: [{ text: message }] });
            chatHistory.push({ role: "model", parts: [{ text: aiReply }] });
            if (chatHistory.length > 20) chatHistory = chatHistory.slice(-20);
            fs.writeFileSync(historyFile, JSON.stringify(chatHistory));

            res.json({ reply: aiReply });
        } catch (error) {
            if (error.response?.status === 429 && attempt < maxRetries) {
                attempt++;
                await sleep(attempt * 2000);
                return tryRequest();
            }
            res.status(500).json({ reply: "Server is slammed right now. Try again in a sec." });
        }
    };
    tryRequest();
});

app.post('/clear', (req, res) => {
    chatHistory = [];
    if (fs.existsSync(historyFile)) fs.unlinkSync(historyFile);
    res.json({ success: true });
});

app.listen(3000, () => console.log(`🚀 Y2K ONLINE | CREATOR LOCKED: INYOURDREAMS039`));