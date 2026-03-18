import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
import { PromptTemplate } from "@langchain/core/prompts"
import { StringOutputParser } from "@langchain/core/output_parsers"
import { RunnableBranch, RunnableLambda, RunnableParallel } from "@langchain/core/runnables"
import dotenv from "dotenv"

dotenv.config()

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.5-flash-lite"
})

const parser = new StringOutputParser()

const classifyPrompt = PromptTemplate.fromTemplate(
  "Classify the sentiment of the following feedback text into positive or negative \n {feedback}"
)

const positivePrompt = PromptTemplate.fromTemplate(
  "Write an appropriate response to this positive feedback \n {feedback}"
)

const negativePrompt = PromptTemplate.fromTemplate(
  "Write an appropriate response to this negative feedback \n {feedback}"
)

const classifyChain = classifyPrompt.pipe(model).pipe(parser)

const prepareData = RunnableParallel.from({
  sentiment: classifyChain,
  feedback: (input: { feedback: string }) => input.feedback
})

const branchChain = RunnableBranch.from([
  [
    (x: any) => x.sentiment.toLowerCase().includes("positive"),
    positivePrompt.pipe(model).pipe(parser)
  ],
  [
    (x: any) => x.sentiment.toLowerCase().includes("negative"),
    negativePrompt.pipe(model).pipe(parser)
  ],
  RunnableLambda.from(() => "Could not detect sentiment")
])

const chain = prepareData.pipe(branchChain)

const result = await chain.invoke({
  feedback: "This samsung phone is terrible. Its is poor and it get heated"
})

console.log(result)