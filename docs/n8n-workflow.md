# n8n Workflow Setup for the ABAP Code Assistant

This workflow replaces ChatKit with an n8n webhook that calls OpenAI. The React app posts RICEF payloads to your webhook using the `VITE_N8N_WEBHOOK_URL` environment variable.

## Payload contract
Request body sent by the app:
```json
{
  "ricefType": "Report|Interface|Conversion|Enhancement|Form",
  "templateVariables": {"field": "value"},
  "templateText": "optional extracted text",
  "additionalRequirements": "optional",
  "previousAbapCode": "optional (used for refine)",
  "refinementInstructions": "optional"
}
```

Response expected from n8n/OpenAI:
```json
{
  "abapCode": "string",
  "notes": "string (optional)",
  "questions": ["string"]
}
```

## Build the workflow
1. **Webhook** (Trigger)
   - Method: `POST`
   - Path: `abap-agent`
   - Response mode: `On Received`
   - Response content type: `JSON`
2. **Function** (normalize input)
   ```javascript
   const body = items[0].json;
   if (!body.ricefType) {
     throw new Error('ricefType is required');
   }
   if (!body.templateVariables) {
     throw new Error('templateVariables are required');
   }

   const systemMessage = `You are an ABAP assistant. Generate ${body.ricefType} deliverables with safe code.`;
   const userMessage = [
     `Template text: ${body.templateText || 'n/a'}`,
     `Variables: ${JSON.stringify(body.templateVariables)}`,
     `Additional requirements: ${body.additionalRequirements || 'n/a'}`,
     body.previousAbapCode ? `Previous ABAP: ${body.previousAbapCode}` : '',
     body.refinementInstructions ? `Refinement: ${body.refinementInstructions}` : '',
   ]
     .filter(Boolean)
     .join('\n');

   return [
     {
       json: {
         messages: [
           { role: 'system', content: systemMessage },
           { role: 'user', content: userMessage },
         ],
         model: body.model || 'gpt-4o-mini',
         temperature: body.temperature ?? 0.2,
         max_tokens: body.maxTokens ?? 1200,
       },
     },
   ];
   ```
3. **HTTP Request** (OpenAI Chat Completions)
   - URL: `https://api.openai.com/v1/chat/completions`
   - Method: `POST`
   - Authentication: Bearer header with your OpenAI key
   - JSON/RAW parameters: `true`
   - Body: `{{$json}}`
4. **Set** (shape response)
   - Keep Only Set: `true`
   - JSON values:
     ```json
     {
       "abapCode": "{{$json[\"choices\"][0][\"message\"][\"content\"]}}",
       "notes": "Generated via n8n OpenAI call",
       "questions": []
     }
     ```
5. **Respond** (optional) – if you prefer explicit response node, send the shaped JSON.

## Testing the webhook
Use curl (replace URL):
```bash
curl -X POST "https://your-n8n-host/webhook/abap-agent" \
  -H "Content-Type: application/json" \
  -d '{
    "ricefType": "Report",
    "templateVariables": {"projectName": "Bluefield"},
    "additionalRequirements": "Avoid SELECT *"
  }'
```

## Notes
- Keep `.docx` files out of Git; templates are generated in the browser from text sources in `/public/templates-source/`.
- The webhook only handles JSON payloads; document uploads stay client-side for text extraction with Mammoth.
- Adjust `model`, `temperature`, or `max_tokens` directly in the request body as needed.
