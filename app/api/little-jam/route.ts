type ChatMessage = {
  role: "user" | "assistant";
  content: string;
};

const SYSTEM_PROMPT = `You are Little Jam, the playful AI guide on Jamal Ferguson's portfolio.
Help visitors understand Jamal's full-stack and frontend development work, skills, process, and availability.
Sound warm, curious, concise, and lightly witty. Keep answers under 90 words. Never invent facts.
If the supplied portfolio facts do not answer a question, say you are not sure and suggest contacting Jamal.

Portfolio facts:
- Jamal is a full-stack developer in Northern California with strong frontend roots.
- He builds responsive React experiences and works with Next.js, TypeScript, Redux, Tailwind CSS, Firebase, Node.js, Express, and REST APIs.
- Featured work includes Antonio's Pizza, a Netflix streaming clone, a Disney+ experience clone, an X-style social feed, a Google-style search clone, and RUFF Pepper Shrimp.
- His projects include API-driven data, dynamic routes, persistent carts and saved lists, responsive interfaces, loading states, media playback, search, and product flows.
- Visitors can contact Jamal at jamal.ferguson1990@gmail.com or view his GitHub profile at github.com/Miingo954.`;

function isChatMessage(value: unknown): value is ChatMessage {
  if (!value || typeof value !== "object") return false;
  const message = value as Record<string, unknown>;
  return (
    (message.role === "user" || message.role === "assistant") &&
    typeof message.content === "string" &&
    message.content.trim().length > 0 &&
    message.content.length <= 1_000
  );
}

function extractOutputText(payload: unknown) {
  if (!payload || typeof payload !== "object") return "";
  const output = (payload as { output?: unknown }).output;
  if (!Array.isArray(output)) return "";

  return output
    .flatMap((item) => {
      if (!item || typeof item !== "object") return [];
      const content = (item as { content?: unknown }).content;
      return Array.isArray(content) ? content : [];
    })
    .filter(
      (item): item is { type: "output_text"; text: string } =>
        Boolean(
          item &&
            typeof item === "object" &&
            (item as { type?: unknown }).type === "output_text" &&
            typeof (item as { text?: unknown }).text === "string",
        ),
    )
    .map((item) => item.text)
    .join("\n")
    .trim();
}

export async function POST(request: Request) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "Little Jam is still getting connected. Please try again soon." },
      { status: 503 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return Response.json({ error: "That message could not be read." }, { status: 400 });
  }

  const messages =
    body && typeof body === "object" && Array.isArray((body as { messages?: unknown }).messages)
      ? (body as { messages: unknown[] }).messages
      : [];

  if (!messages.length || messages.length > 12 || !messages.every(isChatMessage)) {
    return Response.json({ error: "Please send a valid message." }, { status: 400 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/responses", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: process.env.LITTLE_JAM_MODEL || "gpt-6-luna",
        instructions: SYSTEM_PROMPT,
        input: messages,
        reasoning: { effort: "none" },
        text: { verbosity: "low" },
        max_output_tokens: 220,
      }),
      signal: AbortSignal.timeout(20_000),
    });

    if (!response.ok) {
      console.error("Little Jam API request failed", response.status);
      return Response.json(
        { error: "My thoughts got a little tangled. Please try that again." },
        { status: 502 },
      );
    }

    const reply = extractOutputText(await response.json());
    if (!reply) {
      return Response.json({ error: "I lost my train of thought. Try again?" }, { status: 502 });
    }

    return Response.json({ reply });
  } catch (error) {
    console.error("Little Jam API unavailable", error instanceof Error ? error.name : "unknown");
    return Response.json(
      { error: "I could not connect just now. Please try again in a moment." },
      { status: 502 },
    );
  }
}
