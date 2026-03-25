import { client } from "./llm.js";
import { getWeather } from "./tools/weather.js";
import { search } from "./tools/search.js";

const SYSTEM_PROMPT = `
You are a smart AI agent.

You MUST follow these rules:
- ONLY output valid JSON
- NO extra text
- NO explanations
- NO markdown
- NO backticks
- ALWAYS complete ALL parts of the task
- NEVER stop early

Tools:
1. search(query)
2. getWeather(city)

Format:

{
  "action": "search",
  "input": "..."
}

OR

{
  "action": "getWeather",
  "input": "..."
}

OR

{
  "action": "final",
  "output": "complete answer"
}
`;

async function callLLM(messages: any[]) {
  const res = await client.chat.completions.create({
    model: "openai/gpt-4o-mini",
    response_format: { type: "json_object" },
    messages,
  });

  return res.choices[0]!.message.content!;
}

// 🔥 Robust JSON extractor
function extractJSON(text: string) {
  try {
    return JSON.parse(text);
  } catch {
    const match = text.match(/\{[\s\S]*\}/);
    if (match) {
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
  }
  return null;
}

export async function runAgent(query: string) {
  const originalQuery = query;

  let messages: any[] = [
    { role: "system", content: SYSTEM_PROMPT },
    { role: "user", content: query },
  ];

  for (let i = 0; i < 6; i++) {
    const response = await callLLM(messages);

    console.log("\n🧠 LLM RAW RESPONSE:\n", response);

    const parsed = extractJSON(response);

    console.log("\n📦 PARSED JSON:\n", parsed);

    if (!parsed) {
      return "❌ Failed to parse LLM response:\n" + response;
    }

    // ✅ FINAL ANSWER (with enforcement)
    if (parsed.action === "final") {
      // 🔥 enforce multi-step completion
      if (
        originalQuery.toLowerCase().includes("weather") &&
        !parsed.output.toLowerCase().includes("weather")
      ) {
        messages.push({
          role: "assistant",
          content: response,
        });

        messages.push({
          role: "user",
          content: `
Original task:
${originalQuery}

You have NOT completed the full task.

You must also provide weather information.

Continue solving.
`,
        });

        continue;
      }

      return parsed.output;
    }

    // 🔍 SEARCH TOOL
    if (parsed.action === "search") {
      const result = await search(parsed.input);

      messages.push({
        role: "assistant",
        content: response,
      });

      messages.push({
        role: "user",
        content: `
Original task:
${originalQuery}

Search result:
${result}

Have you completed ALL parts of the task?
If not, continue.
`,
      });

      continue;
    }

    // 🌦️ WEATHER TOOL
    if (parsed.action === "getWeather") {
      const result = await getWeather(parsed.input);

      messages.push({
        role: "assistant",
        content: response,
      });

      messages.push({
        role: "user",
        content: `
Original task:
${originalQuery}

Weather result:
${JSON.stringify(result)}

Continue until ALL parts are completed.
`,
      });

      continue;
    }

    // ❌ Unknown action fallback
    return "❌ Unknown action from LLM";
  }

  return "❌ Max iterations reached";
}