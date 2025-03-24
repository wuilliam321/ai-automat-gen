const Anthropic = require('@anthropic-ai/sdk');
require('dotenv').config();

const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY
});

async function generateCode(prompt) {
  try {
    const response = await anthropic.messages.create({
      model: 'claude-3-5-sonnet-20240620', // Latest Claude model
      max_tokens: 4096,
      temperature: 0.3,
      system: "Do not explain, just give me the filenames and the content of each",
      messages: [
        {
          role: "user",
          content: prompt
        }
      ]
    });

    // Extract the content from the first message response
    const contenido = response.content[0].text;
    return contenido;
  } catch (error) {
    console.error('Error generating code:', error);
    throw error;
  }
}

module.exports = { generateCode };
