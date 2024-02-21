import { OpenAI } from "@langchain/openai";
import { RetrievalQAChain } from "langchain/chains";
import { PDFLoader } from "langchain/document_loaders/fs/pdf";
import { OpenAIEmbeddings } from "@langchain/openai";
import { MemoryVectorStore } from "langchain/vectorstores/memory";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import * as dotenv from "dotenv";

dotenv.config();
export const procesarArchivo = async (filename, question) => {
    
    try {


        const loader = new PDFLoader(`./uploads/${filename}`, {
            //splitPages: false
        });

        const doc = await loader.load();

        //splitter function
        const splitter = new RecursiveCharacterTextSplitter({
            chunkSize: 1000,
            chunkOverlap: 20,
        });

        //created chunks form pdf
        const splitterDoc = await splitter.splitDocuments(doc);

        const embeddings = new OpenAIEmbeddings({
            //se puede mandar vacio para que haga con datos por default o sino se manda el modelo
            /*  openAIApiKey: "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"
               batchSize: 512, // Default value if omitted is 512. Max is 2048
              modelName: "text-embedding-3-large", */
        });


        const vectorStore = await MemoryVectorStore.fromDocuments(
            splitterDoc,
            embeddings
        );

        // Initialize a retriever wrapper around the vector store
        const vectorStoreRetriever = vectorStore.asRetriever();

        //CREAMOS LA CONEXION CON LA API DE OPENAI PARA LLM
        const model = new OpenAI({
            modelName: "gpt-3.5-turbo-instruct", // Defaults to "gpt-3.5-turbo-instruct" if no model provided.
            /* temperature: 0.9,
            openAIApiKey: "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", // In Node.js defaults to process.env.OPENAI_API_KEY */
        });

        // Create a chain that uses the OpenAI LLM and HNSWLib vector store.
        const chain = RetrievalQAChain.fromLLM(model, vectorStoreRetriever);
        const respuesta = await chain._call({
            query: question, //MANDAMOS LA PREGUNTA QUE ENVIA EL USUARIO
        });

        console.log(respuesta)
        return respuesta

    } catch (error) {
        console.error("Ocurrió un error:", error);
        return "Ocurrió un error al procesar el documento.";
    }
}