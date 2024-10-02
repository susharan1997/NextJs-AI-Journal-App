import { Schema, model, models } from 'mongoose';

export enum JOURNAL_ENTRY_TYPES {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

export interface JournalEntryType extends Document {
    userId: Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    content: string,
    status: JOURNAL_ENTRY_TYPES,
    analysis?: Schema.Types.ObjectId,
    embeddings: number[],
}

const JournalEntrySchema = new Schema<JournalEntryType>({
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    content: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        default: JOURNAL_ENTRY_TYPES.DRAFT,
        enum: Object.values(JOURNAL_ENTRY_TYPES),
    },
    analysis: {
        type: Schema.Types.ObjectId,
        ref: 'EntryAnalysis',
    },
    embeddings: {
        type: [Number],
        default: [],
    }
})

JournalEntrySchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }
    this.updatedAt = new Date();
    next();
});

const JournalEntryModel = models.JournalEntry || model<JournalEntryType>('JournalEntry', JournalEntrySchema);
export default JournalEntryModel;