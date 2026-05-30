import { getApiKey } from "./healthStorage";

const GEMINI_API_KEY_PLACEHOLDER = "YOUR_API_KEY_HERE";
const SYSTEM_PROMPT =
  "You are HealthBridge AI, a compassionate public health assistant. Help users understand symptoms, suggest when to seek medical care, and provide wellness advice aligned with SDG 3 (Good Health & Well-being). Always recommend consulting a real doctor for serious conditions.";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function callAI(messages: ChatMessage[]): Promise<string> {
  const key = getApiKey() || GEMINI_API_KEY_PLACEHOLDER;
  if (!key || key === "YOUR_API_KEY_HERE") {
    throw new Error("Please add your Gemini API key in Settings.");
  }

  const contents = messages
    .filter((m) => m.role !== "system")
    .map((m) => ({
      role: m.role === "assistant" ? "model" : "user",
      parts: [{ text: m.content }],
    }));

  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${encodeURIComponent(key)}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        contents,
      }),
    },
  );

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI error: ${res.status} ${t.slice(0, 160)}`);
  }
  const data = await res.json();
  return (
    data.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text).join("") ||
    "No response."
  );
}