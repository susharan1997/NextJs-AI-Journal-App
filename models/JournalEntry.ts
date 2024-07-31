import { Schema, model, models } from 'mongoose';
import EntryAnalysisModel from './EntryAnalysis';

export enum JOURNAL_ENTRY_TYPES {
    DRAFT = 'DRAFT',
    PUBLISHED = 'PUBLISHED',
    ARCHIVED = 'ARCHIVED',
}

interface JournalEntryType extends Document {
    userId: Schema.Types.ObjectId,
    createdAt: Date,
    updatedAt: Date,
    content: string,
    status: JOURNAL_ENTRY_TYPES,
    analysis?: Schema.Types.ObjectId,
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
    }
})

JournalEntrySchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }
    this.updatedAt = new Date();
    next();
});

// JournalEntrySchema.pre('findOneAndDelete', async function(next: Function) {
//     const entryId = this.getQuery()['_id'];
//     await EntryAnalysisModel.deleteMany({ entryId });
//     next();
// });

const JournalEntryModel = models.JournalEntry || model<JournalEntryType>('JournalEntry', JournalEntrySchema);
export default JournalEntryModel;