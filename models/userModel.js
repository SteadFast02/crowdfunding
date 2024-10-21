import mongoose from "mongoose";
import jwt from "jsonwebtoken"
import bcrypt from 'bcrypt';

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, "Username is required"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"]
    },
    isDeleted: {
        type: Boolean,
        default: false
    },
    campaign: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "campaign"
    }],
    transaction: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "transaction"
    }]
}, { timestamps: true });

userSchema.methods.comparePassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

userSchema.methods.createJWT = function(){
    return jwt.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:"1d"})
}


// Exporting the model
export default mongoose.model("user", userSchema);
