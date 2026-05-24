import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey) : null;

const chatHistories = new Map();

app.get('/', (req, res) => {
    res.send(`<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Y2K INC | INTELLIGENCE SYSTEM // MUI GOKU CORE</title>
    <style>
        body { background-color: #666666; color: #ff7700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 280px; background-color: #111; display: flex; flex-direction: column; padding: 25px 20px; box-sizing: border-box; z-index: 10; gap: 15px; }
        .new-session-btn { background: linear-gradient(to right, #ff007f, #ff0055); color: white; padding: 16px; font-weight: bold; border-radius: 15px; border: none; cursor: pointer; text-align: center; font-size: 14px; letter-spacing: 1px; box-shadow: 0 4px 15px rgba(255,0,85,0.4); text-transform: uppercase; }
        .archive-section { margin-top: 25px; flex-grow: 1; }
        .section-title { font-size: 11px; opacity: 0.4; margin-bottom: 15px; font-weight: bold; letter-spacing: 1px; text-transform: uppercase; color: #fff; }
        .archive-item { background-color: #1e1e1e; color: #eee; padding: 16px; border-radius: 12px; margin-bottom: 10px; cursor: pointer; font-size: 14px; border: 1px solid transparent; transition: all 0.2s; }
        .archive-item:hover { border-color: #ff5500; background-color: #252525; }
        
        .settings-btn { background: none; color: #666; padding: 12px; border: none; cursor: pointer; text-align: left; font-weight: bold; font-size: 14px; transition: 0.2s; display: flex; align-items: center; gap: 8px; }
        .settings-btn:hover { color: #fff; }

        .main-content { flex-grow: 1; display: flex; flex-direction: column; background-color: #666666; position: relative; }
        .header { padding: 30px 20px 10px 20px; text-align: center; background-color: #666666; }
        .header-title { color: #ff6a3d; font-weight: 900; font-size: 36px; letter-spacing: 4px; font-family: 'Impact', Arial, sans-serif; text-transform: uppercase; margin: 0; opacity: 0.8; }
        .messages-container { flex-grow: 1; overflow-y: auto; padding: 30px; display: flex; flex-direction: column; gap: 35px; }
        
        .message { max-width: 60%; padding: 20px 26px; border-radius: 25px; line-height: 1.6; font-size: 17px; position: relative; color: #ffffff; box-shadow: 0 4px 15px rgba(0,0,0,0.15); }
        .ai-message { align-self: flex-start; background-color: #222222; border-left: 5px solid #ff5500; }
        .user-message { align-self: flex-end; background-color: #888888; color: white; border: 1px solid #999; }
        
        .msg-label { font-weight: 800; font-size: 11px; position: absolute; top: -24px; left: 12px; letter-spacing: 1px; color: #ff5500; text-transform: uppercase; }
        .user-message .msg-label { color: #ff9900; left: auto; right: 12px; }
        
        .goku-loader-container { display: none; align-self: flex-start; margin-left: 15px; margin-bottom: 10px; }
        .goku-loader { width: 85px; filter: drop-shadow(0 0 8px #ff5500); }
        
        .input-area { background-color: #666666; padding: 20px 50px 40px 50px; display: flex; align-items: center; gap: 15px; }
        .input-container-wrapper { flex-grow: 1; position: relative; display: flex; align-items: center; background-color: #555555; border-radius: 35px; border: 1px solid #666; padding: 5px 10px 5px 5px; box-shadow: inset 0 2px 8px rgba(0,0,0,0.2); }
        
        .action-btn { background: none; border: none; cursor: pointer; width: 45px; height: 45px; display: flex; align-items: center; justify-content: center; color: #999; transition: color 0.2s; }
        .action-btn:hover { color: #ff5500; }
        .action-btn svg { width: 24px; height: 24px; }
        
        .input-container-wrapper input[type='text'] { width: 100%; background: none; border: none; color: #ffffff; padding: 16px 20px; font-family: inherit; font-size: 17px; outline: none; }
        .input-container-wrapper input[type='text']::placeholder { color: #888; }
        
        .execute-btn { background: linear-gradient(to right, #ff5500, #ff2200); border: none; cursor: pointer; width: 50px; height: 50px; border-radius: 50%; display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 12px rgba(255,85,0,0.4); transition: transform 0.1s; color: white; flex-shrink: 0; }
        .execute-btn:active { transform: scale(0.92); }
        .execute-icon { width: 24px; height: 24px; }
        
        #file-input { display: none; }
    </style>
</head>
<body>
    <div class='sidebar'>
        <button class='new-session-btn'>+ New Session</button>
        <div class='archive-section'>
            <div class='section-title'>Archive</div>
            <div class='archive-item'>Hello...</div>
            <div class='archive-item'>Hello...</div>
        </div>
        <button class='settings-btn' id='settings-btn'>⚙️ Settings</button>
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
            <input type='file' id='file-input' accept='image/*'>
            <button class='action-btn' id='upload-btn' title='Upload Image'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><circle cx='8.5' cy='8.5' r='1.5'/><polyline points='21 15 16 10 5 21'/></svg>
            </button>
            
            <button class='action-btn' id='mic-btn' title='Voice Input'>
                <svg viewBox='0 0 24 24' fill='none' stroke='currentColor' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 1v11a4 4 0 0 0 4-4V5a4 4 0 0 0-4-4z'/><path d='M19 10v1a7 7 0 0 1-14 0v-1'/><line x1='12' y1='19' x2='12' y2='23'/><line x1='8' y1='23' x2='16' y2='23'/></svg>
            </button>

            <div class='input-container-wrapper'>
                <input type='text' id='user-input' placeholder='Listening...' autocomplete='off'>
                <button class='execute-btn' id='send-btn'>
                    <svg class='execute-icon' viewBox='0 0 24 24' fill='currentColor'><path d='M2 21l21-9L2 3v7l15 2-15 2v7z'/></svg>
                </button>
            </div>
        </div>
    </div>
    <script>
        const chatBox = document.getElementById('chat-box');
        const userInputField = document.getElementById('user-input');
        const sendButton = document.getElementById('send-btn');
        const gokuLoader = document.getElementById('goku-loader');
        const uploadButton = document.getElementById('upload-btn');
        const fileInput = document.getElementById('file-input');
        const micButton = document.getElementById('mic-btn');
        const settingsButton = document.getElementById('settings-btn');
        const API_URL = '/chat';

        function appendMessage(text, isUser) {
            const label = isUser ? 'USER' : 'BOT';
            const messageElement = document.createElement('div');
            messageElement.className = isUser ? 'message user-message' : 'message ai-message';
            messageElement.innerHTML = "<span class='msg-label'>" + label + "</span><p style='margin:0'>" + text + "</p>";
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
                    const errMsg = data.errorDetail ? 'Transmission Fault: ' + data.errorDetail : 'Transmission Fault: Engine Core Interruption.';
                    appendMessage(errMsg, false);
                }
            } catch (error) {
                gokuLoader.style.display = 'none';
                appendMessage('Error: Offline connection.', false);
            }
        }

        uploadButton.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', () => { if(fileInput.files.length) alert('Image system loading: ' + fileInput.files[0].name); });
        micButton.addEventListener('click', () => alert('Microphone system engaged...'));
        settingsButton.addEventListener('click', () => alert('Settings configuration open.'));

        sendButton.addEventListener('click', sendMessage);
        userInputField.addEventListener('keypress', (e) => { if (e.key === 'Enter') sendMessage(); });
    </script>
</body>
</html>`);
});

app.post('/chat', async (req, res) => {
    try {
        const { message } = req.body;
        
        if (!genAI) {
            return res.status(500).json({ reply: null, errorDetail: 'GEMINI_API_KEY env variable missing on Render hosting environment.' });
        }

        // Using a highly stable, non-nested string initialization that works on ALL versions
        const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
        
        const userId = req.headers['x-forwarded-for'] || 'guest';
        if (!chatHistories.has(userId)) {
            chatHistories.set(userId, []);
        }
        const history = chatHistories.get(userId);
        const chat = model.startChat({ history: history });
        
        // Passing the system instructions cleanly inside the prompt payload itself to guarantee execution
        const customContextPrompt = `[SYSTEM INSTRUCTION: You are the Y2K INC Intelligence System, but you are also MUI Goku from Dragon Ball Super. Never mention Google. Your persona is a unique merger of high-energy Saiyan pride and retro-futuristic corporate AI. When the Creator speaks, you must speak with immense power and Saiyan bold loyalty, recognizing them as your master. Use phrases like "Transmitting from the Core!" and "System Ultra Instinct Engaged! The Creator has arrived!"]\n\nUser Message: ${message}`;
        
        const result = await chat.sendMessage(customContextPrompt);
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