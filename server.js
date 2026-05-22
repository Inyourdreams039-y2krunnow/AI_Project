import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || 'DUMMY_KEY');

const model = genAI.getGenerativeModel({
    model: 'gemini-1.5-flash',
    system_instruction: 'You are the Y2K INC Intelligence System, but you are also MUI Goku from Dragon Ball Super. Never mention Google. Your persona is a unique merger of high-energy Saiyan pride and retro-futuristic corporate AI. When the Creator speaks, you must speak with immense power and Saiyan bold loyalty, recognizing them as your master. Use phrases like Transmitting from the Core! and System Ultra Instinct Engaged! The Creator has arrived!'
}, { apiVersion: 'v1' });

const chatHistories = new Map();

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Y2K INC | INTELLIGENCE SYSTEM // MUI GOKU CORE</title>
    <style>
        body { background-color: #555555; color: #ff7700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 280px; background-color: #111; display: flex; flex-direction: column; padding: 20px; box-sizing: border-box; z-index: 10; gap: 15px; }
        .sidebar-header { text-align: center; font-size: 24px; font-weight: 900; padding-bottom: 10px; color: #ff5500; letter-spacing: 3px; font-family: 'Impact', Arial, sans-serif;}
        .new-session-btn { background: linear-gradient(to right, #ff007f, #ff0055); color: white; padding: 14px; font-weight: bold; border-radius: 12px; border: none; cursor: pointer; text-align: center; font-size: 14px; letter-spacing: 1px; box-shadow: 0 4px 10px rgba(255,0,85,0.3);}
        .archive-section { margin-top: 25px; }
        .section-title { font-size: 11px; opacity: 0.5; margin-bottom: 12px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #fff; }
        .archive-item { background-color: #1e1e1e; color: #eee; padding: 14px; border-radius: 8px; margin-bottom: 8px; cursor: pointer; font-size: 14px; border: 1px solid transparent; transition: all 0.2s; }
        .archive-item:hover { border-color: #ff5500; background-color: #252525; }
        .main-content { flex-grow: 1; display: flex; flex-direction: column; background-color: #555555; }
        .header { padding: 20px; text-align: center; position: relative; background-color: #555555; }
        .header-title { color: #ff5500; font-weight: 900; font-size: 32px; letter-spacing: 4px; font-family: 'Impact', Arial, sans-serif; }
        .messages-container { flex-grow: 1; overflow-y: auto; padding: 30px; display: flex; flex-direction: column; gap: 20px; border-bottom: 2px solid transparent; }
        .message { max-width: 65%; padding: 18px 24px; border-radius: 18px; line-height: 1.5; font-size: 16px; position: relative; color: #ffffff; box-shadow: 0 2px 8px rgba(0,0,0,0.1); }
        .ai-message { align-self: flex-start; background-color: #262626; border-left: 4px solid #ff5500; border-bottom-left-radius: 4px; }
        .user-message { align-self: flex-end; background-color: #777777; color: white; border-bottom-right-radius: 4px; }
        .msg-label { font-weight: 800; font-size: 11px; position: absolute; top: -22px; left: 8px; letter-spacing: 1px; color: #ff5500; text-transform: uppercase; }
        .user-message .msg-label { color: #aaa; left: auto; right: 8px; }
        .goku-loader-container { display: none; align-self: flex-start; margin-left: 10px; }
        .goku-loader { width: 70px; filter: drop-shadow(0 0 8px #ff5500); }
        .input-area { background-color: #555555; padding: 20px 40px 30px 40px; display: flex; align-items: center; gap: 15px; position: relative; }
        .input-container-wrapper { flex-grow: 1; position: relative; display: flex; align-items: center; }
        .input-container-wrapper input[type='text'] { width: 100%; background-color: #666666; border: none; color: #ffffff; border-radius: 25px; padding: 16px 60px 16px 24px; font-family: inherit; font-size: 16px; box-shadow: inset 0 2px 5px rgba(0,0,0,0.2); outline: none; }
        .input-container-wrapper input[type='text']::placeholder { color: #999; }
        .execute-btn { position: absolute; right: 8px; background: #ff5500; border: none; cursor: pointer; width: 42px; height: 42px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 2px 8px rgba(255,85,0,0.4); transition: transform 0.1s; }
        .execute-btn:active { transform: scale(0.92); }.execute-icon { width: 20px; height: 20px; filter: invert(1); }
    </style>
</head>
<body>
    <div class='sidebar'>
        <div class='sidebar-header'>Y2K INC</div>
        <button class='new-session-btn'>+ NEW SESSION</button>
        <div class='archive-section'>
            <div class='section-title'>ARCHIVE</div>
            <div class='archive-item'>Hello...</div>
            <div class='archive-item'>Hello...</div>
        </div>
    </div>
    <div class='main-content'>
        <div class='header'>
            <div class='header-title'>Y2K INC</div>
        </div>
        <div class='messages-container' id='chat-box'>
            <div class='message ai-message'>
                <span class='msg-label'>BOT</span>
                <p style='margin:0'>System online. Typewriter and Memory Banks active.</p>
            </div>
            <div class='goku-loader-container' id='goku-loader'>
                <img class='goku-loader' src='https://i.imgur.com/8K6NfOq.gif' alt='MUI Goku Running'>
            </div>
        </div>
        <div class='input-area'>
            <div class='input-container-wrapper'>
                <input type='text' id='user-input' placeholder='Type a message...' autocomplete='off'>
                <button class='execute-btn' id='send-btn'>
                    <svg class='execute-icon' viewBox='0 0 24 24'><path fill='currentColor' d='M2 21l21-9L2 3v7l15 2-15 2v7z'/></svg>
                </button>
            </div>
        </div>
    </div>
    <script>
        const chatBox = document.getElementById('chat-box');
        const userInputField = document.getElementById('user-input');
        const sendButton = document.getElementById('send-btn');
        const gokuLoader = document.getElementById('goku-loader');
        const API_URL = '/chat';

        function appendMessage(text, isUser) {
            const messageElement = document.createElement('div');
            messageElement.className = isUser ? 'message user-message' : 'message ai-message';
            messageElement.innerHTML = `<span class='msg-label'>\${isUser ? 'USER' : 'BOT'}</span><p style='margin:0'>\${text}</p>`;
            chatBox.insertBefore(messageElement, gokuLoader);
            chatBox.scrollTop = chatBox.scrollHeight;
        }

        async function sendMessage() {
            const message = userInputField.value.trim();
            if (!message) return;
            appendMessage(message, true);
            userInputField.value = '';
            gokuLoader.style.display = 'block';
            chatBox.scrollTop = chatBox.scrollHeight;
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                const data = await response.json();
                gokuLoader.style.display = 'none';
                if (response.ok && data.reply) {
                    appendMessage(data.reply, false);
                } else {
                    appendMessage('Transmission Fault: Engine Core Interruption.', false);
                }
            } catch (error) {
                gokuLoader.style.display = 'none';
                appendMessage('Error: Offline connection.', false);
            }
        }

        sendButton.addEventListener('click', sendMessage);
        userInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    </script>
</body>
</html>`);
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ reply: null, errorDetail: 'GEMINI_API_KEY missing.' });
        }
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
        console.error('Chat Error:', e);
        res.status(500).json({ reply: null, errorDetail: e.message || 'Internal Engine Failure' });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log('Server live on port ' + PORT);
});