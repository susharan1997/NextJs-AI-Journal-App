import { Schema, Document, model, models } from "mongoose";
import EntryAnalysisModel from "./EntryAnalysis";

interface UserType extends Document {
  email: string;
  password: string;
  name: string;
  createdAt: Date;
  updatedAt: Date;
  account?: Schema.Types.ObjectId;
  entries?: Schema.Types.ObjectId[];
  analysis?: Schema.Types.ObjectId[];
}

const userSchema = new Schema<UserType>({
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
    type: Schema.Types.ObjectId,
    ref: "Account",
  },
  entries: [
    {
      type: Schema.Types.ObjectId,
      ref: "JournalEntry",
    },
  ],
  analysis: [
    {
      type: Schema.Types.ObjectId,
      ref: "EntryAnalysis",
    },
  ],
});

userSchema.pre("save", function (next) {
  if (this.isNew) {
    this.createdAt = new Date();
  }
  this.updatedAt = new Date();
  next();
});

userSchema.pre("findOneAndDelete", async function (next: Function) {
  const userId = this.getQuery()["_id"];
  await EntryAnalysisModel.deleteMany({ userId });
  next();
});

const UserModel = models.User || model<UserType>("User", userSchema);
export default UserModel;
