import { ChatOpenAI } from '@langchain/openai';
import { PromptTemplate } from "@langchain/core/prompts";
import { loadQARefineChain } from "langchain/chains";
import { MemoryVectorStore } from 'langchain/vectorstores/memory';
import { OpenAIEmbeddings } from "@langchain/openai";
import { StructuredOutputParser, OutputFixingParser } from 'langchain/output_parsers';
import { Document } from 'langchain/document';
import { z } from 'zod';
import { JournalEntryType } from '@/types';


const analysisParser = StructuredOutputParser.fromZodSchema(
    z.object({
        mood: z.string()
            .describe('The mood of the person who has written the journal entry'),
        subject: z.string().
            describe('The subject of the journal entry'),
        negative: z.boolean()
            .describe('Does the journal entry contain any negative emotions ?'),
        summary: z.string()
            .describe('Quick summary of the journal entry'),
        color: z.string()
            .describe('A hexadecimal code which represents the mood of the journal entry based on colors.'),
        sentimentScore: z.number()
            .describe('A score rated between -10 to +10 (where -10 is extreme -ve, 0 is neutral & +10 is extreme +ve)'),
    })
)

const getPrompt = async (content: string) => {
    const formatInstructions = analysisParser.getFormatInstructions();
    const prompt = new PromptTemplate({
        template: 'Analyze the following journal entry. Follow the instrictions and format your response to match the format instructions, no matter what! \n{formatInstructions}\n{entry}',
        inputVariables: ['entry'],
        partialVariables: { formatInstructions },
    });

    const input = await prompt.format({
        entry: content
    });

    return input;
}

export const analyzeJournalEntry = async (journal: JournalEntryType) => {
    const input = await getPrompt(journal.content);
    const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });

    try {
        const output = await model.invoke(input);
        const responseText = typeof output === 'string' ? output : output.content || '';

        try {
            return analysisParser.parse(responseText as string);
        }
        catch (e) {
            const fixedOutput = OutputFixingParser.fromLLM(
                new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' }),
                analysisParser,
            )
            const aiAnalyzedOutput = await fixedOutput.parse(responseText as string);
            return aiAnalyzedOutput;
        }
    }
    catch (error) {
        console.error('Error analyzing journal entry:', error);
        throw error;
    }
}

const refinedPrompt = `
You are an AI assistant that helps answer questions based on a user's journal entries. These entries may contain reflections, thoughts, and experiences. 
Please consider the context of all entries provided and answer the question as thoroughly as possible. 

Here are some relevant journal entries:
{relevantEntries}

Question: {question}

Answer:
`;

export const qa = async (journals: JournalEntryType[], question: string) => {
    const docs = journals.map((journal: JournalEntryType) => ({
        document: new Document({
            pageContent: journal.content,
            metadata: {
                source: journal._id,
                date: journal.createdAt,
            },
        }),
        embeddings: journal.embeddings,
    }));

    const model = new ChatOpenAI({ temperature: 0, modelName: 'gpt-3.5-turbo' });
    const chain = loadQARefineChain(model);
    // const store = await MemoryVectorStore.fromDocuments(docs, embeddings);
    const embeddings = new OpenAIEmbeddings();
    const store = new MemoryVectorStore(embeddings);

    docs.forEach(doc => store.addVectors([doc.embeddings!], [doc.document]));

    const relevantDocs = await store.similaritySearch(question, 10);
    const batchSize = 6;
    let refinedAnswer = '';

    for (let i = 0; i < relevantDocs.length; i += batchSize) {
        const batch = relevantDocs.slice(i, i + batchSize);
        const relevantEntries = relevantDocs.map(doc => doc.pageContent).join("\n\n");
        const result = await chain.invoke({
            input_documents: batch,
            question: refinedAnswer
                ? `${refinedAnswer}\nAdditional context:\n${relevantEntries}`
                : refinedPrompt.replace("{relevantEntries}", relevantEntries).replace("{question}", question),
        });
        refinedAnswer = result.output_text; 
    }

    return refinedAnswer;
}
