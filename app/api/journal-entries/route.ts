import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import JournalEntryModel from "@/models/JournalEntry";

export async function POST(req: NextRequest, res: NextResponse) {
    try {
        await dbConnect();

        const { userId } = await req.json();

        if (!userId) {
            return NextResponse.json({ error: 'Invalid or missing user Id' }, { status: 400 });
        }

        const journalEntries = await JournalEntryModel.find({ userId }).exec();

        return NextResponse.json({ entries: journalEntries }, { status: 200 });
    }
    catch (error) {
        console.log('Error in API route');
        return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
}