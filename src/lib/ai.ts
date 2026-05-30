import { getApiKey } from "./healthStorage";

const GROQ_API_KEY_PLACEHOLDER = "YOUR_API_KEY_HERE";
const SYSTEM_PROMPT =
  "You are HealthBridge AI, a compassionate public health assistant. Help users understand symptoms, suggest when to seek medical care, and provide wellness advice aligned with SDG 3 (Good Health & Well-being). Always recommend consulting a real doctor for serious conditions.";

export interface ChatMessage {
  role: "user" | "assistant" | "system";
  content: string;
}

export async function callAI(messages: ChatMessage[]): Promise<string> {
  const key = getApiKey() || GROQ_API_KEY_PLACEHOLDER;
  if (!key || key === "YOUR_API_KEY_HERE") {
    throw new Error("Please add your Groq API key in Settings.");
  }

  const res = await fetch("https://api.groq.com/openai/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${key}`,
    },
    body: JSON.stringify({
      model: "llama3-8b-8192",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...messages.filter((m) => m.role !== "system"),
      ],
    }),
  });

  if (!res.ok) {
    const t = await res.text();
    throw new Error(`AI error: ${res.status} ${t.slice(0, 160)}`);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content || "No response.";
}