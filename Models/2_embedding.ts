import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai"

import cosineSimilarity from "compute-cosine-similarity"
import dotenv from "dotenv"

dotenv.config();

const embeddings = new GoogleGenerativeAIEmbeddings({
    model: "gemini-embedding-001",
})

const documents = [
    "Virat Kohli is an Indian cricketer known for his aggressive batting and leadership.",
    "MS Dhoni is a former Indian captain famous for his calm demeanor and finishing skills.",
    "Sachin Tendulkar, also known as the God of Cricket, holds many batting records.",
    "Rohit Sharma is known for his elegant batting and record-breaking double centuries.",
    "Jasprit Bumrah is an Indian fast bowler known for his unorthodox action and yorkers."
];

async function run() {
    const docEmbedding = await embeddings.embedDocuments(documents)

    const query = "Tell me about Dhoni and Kohli.";

    const queryEmbedding = await embeddings.embedQuery(query);

    const scores = docEmbedding.map((embed) =>
        cosineSimilarity(queryEmbedding, embed)
    )

    
    // const maxIndex = scores.indexOf(Math.max(...scores))

    console.log(query);
    // console.log(documents[maxIndex]);
    // console.log("Similarity score:", scores[maxIndex]);
    console.log(scores);

    const result = documents.map((doc, i) => ({
        document: doc,
        score: scores[i]
    }))
    .filter((s) => s.score! > 0.7)
    .sort((a, b) => b.score! - a.score!)
    .slice(0, 2)

    for(const r of result){
        console.log("\n", r.document)
        console.log("Score: ", r.score)
    }
}

run();