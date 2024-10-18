import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import JournalEntryModel from "@/models/JournalEntry";
import { revalidatePath } from 'next/cache'
import EntryAnalysisModel from "@/models/EntryAnalysis";
import mongoose from 'mongoose';
import { analyzeJournalEntry } from '../../../../utils/ai';
import UserModel from '@/models/User';
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import pinecone from '@/lib/pineconeClient';

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const userId = await req.json();


        if (!userId || !params.id) {
            return NextResponse.json({ error: `Invalid or missing user Id: ${userId} or journal Id: ${params.id}` }, { status: 400 });
        }

        const entryAnalysis = await EntryAnalysisModel.findOne({ entryId: params.id }).populate('entryId').exec();

        if (!entryAnalysis) {
            return NextResponse.json({ error: `Invalid journal entry data: ${entryAnalysis} ${userId} ${params.id}` }, { status: 400 });
        }

        revalidatePath('/journal');

        return NextResponse.json({ entryAnalysis }, { status: 200 });
    }
    catch (error) {
        console.log('Error in API route');
        return NextResponse.json({ error: `Internal server error: ${error} JOURNAL ENTRY` }, { status: 500 });
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const { content, userId } = await req.json();
        const journalId = params.id;

        let journalIdErrorMsg = `Invalid or missing user Id: ${userId} or journal Id: ${journalId}`;

        if (!userId || !journalId || !mongoose.Types.ObjectId.isValid(journalId)) {
            return NextResponse.json({ error: journalIdErrorMsg }, { status: 400 });
        }

        const summarizationModel = new ChatOpenAI({temperature: 0, modelName: 'gpt-3.5-turbo'});
        const summaryPrompt = `Summarize the following journal entry while retaining key information: "${content}"`;
        const summaryResult = await summarizationModel.invoke(summaryPrompt);

        if (!summaryResult || !summaryResult.content) {
            console.error('Error: No valid summary generated.');
            return NextResponse.json({ error: 'Failed to generate summary.' }, { status: 500 });
        }

        const summarizedContent = summaryResult.content.toString().trim();

        if(!summarizedContent || summarizedContent === ''){
            console.log('No valid content received');
        }

        const updateEntry = await JournalEntryModel.findOneAndUpdate(
            {
                _id: journalId,
                userId: userId
            },
            { content },
            {
                new: true,
                runValidators: true
            }
        );

        let updateEntryErrorMsg = `Journal entry not found!: ${updateEntry} and userId-> ${userId} and journal 
        content-> ${content} and journal ID-> ${journalId}`;

        if (!updateEntry) {
            return NextResponse.json({ error: updateEntryErrorMsg }, { status: 404 });
        }

        const openAiEmbeddings = new OpenAIEmbeddings();
        const updatedEmbeddings = await openAiEmbeddings.embedQuery(summarizedContent);
        updateEntry.embeddings = updatedEmbeddings;

        const index = pinecone.index('mindscribe-journal');
        await index.upsert(
            [
                {
                    id: journalId.toString(),
                    values: updatedEmbeddings
                }
            ]
        );

        await updateEntry.save();

        const journalEntryAnalysis = await analyzeJournalEntry(updateEntry);

        const analyzedJournalEntry = await EntryAnalysisModel.findOneAndUpdate(
            { entryId: journalId },
            { ...journalEntryAnalysis, userId: userId },
            {
                new: true,
                upsert: true,
                runValidators: true,
            }
        );

        let journalEntryErrorMsg = `Journal entry analysis from the AI model not updated!: ${analyzedJournalEntry} and 
        userId-> ${userId} and journal content-> ${content} and journal ID-> ${journalId}`;

        if (!analyzedJournalEntry) {
            return NextResponse.json({ error: journalEntryErrorMsg }, { status: 404 });
        }

        return NextResponse.json({ data: { ...updateEntry, analysis: analyzedJournalEntry } });
    }
    catch (error) {
        console.error(`Error while updating the journal entry: ${error}`);
        return NextResponse.json({ error: `Internal server error: ${error} journalId-> ${params.id}` }, { status: 500 });
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect();

        const { userId } = await req.json();
        const journalId = params.id;

        if (!userId || !journalId) {
            return NextResponse.json({ error: `Invalid userId: ${userId} or journalId: ${journalId}` }, { status: 400 });
        }

        const deleteEntry = await JournalEntryModel.findOneAndDelete({
            _id: journalId,
            userId: userId,
        });

        if (!deleteEntry) {
            return NextResponse.json({ error: `Cannot find the journal entry to delete: ${deleteEntry}` }, { status: 404 });
        }

        if (deleteEntry.analysis) {
            await EntryAnalysisModel.findByIdAndDelete(deleteEntry.analysis);
        }

        await UserModel.findByIdAndUpdate(userId, {
            $pull: { entries: journalId, analysis: deleteEntry.analysis }
        })

        revalidatePath('/journal');
        return NextResponse.json({ data: { id: params.id } });

    }
    catch (error) {
        console.error(`Error while deleting the journal entry: ${error}`);
        return NextResponse.json({ error: `Internal server error` }, { status: 500 });
    }
}