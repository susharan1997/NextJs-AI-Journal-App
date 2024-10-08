import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import JournalEntryModel from "@/models/JournalEntry";
import { qa } from "@/utils/ai";
import QuestionModel from '../../../models/Question';
import pinecone from '@/lib/pineconeClient';
import { OpenAIEmbeddings } from "@langchain/openai";

export async function POST(req: NextRequest) {
    try {
        dbConnect();

        const { question, userId } = await req.json();

        if (!question) {
            return NextResponse.json({ error: 'Invalid question' }, { status: 400 });
        }
        if (!userId) {
            return NextResponse.json({ error: 'Invalid User ID' }, { status: 400 });
        }

        const openAiEmbeddings = new OpenAIEmbeddings();
        const questionEmbeddings = await openAiEmbeddings.embedQuery(question);

        const index = pinecone.index('mindscribe-journal');


        const result = await index.query({
            vector: questionEmbeddings,
            topK: 2,
            includeValues: false,
        });

        const journalIds = result.matches.map(journal => journal.id);

        if (!journalIds || journalIds.length === 0) {
            return NextResponse.json({ error: 'Invalid journal IDs' }, { status: 404 });
        }

        const journalEntries = await JournalEntryModel.find({ _id: { $in: journalIds }, userId }).select('content createdAt embeddings');


        if (!journalEntries) {
            return NextResponse.json({ error: 'Journal Entry not found!' }, { status: 400 });
        }

        const aiSolution = await qa(journalEntries, question);

        const newQuestion = new QuestionModel({
            question: question,
            answer: aiSolution,
            userId: userId,
        });

        await newQuestion.save();

        return NextResponse.json({ data: aiSolution }, { status: 200 });
    }
    catch (error) {
        return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
    }
}