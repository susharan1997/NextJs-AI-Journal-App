import { Schema, Document, Types, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';
import EntryAnalysisModel from './EntryAnalysis';

interface UserType extends Document {
    id: string;
    email: string;
    password: string;
    name: string;
    createdAt: Date;
    updatedAt: Date;
    account?: Types.ObjectId;
    entries?: Types.ObjectId[];
    analysis?: Types.ObjectId[];
}

const userSchema = new Schema<UserType>({
    id: {
        type: String,
        default: uuidv4,
        unique: true,
    },
    email: {
        type: String,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    name: {
        type: String,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    updatedAt: {
        type: Date,
        default: Date.now,
    },
    account: {
        type: String,
        ref: 'Account',
    },
    entries: [{
        type: Schema.Types.ObjectId, ref: 'JournalEntry',
    }],
    analysis: [{
        type: Schema.Types.ObjectId, ref: 'EntryAnalysis',
    }],
});

userSchema.pre('save', function(next) {
    if(this.isNew){
        this.createdAt = new Date();
    }
    this.updatedAt = new Date();
    next();
});

userSchema.pre('findOneAndDelete', async function (next: Function) {
    const userId = this.getQuery()['_id'];
    await EntryAnalysisModel.deleteMany({ userId });
    next();
  });
  

const UserModel = models.User || model<UserType>('User', userSchema);
export default UserModel;