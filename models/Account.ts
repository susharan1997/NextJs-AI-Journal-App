import { Schema, Document, Types, model, models } from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

interface AccountType extends Document {
    id: string,
    userId: Types.ObjectId,
}

const accountSchema = new Schema<AccountType>({
    id: {
        type: String,
        default: uuidv4, 
        unique: true,
    },
    userId: {
        type: Schema.Types.ObjectId,
        required: true,
        unique: true,
        ref: 'User',
    }
})

const AccountModel = models.Account || model<AccountType>('Account', accountSchema);
export default AccountModel;