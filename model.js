const url = 'http://192.168.1.19:1234/v1/chat/completions';
const model = "lmstudio-community/Meta-Llama-3.1-8B-Instruct-GGUF"

async function generateCode(prompt) {
  const body = JSON.stringify({
    "model": model,
    "messages": [
      { "role": "system", "content": "Do not explain, just give me the filenames and the content of each" },
      { "role": "user", "content": prompt }
    ],
    "temperature": 0.8,
    "max_tokens": -1,
    "stream": false
  });

  let response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: body
  })
  let data = await response.json();
  const contenido = data.choices[0].message.content;
  return contenido;
}

module.exports = { generateCode };
