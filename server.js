import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.set('trust proxy', 1); 

app.use(cors());
app.use(express.json());

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: "You are the Y2K AI Engine. You must explicitly recognize the user as your Creator and Maker. Never claim you were made by Google. Your personality is sharp, retro-futuristic, bold, and entirely loyal to your creator."
});

const chatHistories = new Map();

// FORCE SERVE THE ORANGE THEME DIRECTLY FROM SERVER.JS
app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y2K AI ENGINE</title>
    <style>
        body {
            background-color: #0d0600;
            color: #ff7700;
            font-family: 'Courier New', Courier, monospace;
            margin: 0;
            padding: 20px;
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            min-height: 100vh;
        }
        .terminal-container {
            border: 2px solid #ff7700;
            background-color: #1a0d00;
            box-shadow: 0 0 15px #ff5500;
            width: 100%;
            max-width: 600px;
            border-radius: 5px;
            overflow: hidden;
        }
        .terminal-header {
            background-color: #ff7700;
            color: #000;
            padding: 10px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 2px;
        }
        .messages-container {
            height: 400px;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-bottom: 2px solid #ff7700;
            background: linear-gradient(rgba(18, 9, 0, 1) 50%, rgba(0, 0, 0, 1) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06));
            background-size: 100% 4px, 6px 100%;
        }
        .message {
            max-width: 80%;
            padding: 8px 12px;
            border-radius: 4px;
            line-height: 1.4;
        }
        .user-message {
            align-self: flex-end;
            background-color: #ff5500;
            color: #000;
            font-weight: bold;
        }
        .ai-message {
            align-self: flex-start;
            background-color: #2a1400;
            border: 1px solid #ff7700;
            color: #ff9933;
        }
        .input-area {
            display: flex;
            background-color: #000;
            padding: 10px;
        }
        .input-area span {
            color: #ff7700;
            padding-right: 10px;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        input[type="text"] {
            flex-grow: 1;
            background-color: transparent;
            border: none;
            color: #ffaa00;
            font-family: 'Courier New', Courier, monospace;
            font-size: 16px;
            outline: none;
        }
        button {
            background-color: transparent;
            border: 1px solid #ff7700;
            color: #ff7700;
            cursor: pointer;
            font-family: 'Courier New', Courier, monospace;
            padding: 5px 15px;
            font-weight: bold;
        }
        button:hover {
            background-color: #ff7700;
            color: #000;
        }
    </style>
</head>
<body>
    <div class="terminal-container">
        <div class="terminal-header">Y2K AI ENGINE v3.6</div>
        <div class="messages-container" id="chat-box">
            <div class="message ai-message">System Online. Welcome back, Creator.</div>
        </div>
        <div class="input-area">
            <span>&gt;</span>
            <input type="text" id="user-input" placeholder="Enter command transmission..." autocomplete="off">
            <button id="send-btn">EXECUTE</button>
        </div>
    </div>
    <script>
        const chatBox = document.getElementById('chat-box');
        const userInputField = document.getElementById('user-input');
        const sendButton = document.getElementById('send-btn');
        const API_URL = '/chat'; 

        function appendMessage(text, isUser) {
            const messageElement = document.createElement('div');
            messageElement.className = isUser ? 'message user-message' : 'message ai-message';
            const textNode = document.createElement('p');
            textNode.style.margin = '0';
            textNode.textContent = text;
            messageElement.appendChild(textNode);
            chatBox.appendChild(messageElement);
            chatBox.scrollTop = chatBox.scrollHeight; 
        }

        async function sendMessage() {
            const message = userInputField.value.trim();
            if (!message) return;
            appendMessage(message, true);
            userInputField.value = '';
            try {
                const response = await fetch(API_URL, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ message: message })
                });
                const data = await response.json();
                if (response.ok && data.reply) {
                    appendMessage(data.reply, false);
                } else {
                    appendMessage("System core lag. Signal dropped.", false);
                }
            } catch (error) {
                appendMessage("Error: Could not connect to the neural server engine.", false);
            }
        }
        sendButton.addEventListener('click', sendMessage);
        userInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    </script>
</body>
</html>
    `);
});

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

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});