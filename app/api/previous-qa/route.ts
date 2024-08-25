import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";

import QuestionModel from '../../../models/Question';

export async function POST(req: NextRequest){
    try{
        dbConnect();

        const { userId } = await req.json();

        if(!userId){
            return NextResponse.json({error: `Invalid user Id: ${userId}`}, {status: 400});
        }
        
        const previousQuestionAnswers = await QuestionModel.find({userId: userId}).select('question answer createdAt');

        if(!previousQuestionAnswers){
            return NextResponse.json({error: 'Previous questions not found!'}, {status: 400});
        }

        return NextResponse.json({ data: previousQuestionAnswers }, {status: 200});
    }
    catch(error){
        return NextResponse.json({error: 'Internal server error'}, {status: 500});
    }
}