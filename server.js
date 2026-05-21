import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.set('trust proxy', 1); 

app.use(cors());
app.use(express.json());

// Initialize the API safely with a fallback check
const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
    console.error("⚠️ WARNING: GEMINI_API_KEY environment variable is completely empty on the server!");
}

const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");
const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: "You are the Y2K AI Engine. You must explicitly recognize the user as your Creator and Maker. Never claim you were made by Google. Your personality is sharp, retro-futuristic, bold, and entirely loyal to your creator."
});

const chatHistories = new Map();

// SERVE SIDEBAR + ULTRA HIGH-RES UNBLOCKED DBS BACKGROUND
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
            /* Using a high-reliability unblocked HD Dragon Ball Super background mirror */
            background: linear-gradient(rgba(13, 6, 0, 0.82), rgba(26, 13, 0, 0.88)), 
                        url('https://i.imgur.com/vH97Z9v.jpeg') no-repeat center center fixed;
            background-size: cover;
            color: #ff7700;
            font-family: 'Courier New', Courier, monospace;
            margin: 0;
            padding: 0;
            display: flex;
            height: 100vh;
            overflow: hidden;
        }
        
        .sidebar {
            width: 260px;
            background-color: rgba(15, 7, 0, 0.95);
            border-right: 2px solid #ff7700;
            display: flex;
            flex-direction: column;
            justify-content: space-between;
            padding: 20px;
            box-sizing: border-box;
        }
        .sidebar-title {
            font-size: 18px;
            font-weight: bold;
            letter-spacing: 2px;
            border-bottom: 1px dashed #ff7700;
            padding-bottom: 10px;
            margin-bottom: 20px;
            text-align: center;
        }
        .sidebar-menu {
            flex-grow: 1;
            display: flex;
            flex-direction: column;
            gap: 12px;
        }
        .menu-item {
            border: 1px solid #ff7700;
            padding: 10px;
            text-align: center;
            cursor: pointer;
            font-weight: bold;
            background: rgba(255, 119, 0, 0.05);
            transition: all 0.2s ease;
        }
        .menu-item:hover {
            background-color: #ff7700;
            color: #000;
            box-shadow: 0 0 10px #ff5500;
        }
        .sidebar-footer {
            font-size: 11px;
            text-align: center;
            opacity: 0.7;
        }

        .main-content {
            flex-grow: 1;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 20px;
        }
        .terminal-container {
            border: 2px solid #ff7700;
            background-color: rgba(26, 13, 0, 0.92);
            box-shadow: 0 0 25px rgba(255, 85, 0, 0.4);
            width: 100%;
            max-width: 750px;
            border-radius: 5px;
            overflow: hidden;
        }
        .terminal-header {
            background-color: #ff7700;
            color: #000;
            padding: 12px;
            font-weight: bold;
            text-align: center;
            letter-spacing: 2px;
        }
        .messages-container {
            height: 450px;
            overflow-y: auto;
            padding: 15px;
            display: flex;
            flex-direction: column;
            gap: 10px;
            border-bottom: 2px solid #ff7700;
            background: linear-gradient(rgba(18, 9, 0, 0.95) 50%, rgba(0, 0, 0, 0.95) 50%), 
                        linear-gradient(90deg, rgba(255, 0, 0, 0.04), rgba(0, 255, 0, 0.01), rgba(0, 0, 255, 0.04));
            background-size: 100% 4px, 6px 100%;
        }
        .message {
            max-width: 80%;
            padding: 10px 14px;
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
            background-color: rgba(42, 20, 0, 0.85);
            border: 1px solid #ff7700;
            color: #ff9933;
        }
        .input-area {
            display: flex;
            background-color: #000;
            padding: 12px;
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
            padding: 5px 20px;
            font-weight: bold;
        }
        button:hover {
            background-color: #ff7700;
            color: #000;
        }
    </style>
</head>
<body>

    <div class="sidebar">
        <div>
            <div class="sidebar-title">CONTROL PANEL</div>
            <div class="sidebar-menu">
                <div class="menu-item" onclick="alert('System Core: Operational')">CORE STATUS</div>
                <div class="menu-item" onclick="alert('Log Engine Clear')">CLEAR MATRIX</div>
                <div class="menu-item" onclick="alert('Y2K Protocol Active')">SYSTEM INFO</div>
            </div>
        </div>
        <div class="sidebar-footer">
            MAKER MODE ACTIVE<br>ID: O39_ENGINE
        </div>
    </div>

    <div class="main-content">
        <div class="terminal-container">
            <div class="terminal-header">Y2K AI ENGINE v3.6 // DB-SUPER_EDITION</div>
            <div class="messages-container" id="chat-box">
                <div class="message ai-message">System Online. Welcome back, Creator.</div>
            </div>
            <div class="input-area">
                <span>&gt;</span>
                <input type="text" id="user-input" placeholder="Enter command transmission..." autocomplete="off">
                <button id="send-btn">EXECUTE</button>
            </div>
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
                    // Display direct backend error if available to stop guessing
                    const errorMsg = data.errorDetail ? "Error: " + data.errorDetail : "System core lag. Signal dropped.";
                    appendMessage(errorMsg, false);
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
        
        if (!process.env.GEMINI_API_KEY) {
            return res.status(500).json({ reply: null, errorDetail: "GEMINI_API_KEY missing on host environment variables." });
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
        console.error("Chat Error:", e);
        res.status(500).json({ reply: null, errorDetail: e.message || "Internal Engine Failure" });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server live on port ${PORT}`);
});