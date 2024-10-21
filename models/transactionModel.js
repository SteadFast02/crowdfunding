import mongoose from 'mongoose';

const transactionSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'campaign', 
        required: [true, "Campaign ID is required"],
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: [true, "User ID is required"],
    },
    amount: {
        type: Number,
        required: [true, "Transaction amount is required"],
    },
    currentDate: {
        type: Date, 
        required: true, 
    },
    status: {
        type: String,
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending', 
    },
}, { timestamps: true });

export default mongoose.model('Transaction', transactionSchema);
