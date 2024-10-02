export interface userDataType {
    id: string,
    name: string,
}

export interface JournalEntryType {
    _id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    status: string;
    analysis?: string;
    embeddings?: number[];
}

export interface EntryAnalysisType {
    _id: string;
    createdAt: string;
    updatedAt: string;
    entryId: JournalEntryType;
    userId: string;
    mood: string;
    subject: string;
    negative: boolean;
    summary: string;
    color: string;
    sentimentScore: number;
}

export interface JournalEntryAnalysisType {
    _id: string;
    userId: string;
    createdAt: string;
    updatedAt: string;
    content: string;
    status: string;
    analysis?: EntryAnalysisType;
}

export interface QaType extends Document {
    question: string;
    answer: string;
    createdAt: Date;
    userId: string;
    formattedDate?: string;
}