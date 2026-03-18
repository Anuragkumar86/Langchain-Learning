import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import dotenv from "dotenv"
import { StringOutputParser } from "@langchain/core/output_parsers"

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite"
})

const parser = new StringOutputParser()
const prompt = PromptTemplate.fromTemplate("Generate 5 interesting facts about {topic}")

const chain = prompt.pipe(model).pipe(parser);

const result = await chain.invoke({
    topic: "cricket"
})

console.log(result);