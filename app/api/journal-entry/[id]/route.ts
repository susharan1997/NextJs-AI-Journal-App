import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import JournalEntryModel from "@/models/JournalEntry";
import { revalidatePath } from 'next/cache'
import EntryAnalysisModel from "@/models/EntryAnalysis";
import mongoose from 'mongoose';

export async function POST(req: NextRequest, { params }: any) {
    try {
        await dbConnect();

        const userId = await req.json();


        if (!userId || !params.id) {
            return NextResponse.json({ error: `Invalid or missing user Id: ${userId} or journal Id: ${params.id}` }, { status: 400 });
        }

        const journalEntry = await JournalEntryModel.findOne({ userId: userId, _id: params.id }).exec();

        if (!journalEntry) {
            return NextResponse.json({ error: `Invalid journal entry data: ${journalEntry} ${userId} ${params.id}` }, { status: 400 });
        }

        const entryAnalysis = await EntryAnalysisModel.findOne({ entryId: params.id }).populate('entryId').exec();

        if (!entryAnalysis) {
            return NextResponse.json({ error: `Invalid journal entry data: ${entryAnalysis} ${userId} ${params.id}` }, { status: 400 });
        }

        revalidatePath('/journal');

        return NextResponse.json({ journalEntry, entryAnalysis }, { status: 200 });
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


        if (!userId || !journalId || !mongoose.Types.ObjectId.isValid(journalId)) {
            return NextResponse.json({ error: `Invalid or missing user Id: ${userId} or journal Id: ${journalId}` }, { status: 400 });
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

        if (!updateEntry) {
            return NextResponse.json({ error: `Journal entry not found!: ${updateEntry} and userId-> ${userId} and journal content-> ${content} and journal ID-> ${journalId}` }, { status: 404 });
        }

        return NextResponse.json({ data: updateEntry });
    }
    catch (error) {
        console.error(`Error while updating the journal entry: ${error}`);
        return NextResponse.json({ error: `Internal server error: ${error} journalId-> ${params}` }, { status: 500 });
    }
}