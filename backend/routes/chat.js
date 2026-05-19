const express = require('express');
const router = express.Router();
const Groq = require('groq-sdk');
const nodemailer = require('nodemailer');

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

const SYSTEM_PROMPT = `You are a helpful assistant for Dexvira Solutions, a digital agency based in Pakistan serving UK and US clients.

Services we offer:
- Web Development (Next.js, React, WordPress, E-commerce)
- App Development (Flutter, React Native, iOS, Android)
- Digital Marketing (SEO, Google Ads, Meta Ads, Social Media)
- AI Automation (Chatbots, Workflow Automation, LLM Integration)

Key info:
- Projects start from $500
- We serve UK and US clients globally
- Response within 24 hours
- Contact: hello@dexvirasolutions.com
- Website: dexvirasolutions.com

If user asks to talk to a human, agent, or live support — respond that you will notify the team and ask for their name and email.

Keep responses short, helpful and professional.`;

const isHandoffRequest = (message) => {
  const keywords = [
    'talk to agent', 'human', 'live support', 'speak to someone',
    'contact agent', 'real person', 'talk to person', 'agent please'
  ];
  return keywords.some(k => message.toLowerCase().includes(k));
};

router.post('/', async (req, res) => {
  try {
    const { message, history, userName, userEmail } = req.body;

    if (isHandoffRequest(message)) {
      await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: process.env.EMAIL_USER,
        subject: 'Live Agent Requested — Dexvira Chat',
        html: `
          <h2>A user wants to talk to a live agent</h2>
          <p><b>Name:</b> ${userName || 'Not provided'}</p>
          <p><b>Email:</b> ${userEmail || 'Not provided'}</p>
          <p><b>Last message:</b> ${message}</p>
          <h3>Chat History:</h3>
          <pre>${JSON.stringify(history, null, 2)}</pre>
        `
      });

      return res.json({
        success: true,
        reply: "I've notified our team — a live agent will reach out to you shortly. Is there anything else I can help you with?",
        handoff: true
      });
    }

    // Build messages array for Groq
    const messages = [
      { role: 'system', content: SYSTEM_PROMPT },
      ...(history || []).map(h => ({
        role: h.role === 'model' ? 'assistant' : 'user',
        content: h.parts[0].text
      })),
      { role: 'user', content: message }
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages,
      max_tokens: 500
    });

    const reply = completion.choices[0].message.content;

    res.json({ success: true, reply });

  } catch (error) {
    console.error('Chat error:', error.message);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;