import JournalEntryModel from "@/models/JournalEntry";

export const journalEntries = async (userId: any) => {

    if(!userId){
        throw new Error('Invalid user ID!');
    }

    const journalEntries = await JournalEntryModel.find({userId})
    .sort({createdAt: -1})
    .populate('analysis')
    .exec();

    return journalEntries ?? [];
}