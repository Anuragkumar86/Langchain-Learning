import dotenv from "dotenv"
import { ChatGoogle } from "@langchain/google";

dotenv.config();

const model = new ChatGoogle("gemini-2.5-flash");

const main = async() => {

    const res = await model.invoke("What is the capital of mumbai.");

    console.log(res.content);
}

main();