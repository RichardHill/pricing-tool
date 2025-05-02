const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

router.post('/', async (req, res) => {
  try {
    const dataArray = req.body.data;
    if (!Array.isArray(dataArray)) {
      return res.status(400).json({ error: 'Expected an array of product data' });
    }

    const summaryPrompt = `You are a pricing analyst writing a summary for a CFO. Here is a list of products including competitor pricing, cost base, target margins, and calculated suggested prices and gross margins. Write a clear one-paragraph summary explaining pricing strategy, margin performance, and any notable patterns.
Data:
${JSON.stringify(dataArray, null, 2)}

Respond in a confident and concise professional tone.
`;

    const completion = await openai.chat.completions.create({
      model: 'gpt-4',
      messages: [{ role: 'user', content: summaryPrompt }],
    });

    const summary = completion.choices[0].message.content;
    res.status(200).json({ summary });
  } catch (error) {
    console.error('Error generating CFO summary:', error);
    res.status(500).json({ error: 'Failed to generate summary.' });
  }
});

module.exports = router;