import "dotenv/config";
import axios from "axios";
import { z } from "zod";

import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { DynamicStructuredTool } from "@langchain/core/tools";
import { ChatPromptTemplate } from "@langchain/core/prompts";

import { AgentExecutor, createToolCallingAgent } from "@langchain/classic/agents";

// 🔍 Knowledge Base Tool
const knowledgeTool = new DynamicStructuredTool({
  name: "get_information",
  description: "Get information about cities and their capitals",
  schema: z.object({
    query: z.string().describe("The query about a city or capital"),
  }),
  func: async ({ query }) => {
    const knowledge: Record<string, string> = {
      "madhya pradesh": "Bhopal",
      "patna": "Patna is the capital of Bihar state in India",
      "delhi": "New Delhi",
      "maharashtra": "Mumbai",
      "karnataka": "Bangalore",
      "tamil nadu": "Chennai",
      "west bengal": "Kolkata",
      "uttar pradesh": "Lucknow",
      "rajasthan": "Jaipur",
      "bihar": "Patna",
    };

    const lowerQuery = query.toLowerCase();
    for (const [key, value] of Object.entries(knowledge)) {
      if (lowerQuery.includes(key)) {
        return value;
      }
    }
    return `Information about "${query}" not found in knowledge base`;
  },
});

// 🌦️ Weather Tool - Using Open-Meteo (Free, no API key needed)
const weatherTool = new DynamicStructuredTool({
  name: "get_weather_data",
  description: "Get current weather for a city",
  schema: z.object({
    city: z.string().describe("The name of the city to get weather for"),
  }),
  func: async ({ city }) => {
    try {
      // First, get the coordinates of the city using geocoding
      const geoResponse = await axios.get(
        `https://geocoding-api.open-meteo.com/v1/search?name=${city}&count=1&language=en&format=json`
      );

      if (!geoResponse.data.results || geoResponse.data.results.length === 0) {
        return JSON.stringify({
          error: `City "${city}" not found`,
        });
      }

      const location = geoResponse.data.results[0];
      const { latitude, longitude, name, country } = location;

      // Get weather data
      const weatherResponse = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m,weather_code,wind_speed_10m&temperature_unit=celsius`
      );

      const current = weatherResponse.data.current;
      
      // Weather code interpretation
      const weatherCodes: Record<number, string> = {
        0: "Clear sky",
        1: "Mainly clear",
        2: "Partly cloudy",
        3: "Overcast",
        45: "Foggy",
        48: "Foggy",
        51: "Light drizzle",
        53: "Moderate drizzle",
        55: "Dense drizzle",
        61: "Slight rain",
        63: "Moderate rain",
        65: "Heavy rain",
        71: "Slight snow",
        73: "Moderate snow",
        75: "Heavy snow",
        80: "Slight rain showers",
        81: "Moderate rain showers",
        82: "Violent rain showers",
        85: "Slight snow showers",
        86: "Heavy snow showers",
        95: "Thunderstorm",
        96: "Thunderstorm with slight hail",
        99: "Thunderstorm with heavy hail",
      };

      const weatherDescription = weatherCodes[current.weather_code] || "Unknown";

      return JSON.stringify({
        city: `${name}, ${country}`,
        temperature: `${current.temperature_2m}°C`,
        weather: weatherDescription,
        humidity: `${current.relative_humidity_2m}%`,
        wind_speed: `${current.wind_speed_10m} km/h`,
      });
    } catch (error) {
      return JSON.stringify({
        error: `Failed to get weather for ${city}`,
        details: error instanceof Error ? error.message : "Unknown error",
      });
    }
  },
});

// 📝 Create Prompt Template
const prompt = ChatPromptTemplate.fromMessages([
  ["system", "You are a helpful assistant that can provide information about cities and get weather data. Use the get_information tool to find capital cities, then use get_weather_data to fetch weather information."],
  ["placeholder", "{chat_history}"],
  ["human", "{input}"],
  ["placeholder", "{agent_scratchpad}"],
]);

// 🤖 Google Gemini LLM Configuration
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash",
  temperature: 0.7,
  apiKey: process.env.GOOGLE_API_KEY,
});

// 🧠 Create Agent
const agent = await createToolCallingAgent({
  llm,
  tools: [knowledgeTool, weatherTool],
  prompt,
});

// ⚙️ Executor
const agentExecutor = new AgentExecutor({
  agent,
  tools: [knowledgeTool, weatherTool],
  verbose: true,
  maxIterations: 10,
});

// 🚀 Main Function
async function main() {
  try {
    console.log("🤖 Starting agent...\n");
    
    const result = await agentExecutor.invoke({
      input: "Find the capital of Madhya Pradesh and its current weather",
    });

    console.log("\n✅ Agent Result:");
    console.log(result.output);
  } catch (error) {
    console.error("❌ Error:", error);
    process.exit(1);
  }
}

main().catch(console.error);