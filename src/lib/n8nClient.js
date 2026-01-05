const N8N_URL = import.meta.env.VITE_N8N_WEBHOOK_URL;

async function sendToWebhook(payload) {
  if (!N8N_URL) {
    throw new Error('VITE_N8N_WEBHOOK_URL is not set. Add it to your .env file.');
  }

  const response = await fetch(N8N_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(`n8n webhook error (${response.status}): ${message}`);
  }

  const data = await response.json();
  return data;
}

export async function generateAbap(payload) {
  const response = await sendToWebhook(payload);
  return {
    abapCode: response.abapCode || '',
    notes: response.notes || '',
    questions: response.questions || [],
  };
}
