import { Schema, Types, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import JournalEntry from './JournalEntry'
import User from './User';

interface EntryAnalysisType extends Document {
    id: string,
    createdAt: Date,
    updatedAt: Date,
    entryId: Types.ObjectId,
    userId: Types.ObjectId,
    mood: string,
    subject: string,
    negative: boolean,
    summary: string,
    color: string,
    sentimentScore: number,
}

const entryAnalysysSchema = new Schema<EntryAnalysisType>({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    entryId: {
        type: Schema.Types.ObjectId, 
        required: true,
        ref: 'JournalEntry',
        index: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
    mood: {
        type: String,
        required: true,
    },
    subject: {
        type: String,
        required: true,
    },
    negative: {
        type: Boolean,
        required: true,
    },
    summary: {
        type: String,
        required: true,
    },
    color: {
        type: String,
        default: '#0101fe',
        required: true,
    },
    sentimentScore: {
        type: Number,
        required: true,
    },
})

entryAnalysysSchema.pre('save', function(next){
    if(this.isNew){
        this.createdAt = new Date();
    }
    this.updatedAt = new Date();
    next();
});

JournalEntry.schema.pre('findOneAndDelete', async function(next: Function){
    const entryId = this.getQuery()['_id'];
    await EntryAnalysisModel.deleteMany({ entryId });
});

// User.schema.pre('findOneAndDelete', async function (next: Function) {
//     const userId = this.getQuery()['_id'];
//     await EntryAnalysisModel.deleteMany({ userId });
//     next();
//   });

const EntryAnalysisModel = models.EntryAnalysis || model<EntryAnalysisType>('EntryAnalysis', entryAnalysysSchema);
export default EntryAnalysisModel;