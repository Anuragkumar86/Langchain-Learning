import "dotenv/config";
import { runAgent } from "./agent.js";

const result = await runAgent(
  "Find the capital of Madhya Pradesh and its current weather"
);

console.log("\n✅ FINAL ANSWER:\n");
console.log(result);