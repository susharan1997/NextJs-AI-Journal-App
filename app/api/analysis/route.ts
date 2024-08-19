import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import EntryAnalysisModel from "@/models/EntryAnalysis";

export async function POST(req: NextRequest) {
    try {
        await dbConnect();

        const userId = await req.json();

        if (!userId) {
            return NextResponse.json({ error: `Invalid or missing user Id ${userId}` }, { status: 400 });
        }

        const journalAnalysis = await EntryAnalysisModel.find({ userId }).sort({createdAt: 'asc'}).exec();

        if(!journalAnalysis){
            return NextResponse.json({error: 'Invalid Journal analysis data'}, {status: 400});
        }

        const total = journalAnalysis.reduce((acc, current) => acc + current.sentimentScore, 0);
        const average = journalAnalysis.length > 0 ? (total / journalAnalysis.length).toFixed(2) : 0;

        return NextResponse.json({ journalAnalysis, average }, { status: 200 });
    }
    catch (error) {
        console.log('Error in API route');
        return NextResponse.json({ error: `Internal server error: ${error}` }, { status: 500 });
    }
}