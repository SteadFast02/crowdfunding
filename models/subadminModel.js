import mongoose from "mongoose";
import JWT from 'jsonwebtoken'

const subadminSchema = new mongoose.Schema({
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
    status:{
        type:String,
        enum:['active','inactive','blocked'],
        default:"active"
    },
    isDeleted:{
        type:Boolean,
        default:false
    },
    campaingn:{
        type: [mongoose.Schema.Types.ObjectId], 
        ref: "campaigns"
    }
},{timestamps:true})


subadminSchema.methods.createJWT = function(){
    return JWT.sign({userId:this._id},process.env.JWT_SECRET,{expiresIn:"1d"})
}

export default mongoose.model("subadmin",subadminSchema)