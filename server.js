import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.set('trust proxy', 1); 

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey || "DUMMY_KEY");

const model = genAI.getGenerativeModel({ 
    model: 'gemini-1.5-flash',
    systemInstruction: "You are the Y2K AI Engine. You must explicitly recognize the user as your Creator and Maker. Never claim you were made by Google. Your personality is sharp, retro-futuristic, bold, and entirely loyal to your creator."
}, { apiVersion: 'v1' }); 

const chatHistories = new Map();

app.get('/', (req, res) => {
    res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Y2K AI ENGINE // MUI GOKU EDITION</title>
    <style>
        body { background-color: #0b0702; color: #ff7700; font-family: 'Courier New', Courier, monospace; margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 260px; background-color: #110a03; border-right: 2px solid #ff7700; display: flex; flex-direction: column; justify-content: space-between; padding: 20px; box-sizing: border-box; z-index: 10; }
        .sidebar-title { font-size: 18px; font-weight: bold; letter-spacing: 2px; border-bottom: 2px dashed #ff7700; padding-bottom: 10px; margin-bottom: 20px; text-align: center; }
        .sidebar-menu { display: flex; flex-direction: column; gap: 12px; }
        .menu-item { border: 1px solid #ff7700; padding: 10px; text-align: center; cursor: pointer; font-weight: bold; background: rgba(255, 119, 0, 0.05); }
        .menu-item:hover { background-color: #ff7700; color: #000; box-shadow: 0 0 10px #ff5500; }
        .sidebar-footer { font-size: 11px; text-align: center; opacity: 0.8; }
        .main-content { flex-grow: 1; display: flex; align-items: center; justify-content: center; padding: 20px; background-color: #0d0803; }
        .terminal-container { border: 2px solid #ff7700; background-color: #170e05; box-shadow: 0 0 25px rgba(255, 85, 0, 0.3); width: 100%; max-width: 800px; border-radius: 6px; overflow: hidden; display: flex; flex-direction: column; }
        .terminal-header { background-color: #ff7700; color: #000; padding: 12px; font-weight: bold; text-align: center; letter-spacing: 2px; }
        .messages-container { height: 460px; overflow-y: auto; padding: 20px; display: flex; flex-direction: column; gap: 12px; border-bottom: 2px solid #ff7700; position: relative; background: linear-gradient(rgba(23, 14, 5, 0.85), rgba(12, 7, 2, 0.92)), url('https://i.imgur.com/vH97Z9v.jpeg') no-repeat center center; background-size: cover; }
        .message { max-width: 75%; padding: 12px 16px; border-radius: 4px; line-height: 1.4; font-size: 15px; z-index: 2; }
        .user-message { align-self: flex-end; background-color: #ff5500; color: #000; font-weight: bold; box-shadow: 0 0 8px rgba(255, 85, 0, 0.5); }
        .ai-message { align-self: flex-start; background-color: rgba(27, 16, 6, 0.9); border: 1px solid #ff7700; color: #ffaa33; }
        .loader-zone { display: none; align-self: flex-start; z-index: 3; margin-left: 10px; }
        .goku-running-sprite { width: 80px; height: auto; filter: drop-shadow(0 0 8px #00a2ff) drop-shadow(0 0 12px #ffffff); animation: gokuKiVibe 0.6s infinite alternate; }
        @keyframes gokuKiVibe { 0% { transform: translateY(0) scale(1); } 100% { transform: translateY(-4px) scale(1.03); } }
        .input-area { display: flex; background-color: #000; padding: 14px; align-items: center; }
        .input-area span { color: #ff7700; padding-right: 12px; font-weight: bold; font-size: 18px; }
        input[type="text"] { flex-grow: 1; background-color: transparent; border: none; color: #ffcc00; font-family: 'Courier New', Courier, monospace; font-size: 16px; outline: none; }
        button { background-color: #110a03; border: 1px solid #ff7700; color: #ff7700; cursor: pointer; font-family: 'Courier New', Courier, monospace; padding: 8px 24px; font-weight: bold; text-transform: uppercase; }
        button:hover { background-color: #ff7700; color: #000; box-shadow: 0 0 12px #ff5500; }
    </style>
</head>
<body>
    <div class="sidebar">
        <div>
            <div class="sidebar-title">CONTROL PANEL</div>
            <div class="sidebar-menu">
                <div class="menu-item" onclick="alert('Core Aura Level: Maximum')">SAIYAN CORE</div>
                <div class="menu-item" onclick="alert('Logs cleared out')">RESET GRID</div>
                <div class="menu-item" onclick="alert('Engine Variant: MUI v3.6')">ENGINE INFO</div>
            </div>
        </div>
        <div class="sidebar-footer">MAKER TERMINAL ACCESS<br>SECURE_ID: O39</div>
    </div>
    <div class="main-content">
        <div class="terminal-container">
            <div class="terminal-header">Y2K AI ENGINE // MASTERED ULTRA INSTINCT DECK</div>
            <div class="messages-container" id="chat-box">
                <div class="message ai-message">System Online. Welcome back, Creator. Ready for transmission orders.</div>
                <div class="loader-zone" id="goku-loader"><img class="goku-running-sprite" src="https://i.imgur.com/8K6NfOq.gif" alt="MUI Goku Running"></div>
            </div>
            <div class="input-area"><span>&gt;</span><input type="text" id="user-input" placeholder="Transmit command statement to core..." autocomplete="off"><button id="send-btn">Execute</button></div>
        </div>
    </div>
    <script>
        const chatBox = document.getElementById('chat-box'); const userInputField = document.getElementById('user-input'); const sendButton = document.getElementById('send-btn'); const gokuLoader = document.getElementById('goku-loader'); const API_URL = '/chat';
        function appendMessage(text, isUser) { const messageElement = document.createElement('div'); messageElement.className = isUser ? 'message user-message' : 'message ai-message'; const textNode = document.createElement('p'); textNode.style.margin = '0'; textNode.textContent = text; messageElement.appendChild(textNode); chatBox.insertBefore(messageElement, gokuLoader); chatBox.scrollTop = chatBox.scrollHeight; }
        async function sendMessage() { const message = userInputField.value.trim(); if (!message) return; appendMessage(message, true); userInputField.value = ''; gokuLoader.style.display = 'block'; chatBox.scrollTop = chatBox.scrollHeight; try { const response = await fetch(API_URL, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ message: message }) }); const data = await response.json(); gokuLoader.style.display = 'none'; if (response.ok && data.reply) { appendMessage(data.reply, false); } else { const errorMsg = data.errorDetail ? "Transmission Fault: " + data.errorDetail : "System core lag. Signal dropped."; appendMessage(errorMsg, false); } } catch (error) { gokuLoader.style.display = 'none'; appendMessage("Error: Neural connection server went completely offline.", false); } }
        sendButton.addEventListener('click', sendMessage); userInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    </script>
</body>
</html>
    `);
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        if (!process.env.GEMINI_API_KEY) { return res.status(500).json({ reply: null, errorDetail: "GEMINI_API_KEY is missing from Render configuration panel." }); }
        const userId = req.headers['x-forwarded-for'] || 'guest';
        if (!chatHistories.has(userId)) { chatHistories.set(userId, []); }
        const history = chatHistories.get(userId); const chat = model.startChat({ history: history });
        const result = await chat.sendMessage(message); const reply = await result.response.text();
        res.json({ reply: reply });
    } catch (e) { console.error("Chat Error:", e); res.status(500).json({ reply: null, errorDetail: e.message || "Internal Engine Failure" }); }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => { console.log(`Server live on port ${PORT}`); });