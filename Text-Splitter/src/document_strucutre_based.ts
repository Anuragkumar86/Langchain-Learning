import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

const markdownText = `
# 🦜️🔗 LangChain

⚡ Building applications with LLMs through composability ⚡

## What is LangChain?

# Hopefully this code block isn't split
LangChain is a framework for...

As an open-source project in a rapidly developing field, we are extremely open to contributions.
`;

const mdSplitter = RecursiveCharacterTextSplitter.fromLanguage(
    "markdown",
    { chunkSize: 60, chunkOverlap: 0 }
);

async function run(){

    const mdDocs = await mdSplitter.createDocuments([ markdownText ]);
    console.log(mdDocs);
}

run();