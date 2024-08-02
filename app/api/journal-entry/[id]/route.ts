import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongoose";
import JournalEntryModel from "@/models/JournalEntry";
import { revalidatePath } from 'next/cache'

export async function POST(req: NextRequest, { params }: any) {
    try {
        await dbConnect();

        const userId = await req.json();


        if (!userId || !params) {
            return NextResponse.json({ error: `Invalid or missing user Id: ${userId} or journal Id: ${params}` }, { status: 400 });
        }

        const journalEntry = await JournalEntryModel.findOne({ userId: userId, _id: params }).exec();

        if (!journalEntry) {
            return NextResponse.json({ error: `Invalid journal entry data: ${journalEntry}` }, { status: 400 });
        }

        revalidatePath('/journal');

        return NextResponse.json({ entry: journalEntry }, { status: 200 });
    }
    catch (error) {
        console.log('Error in API route');
        return NextResponse.json({ error: `Internal server error: ${error} JOURNAL ENTRY` }, { status: 500 });
    }
}

// export async function PATCH(req: NextRequest, {params}: any){
//     await dbConnect();

//     const {content, userId} = await req.json();


//     if(!userId || params){
//         return NextResponse.json({ error: `Invalid or missing user Id: ${userId} or journal Id: ${params.id}` }, { status: 400 });
//     }
// }