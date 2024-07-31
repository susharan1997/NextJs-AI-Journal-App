import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import JournalEntryModel from "@/models/JournalEntry";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = await req.json();

        if (!userId) {
            return NextResponse.json({ error: `Invalid or missing user Id ${userId}` }, { status: 400 });
        }

        const journalEntries = await JournalEntryModel.find({ userId }).sort({createdAt: -1}).populate('analysis').exec();

        if(!journalEntries){
            return NextResponse.json({error: 'Invalid journal entry data'}, {status: 400});
        }

        return NextResponse.json({ entries: journalEntries }, { status: 200 });
    }
    catch (error) {
        console.log('Error in API route');
        return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
    }
}