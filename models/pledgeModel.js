import mongoose from 'mongoose';

const pledgeSchema = new mongoose.Schema({
    campaignId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'campaign', 
        required: [true, "Campaign ID is required"]
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'user', 
        required: [true, "User ID is required"]
    },
    amount: {
        type: Number,
        required: [true, "Pledge amount is required"]
    },
    isComplete: {
        type: Boolean,
        default: false 
    },
    currentTime:{
        type: Date,
        default:Date.now()
    },
    executeTime: {
        type: Date,
        default: () => {
            const now = new Date();
            return new Date(now.getTime() + 60 * 1000); 
        }
    }
}, { timestamps: true }); 

export default mongoose.model('Pledge', pledgeSchema);
