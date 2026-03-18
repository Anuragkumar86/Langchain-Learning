import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf"
import { ChatGoogleGenerativeAI } from "@langchain/google-genai"
const loader = new PDFLoader("./Anurag_Resume_0.pdf")
import dotenv from "dotenv"
import { StringOutputParser } from "@langchain/core/output_parsers"
dotenv.config();
import { PromptTemplate } from "@langchain/core/prompts"

const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.5-flash-lite"
})

const parser = new StringOutputParser


const prompt = PromptTemplate.fromTemplate("What all certification Anurag has done? \n {document}")

const docs = await loader.load();

console.log(docs.length);
// console.log(docs[0].id);
// console.log(docs[0].metadata);
// console.log(docs[0].pageContent);

const chain = prompt.pipe(model).pipe(parser);

const result = await chain.invoke({
    document: docs[0].pageContent
})

console.log(result);