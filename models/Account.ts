import { Schema, Document, Types, model, models } from "mongoose";

interface AccountType extends Document {
  userId: Schema.Types.ObjectId;
}

const accountSchema = new Schema<AccountType>({
  userId: {
    type: Schema.Types.ObjectId,
    required: true,
    unique: true,
    ref: "User",
  },
});

const AccountModel =
  models.Account || model<AccountType>("Account", accountSchema);
export default AccountModel;
