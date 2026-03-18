import "dotenv/config";
import { DirectoryLoader } from "@langchain/classic/document_loaders/fs/directory";
import { PDFLoader } from "@langchain/community/document_loaders/fs/pdf";

// 1. Create directory loader
const loader = new DirectoryLoader("./books", {
  ".pdf": (path: string) => new PDFLoader(path),
});

// 2. Load documents
async function loadDocs() {
  const docs = await loader.load();

  console.log("Total documents:", docs.length);

  // preview one document
  console.log(docs);
}

loadDocs();