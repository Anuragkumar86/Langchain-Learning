import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import dotenv from "dotenv"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableLambda } from "@langchain/core/runnables";

dotenv.config();

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite"
})

const parser = new StringOutputParser()

const prompt1 = PromptTemplate.fromTemplate("Generate a report on the topic: {topic}")
const prompt2 = PromptTemplate.fromTemplate("Generate 5 interesting points from \n {topic}")


const chain = prompt1
  .pipe(model)
  .pipe(parser)
  .pipe(
    RunnableLambda.from((output) => {
        console.log("GENERATED REPORT: \n" )
        console.log(output)

        return { topic : output}
    })
  )
  .pipe(prompt2)
  .pipe(model)
  .pipe(parser)

const result = await chain.invoke({
    topic: "Bollywood"
})

console.log(result);


