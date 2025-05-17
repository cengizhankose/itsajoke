export async function getHarshJoke(): Promise<string> {
  const apiKey = process.env.EXPO_PUBLIC_OPENAI_API_KEY;
  if (!apiKey) throw new Error("OpenAI API key not set");

  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content:
            "Tell me a short, harsh, but funny joke. Keep it under 30 words. No explanations.",
        },
      ],
      max_tokens: 60,
      temperature: 0.9,
    }),
  });

  if (!res.ok) {
    let msg = "OpenAI API error";
    try {
      const err = await res.json();
      msg = err.error?.message || msg;
    } catch {}
    throw new Error(msg);
  }
  const data = await res.json();
  return data.choices?.[0]?.message?.content?.trim() || "No joke found.";
}
