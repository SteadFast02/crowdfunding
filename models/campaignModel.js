import mongoose from "mongoose";

const campaignSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
        },
        description: {
            type: String,
            required: true,
        },
        targetAmount: {
            type: Number,
            required: true,
            min: [100,"minimum ammount is 100"], 
        },
        raisedAmount: {
            type: Number,
            default: 0, 
            min: 0, 
        },
        // deadline: {
        //     type: Date,
        //     required: true,
        //     validate: {
        //     validator: function (v) {
        //         return v > Date.now(); // Validate that the deadline is in the future
        //     },
        //     message: 'Deadline must be a future date.',
        //     },
        // },

        deadline: {
            type: Date,
            default: () => {
            const now = new Date();
            return new Date(now.getTime() + 5 * 60 * 1000);
        }
        },
        status: {
            type: String,
            enum: ['ongoing', 'completed','failed'], 
            default: 'ongoing', 
        },
        isDelete:{
            type:Boolean,
            default:false
        },
        subadminId: {
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'subadmin', 
        },
        backers: {
            type: [mongoose.Schema.Types.ObjectId], 
            ref: 'user', 
        },
        });
        
export default mongoose.model("campaign",campaignSchema)
