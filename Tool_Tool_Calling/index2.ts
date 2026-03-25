import "dotenv/config";
import axios from "axios";
import { z } from "zod";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { DuckDuckGoSearch } from "@langchain/community/tools/duckduckgo_search";

import { createToolCallingAgent } from "langchain/agents";
import { AgentExecutor } from "langchain/agents";

// 🔍 Search Tool
const searchTool = new DuckDuckGoSearch({
  maxResults: 1,
});

// 🌦️ Weather Tool (NEW STRUCTURED TOOL)
const weatherTool = new DynamicStructuredTool({
  name: "get_weather_data",
  description: "Get current weather for a city",
  schema: z.object({
    city: z.string(),
  }),
  func: async ({ city }) => {
    const url = `https://api.weatherstack.com/current?access_key=${process.env.WEATHER_API_KEY}&query=${city}`;
    const response = await axios.get(url);
    return JSON.stringify(response.data);
  },
});

// 🤖 Gemini LLM
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash", // safer choice
  apiKey: process.env.GOOGLE_API_KEY,
});

// 🧠 Create Agent (NEW WAY)
const agent = await createToolCallingAgent({
  llm,
  tools: [searchTool, weatherTool],
});

// ⚙️ Executor
const agentExecutor = new AgentExecutor({
  agent,
  tools: [searchTool, weatherTool],
  verbose: true,
});

// 🚀 Run
const result = await agentExecutor.invoke({
  input: "Find the capital of Madhya Pradesh and its current weather",
});

console.log(result);