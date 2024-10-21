import mongoose from "mongoose";
import JWT from 'jsonwebtoken'

const adminSchema = new mongoose.Schema({
    username:{
        type:String,
        required:[true,"username is required"]
    },
    email:{
        type:String,
        required:[true,"email is required"],
        unique:true
    },
    password:{
        type:String,
        required:[true,"password is required"],
    },
    subadmin:{
        type: [mongoose.Schema.Types.ObjectId], 
        ref: "subadmin"
    }
},{timestamps:true})


adminSchema.methods.createJWT = function(){
    return JWT.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:"1d"})
}

export default mongoose.model("admin",adminSchema)