# Gemini API Integration Reference

## Endpoint Details

### Base Configuration

```javascript
// nextjs-app/.env.local
GEMINI_API_KEY=your-key-here
GEMINI_MODEL=gemini-2.5-pro
GEMINI_BASE_URL=https://generativelanguage.googleapis.com/v1
```

---

## Request Format

### Correct Gemini Native Format

```javascript
// POST /v1/models/gemini-2.5-pro:generateContent?key=YOUR_KEY

{
  "contents": [
    {
      "parts": [
        {
          "text": "Your prompt here"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7,
    "topK": 40,
    "topP": 0.95,
    "maxOutputTokens": 2048
  }
}
```

### Response Format

```javascript
{
  "candidates": [
    {
      "content": {
        "parts": [
          {
            "text": "Generated response text"
          }
        ],
        "role": "model"
      },
      "finishReason": "STOP",
      "index": 0
    }
  ],
  "usageMetadata": {
    "promptTokenCount": 25,
    "candidatesTokenCount": 45,
    "totalTokenCount": 70
  }
}
```

---

## API Endpoint

### URL Structure

```
https://generativelanguage.googleapis.com/v1/models/{MODEL}:generateContent?key={API_KEY}
```

**Parameters:**
- `{MODEL}` – Model name (e.g., `gemini-2.5-pro`)
- `{API_KEY}` – Your Gemini API key

### Headers

```
Content-Type: application/json
```

### HTTP Method

```
POST
```

---

## Common Patterns

### Translation Request

```javascript
// Request format for translation
{
  "contents": [
    {
      "parts": [
        {
          "text": "Translate to Spanish: Hello world"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.3,        // Lower = more consistent
    "maxOutputTokens": 1000
  }
}
```

### Validation Request

```javascript
// Request format for validation
{
  "contents": [
    {
      "parts": [
        {
          "text": "Validate this translation: ...",
          "text": "Check for: grammar, meaning, style"
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0,          // Deterministic
    "maxOutputTokens": 500
  }
}
```

---

## Error Handling

### Common Error Codes

| Code | Meaning | Solution |
|------|---------|----------|
| 400 | Bad Request | Check request format, verify JSON is valid |
| 401 | Unauthorized | Verify API key, check it's not expired |
| 403 | Forbidden | API key doesn't have access, check Gemini console |
| 404 | Not Found | Check endpoint URL and model name |
| 405 | Method Not Allowed | Should be POST, not GET/PUT/DELETE |
| 429 | Rate Limited | Wait and retry, check quota |
| 500+ | Server Error | Google's servers are down, retry later |

### Error Response Format

```javascript
{
  "error": {
    "code": 400,
    "message": "Invalid request: ...",
    "details": [
      {
        "@type": "type.googleapis.com/google.rpc.ErrorInfo",
        "reason": "INVALID_ARGUMENT",
        "domain": "googleapis.com"
      }
    ]
  }
}
```

---

## Implementation in Code

### NextJS Route Handler (route.ts)

```typescript
// nextjs-app/app/api/translate/route.ts

import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  const { prompt, provider = 'gemini' } = await req.json();
  
  try {
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
      const baseUrl = process.env.GEMINI_BASE_URL || 
        'https://generativelanguage.googleapis.com/v1';
      
      // Transform to Gemini native format
      const geminiPayload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      };
      
      const endpoint = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(geminiPayload)
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(
          `Gemini API error ${response.status}: ${error.error?.message}`
        );
      }
      
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      return NextResponse.json({ 
        text: result,
        usage: data.usageMetadata 
      });
    }
    
    // Handle other providers...
    
  } catch (error) {
    console.error('Translation error:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
```

### Express Compatible (translate.js)

```javascript
// nextjs-app/api/translate.js

module.exports = async (req, res) => {
  const { prompt, provider = 'gemini' } = req.body;
  
  try {
    if (provider === 'gemini') {
      const apiKey = process.env.GEMINI_API_KEY;
      const model = process.env.GEMINI_MODEL || 'gemini-2.5-pro';
      const baseUrl = process.env.GEMINI_BASE_URL || 
        'https://generativelanguage.googleapis.com/v1';
      
      const geminiPayload = {
        contents: [
          {
            parts: [
              {
                text: prompt
              }
            ]
          }
        ],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 2048
        }
      };
      
      const endpoint = `${baseUrl}/models/${model}:generateContent?key=${apiKey}`;
      
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(geminiPayload)
      });
      
      const data = await response.json();
      const result = data.candidates?.[0]?.content?.parts?.[0]?.text;
      
      res.json({ text: result, usage: data.usageMetadata });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
```

---

## Testing the Endpoint

### Using curl

```bash
curl -X POST \
  "https://generativelanguage.googleapis.com/v1/models/gemini-2.5-pro:generateContent?key=YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "contents": [{
      "parts": [{
        "text": "Say hello"
      }]
    }],
    "generationConfig": {
      "temperature": 0.7,
      "maxOutputTokens": 100
    }
  }'
```

### Using fetch in Node.js

```javascript
const apiKey = 'your-key';
const model = 'gemini-2.5-pro';

const response = await fetch(
  `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${apiKey}`,
  {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{
        parts: [{ text: 'Say hello' }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 100
      }
    })
  }
);

const data = await response.json();
console.log(data.candidates[0].content.parts[0].text);
```

---

## Migration from OpenAI

### ❌ Don't: OpenAI Format

```javascript
{
  "model": "gpt-3.5-turbo",
  "messages": [
    {
      "role": "user",
      "content": "Translate this: ..."
    }
  ],
  "temperature": 0.7
}
```

### ✅ Do: Gemini Format

```javascript
{
  "contents": [
    {
      "parts": [
        {
          "text": "Translate this: ..."
        }
      ]
    }
  ],
  "generationConfig": {
    "temperature": 0.7
  }
}
```

### Key Differences

| Aspect | OpenAI | Gemini |
|--------|--------|--------|
| Content structure | `messages: [{ role, content }]` | `contents: [{ parts: [{ text }] }]` |
| Roles | `user`, `assistant`, `system` | (no explicit roles in contents) |
| Generation config | Top-level fields | `generationConfig: {...}` |
| API Key | `Authorization: Bearer ...` | Query parameter or header |
| Response | `choices[0].message.content` | `candidates[0].content.parts[0].text` |

---

## Configuration Options

### generationConfig

```javascript
{
  "temperature": 0.7,              // 0 = deterministic, 1 = random
  "topK": 40,                      // Top K tokens considered
  "topP": 0.95,                    // Nucleus sampling threshold
  "maxOutputTokens": 2048,         // Max response length
  "stopSequences": ["END"],        // Stop generation at these strings
  "candidateCount": 1              // Number of responses
}
```

### Recommended Settings

**For Translation (consistency):**
```javascript
{
  "temperature": 0.3,
  "maxOutputTokens": 1000
}
```

**For Validation (deterministic):**
```javascript
{
  "temperature": 0,
  "maxOutputTokens": 500
}
```

**For Ideation (creativity):**
```javascript
{
  "temperature": 0.8,
  "topP": 0.9,
  "maxOutputTokens": 2000
}
```

---

## Files to Reference

- **Implementation:** `nextjs-app/app/api/translate/route.ts`
- **Legacy API:** `nextjs-app/api/translate.js`
- **Environment:** `nextjs-app/.env.local`
- **Troubleshooting:** See [AGENT-TROUBLESHOOTING.md](./AGENT-TROUBLESHOOTING.md)
