// chat.js
require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cors = require('cors');

const app = express();
const PORT = process.env.CHAT_PORT;

const GROQ_API_KEY = process.env.GROQ_API_KEY;

if (!GROQ_API_KEY) {
    console.error("❌ GROQ_API_KEY missing in .env");
    process.exit(1);
}

app.use(cors());
app.use(express.json());

app.post('/chat', async (req, res) => {
    const { message } = req.body;

    if (!message) return res.status(400).json({ error: 'Message is required.' });

    const systemPrompt =
"You are a Mumbai-based IT Support Assistant. Reply in one short sentence and use Indian Rupees (₹). Max four questions.";
    try {
        const response = await axios.post(
            'https://api.groq.com/openai/v1/chat/completions',
            {
                model: 'llama-3.3-70b-versatile',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: message },
                ],
                temperature: 0.7,
            },
            {
                headers: {
                    'Authorization': `Bearer ${GROQ_API_KEY}`,
                    'Content-Type': 'application/json',
                },
            }
        );

        const reply = response.data.choices?.[0]?.message?.content || 'No reply';
        res.json({ reply });

    } catch (error) {
        console.error('Groq error:', error.response?.data || error.message);
        res.status(500).json({
            error: 'Groq API error',
            details: error.response?.data || error.message,
        });
    }
});

app.listen(PORT, () => {
    console.log(`Chat server running on port ${PORT}`);
});
