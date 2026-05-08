export async function sendMessageToGemini(message: string, history: { role: 'user' | 'model', parts: { text: string }[] }[] = []) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message, history })
    });
    
    if (!response.ok) throw new Error("AI service error");
    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Gemini Proxy Error:", error);
    throw new Error("Failed to get response from Saathi AI.");
  }
}

export async function checkSymptoms(symptoms: string, language: string) {
  try {
    const response = await fetch('/api/ai/symptoms', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ symptoms, language })
    });

    if (!response.ok) throw new Error("AI diagnostic failed");
    return await response.json();
  } catch (error) {
    console.error("Symptom Check Error:", error);
    throw error;
  }
}

export async function analyzeReport(text: string, image?: { data: string, mimeType: string }) {
  try {
    const response = await fetch('/api/ai/analyze-report', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ text, image })
    });

    if (!response.ok) throw new Error("Report analysis failed");
    return await response.json();
  } catch (error) {
    console.error("Report Analysis Error:", error);
    throw error;
  }
}
