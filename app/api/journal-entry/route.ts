import JournalEntryModel from "@/models/JournalEntry";
import EntryAnalysisModel from "@/models/EntryAnalysis";
import UserModel from "@/models/User";
import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";

export async function POST(req: NextRequest){
    try {
        await dbConnect();

        const { content, userId } = await req.json();
        
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return NextResponse.json({ error: `Invalid user ID! ${userId}` }, { status: 400 });
        }

        const user = await UserModel.findById(userId);
        
        if (!user) {
            return NextResponse.json({ error: `User not found! ${user}` }, { status: 404 });
        }

        const newJournalEntry = await JournalEntryModel.create({
            content: content,
            userId: user._id,
            status: 'DRAFT',
        });

        const newEntryAnalysis = await EntryAnalysisModel.create({
            mood: 'Neutral',
            subject: 'None',
            negative: false,
            summary: 'Summary',
            sentimentScore: 0,
            color: '#0101fe',
            userId: user._id,
            entryId: newJournalEntry._id,
        });

        newJournalEntry.analysis = newEntryAnalysis._id;
        await newJournalEntry.save();

        user.entries.push(newJournalEntry._id);
        await user.save();
        revalidatePath('/journal');

        return NextResponse.json({ data: newJournalEntry }, { status: 200 });
    }
    catch (error) {
        console.log('Error during Journal entry creation!', error);
        return NextResponse.json({ error: `Internal server error ${error}` }, { status: 500 });
    }
}