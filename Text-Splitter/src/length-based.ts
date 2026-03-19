import { TokenTextSplitter } from "@langchain/textsplitters";



import fs from "fs"



let text = fs.readFileSync("./random.txt", "utf-8")

const splitter = new TokenTextSplitter({ encodingName: "cl100k_base", chunkSize: 100, chunkOverlap: 0 })

async function run(){

    const texts = await splitter.splitText(text)
    console.log(texts.length)
    console.log(texts);
}

run();