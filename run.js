const fs = require('fs');
const path = require('path');
const selenium = require('./selenium');
const claude = require('./claude');

async function run() {
  // Define steps
  const steps = [
    {
      action: 'Navigate to login page',
      notes: 'Ensure secure HTTPS connection',
      html: '<div class="login-container"><form id="login-form">...</form></div>'
    },
    {
      action: 'Enter username and password',
      notes: 'Use test credentials',
      html: '<input type="text" name="username" id="username-input">\n<input type="password" name="password" id="password-input">'
    },
    {
      action: 'Click login button',
      notes: 'Validate successful login',
      html: '<button type="submit" id="login-button" class="btn btn-primary">Login</button>'
    }
  ];

  // Current URL for the test
  const currentUrl = 'https://example.com/login';

  // Generate prompt
  const prompt = selenium.generatePrompt(steps, currentUrl);
  const promptOutput = await claude.generateCode(prompt)

  // Write output to file
  const outputPath = path.join(__dirname, 'output.run.md');
  fs.writeFileSync(outputPath, promptOutput);

  console.log(`Prompt output written to ${outputPath}`);
}

run();
