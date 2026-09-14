import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    name : {
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    avatar:{
        type: String,
        required: true
    },
    credits:{
        type: Number,
        default: 100,
        min : 0
    },
    plan:{
        type: String,
        enum: ["Free", "Pro","enterprise"],
        default: "Free",
    }
    
},{timestamps: true});

const User = mongoose.model("User", userSchema);
 export default User;