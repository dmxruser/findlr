import express, { Router } from 'express';
import serverless from 'serverless-http';
import axios from 'axios';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { Handler } from '@netlify/functions';

const app = express();
const router = Router();

// CORS middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  next();
});

router.get('/search', async (req, res) => {
  const { q } = req.query;

  if (!q) {
    return res.status(400).json({ error: 'Query parameter "q" is required.' });
  }

  try {
    // Initialize Google Generative AI
    const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || '');
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });

    // Create prompt for AI model
    const prompt = `Translate the following user request into a single, concise search query for finding a project that does the thing that the person wants. Return only the search query itself, with no extra text or formatting. If you know a project name that would fit this persons query, do that instead.: ${q}`;

    // Call AI model
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const ai_query = await response.text();

    // Perform DuckDuckGo search
    const searchResponse = await axios.get(`https://html.duckduckgo.com/html/?q=${encodeURIComponent(ai_query)}`);

    // Parse HTML to extract search results
    const html = searchResponse.data;
    const links: string[] = [];
    const regex = /a class="result__a" href="(.*?)"/g;
    let match;
    while ((match = regex.exec(html)) !== null) {
      links.push(match[1]);
    }

    res.json({ results: links, ai_query });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'An error occurred during the search.' });
  }
});

app.use('/.netlify/functions/api', router);

export const handler: Handler = serverless(app);
