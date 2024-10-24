import { Schema, model, models } from "mongoose";
import JournalEntry from "./JournalEntry";

export interface EntryAnalysisType extends Document {
  createdAt: Date;
  updatedAt: Date;
  entryId: Schema.Types.ObjectId;
  userId: Schema.Types.ObjectId;
  mood: string;
  subject: string;
  negative: boolean;
  summary: string;
  color: string;
  sentimentScore: number;
}

const entryAnalysysSchema = new Schema<EntryAnalysisType>({
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
    ref: "JournalEntry",
    index: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    ref: "User",
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
    default: "#0101fe",
    required: true,
  },
  sentimentScore: {
    type: Number,
    required: true,
  },
});

entryAnalysysSchema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

JournalEntry.schema.pre("findOneAndDelete", async function (next: Function) {
  const entryId = this.getQuery()["_id"];
  await EntryAnalysisModel.deleteMany({ entryId });
});

const EntryAnalysisModel =
  models.EntryAnalysis ||
  model<EntryAnalysisType>("EntryAnalysis", entryAnalysysSchema);
export default EntryAnalysisModel;
