import { getApiKey } from "./healthStorage";

const OPENAI_API_KEY_PLACEHOLDER = "YOUR_API_KEY_HERE";
const SYSTEM_PROMPT =
  "You are HealthBridge AI, a compassionate public health assistant. Help users understand symptoms, suggest when to seek medical care, and provide wellness advice aligned with SDG 3 (Good Health & Well-being). Always recommend consulting a real doctor for serious conditions.";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function callAI(messages: ChatMessage[]): Promise<string> {
  const key = getApiKey() || OPENAI_API_KEY_PLACEHOLDER;
  if (!key || key === "YOUR_API_KEY_HERE") {
    throw new Error("Please add your OpenAI API key in Settings.");
  }

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "gpt-3.5-turbo",
      messages: [{ role: "system", content: SYSTEM_PROMPT }, ...messages],
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI error: ${res.status} ${t.slice(0, 120)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response.";
}