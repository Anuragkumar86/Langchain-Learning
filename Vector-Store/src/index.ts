import { HuggingFaceInferenceEmbeddings } from "@langchain/community/embeddings/hf";

import { Chroma } from "@langchain/community/vectorstores/chroma";
import dotenv from "dotenv";

dotenv.config();

const embeddings = new HuggingFaceInferenceEmbeddings({
  apiKey: process.env.HUGGINGFACEHUB_API_KEY,
  model: "sentence-transformers/all-MiniLM-L6-v2",
});


const vectorStore = await Chroma.fromExistingCollection(
  embeddings,
  {
    collectionName: "my-ai-docs",
    url: "http://localhost:8000",
  }
);
// -----------------------------------------------------------------------
// Addiong Data into our document 

// await vectorStore.addDocuments([
//     {
//         id: "virat-1",
//         pageContent: "Virat kohli is very aggressive cricketer. He is know as king of Cricket",
//         metadata: {source: "cricket-fact", category: "cricket"}
//     }
// ])
// await vectorStore.addDocuments([
//     {
//         id: "dhoni-1",
//         pageContent: "Ms Dhoni is very cool cricketer. He is know as queen of Cricket",
//         metadata: {source: "cricket-fact", category: "cricket"}
//     }
// ])

// await vectorStore.addDocuments([
//     {
//         id: "cat-1",
//         pageContent: "Cat is animal who eat meat and roti aslo.",
//         metadata: {source: "animal-fact", category: "animal"}
//     }
// ])

// ---------------------------------------------------------------

// Upsert or Insert 
// await vectorStore.addDocuments([
//   {
//     id: "dhoni-1",
//     pageContent: "Ms Dhoni is very coolest cricketer in the world. He is know as Master of Cricket",
//     metadata: { topic: "cricketer" },
//   },
// ]);

// ---------------------------------------------------------------


const results = await vectorStore.similaritySearch("Who is the cool man of cricket", 2);



console.log(results.length);

results.forEach(element => {
    console.log(element);
});



// results.forEach( async (element) => {
//   await vectorStore.delete({
//     ids: [element.id as string]
//   });
// });




