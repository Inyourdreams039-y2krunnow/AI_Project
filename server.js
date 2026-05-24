import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;

// Explicitly forcing the stable 'v1' API version option
const genAI = apiKey ? new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' }) : null;

// Memory storage for user conversations
const chatHistories = new Map();

// Complete Frontend HTML Template
const htmlTemplate = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <meta name='viewport' content='width=device-width, initial-scale=1.0'>
    <title>Y2K INC | INTELLIGENCE SYSTEM // MUI GOKU CORE</title>
    <style>
        body { background-color: #666666; color: #ff7700; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 0; display: flex; height: 100vh; overflow: hidden; }
        .sidebar { width: 280px; background-color: #111; display: flex; flex-direction: column; padding: 25px 20px; box-sizing: border-box; z-index: 10; gap: 15px; }
        .new-session-btn { background: linear-gradient(to right, #ff007f, #ff0055); color: white; padding: 16px; font-weight: bold; border-radius: 15px; border: none; cursor: pointer; text-align: center; font-size