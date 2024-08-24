import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import JournalEntryModel from "@/models/JournalEntry";
import { qa } from "@/utils/ai";
import QuestionModel from '../../../models/Question';

export async function POST(req: NextRequest){
    try{
        dbConnect();

        const {question, userId} = await req.json();

        if(!question){
            return NextResponse.json({error: 'Invalid question'}, {status: 400});
        }
        if(!userId){
            return NextResponse.json({error: 'Invalid User ID'}, {status: 400});
        }
        
        const journalEntries = await JournalEntryModel.find({userId: userId}).select('content createdAt');

        if(!journalEntries){
            return NextResponse.json({error: 'Journal Entry not found!'}, {status: 400});
        }

        const aiSolution = await qa(journalEntries, question);

        const newQuestion = new QuestionModel({
            question: question,
            answer: aiSolution,
            userId: userId,
        });

        await newQuestion.save();

        return NextResponse.json({ data: aiSolution }, {status: 200});
    }
    catch(error){
        return NextResponse.json({error: `Internal server error: ${error}`}, {status: 500});
    }
}