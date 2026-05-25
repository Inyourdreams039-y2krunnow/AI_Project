import express from 'express';
import cors from 'cors';
import { GoogleGenerativeAI } from '@google/generative-ai';

const app = express();
app.set('trust proxy', 1);

app.use(cors());
app.use(express.json());

const apiKey = process.env.GEMINI_API_KEY;
const genAI = apiKey ? new GoogleGenerativeAI(apiKey, { apiVersion: 'v1' }) : null;

const htmlTemplate = `<!DOCTYPE html>
<html lang='en'>
<head>
    <meta charset='UTF-8'>
    <title>Y2K INC // MUI GOKU CORE</title>
    <style>
        body { background-color: #666666; color: #ff7700; font-family: sans-serif; padding: 50px; text-align: center; }
        #chat-box { background: #222; border: 2px solid #ff5500; border-radius: 10px; max-width: 600px; margin: 20px auto; padding: 20px; min-height: 200px; text-align: left; color: #fff; }
        input, button { padding: 12px; font-size: 16