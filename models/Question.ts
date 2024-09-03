import { Schema, Document, model, models } from 'mongoose';

interface QuestionType extends Document {
    question: string;
    answer: string;
    createdAt: Date;
    userId: Schema.Types.ObjectId;
}

const QuestionSchema = new Schema<QuestionType>({
    question: {
        type: String,
        required: true,
    },
    answer: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'User',
        index: true,
    },
});

QuestionSchema.pre('save', function (next) {
    if (this.isNew) {
        this.createdAt = new Date();
    }
    next();
});

const QuestionModel = models.Question || model<QuestionType>('Question', QuestionSchema);
export default QuestionModel;