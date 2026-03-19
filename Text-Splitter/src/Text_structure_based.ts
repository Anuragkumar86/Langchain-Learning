import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";
import fs from "fs"



let text = fs.readFileSync("./random.txt", "utf-8")

const splitter = new RecursiveCharacterTextSplitter({ chunkSize: 100, chunkOverlap: 20 })

async function run(){

    const texts = await splitter.splitText(text)
    console.log(texts.length)
    console.log(texts);
}

run();