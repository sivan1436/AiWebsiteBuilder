import User from "../models/userModel.js";
import jwt from "jsonwebtoken";

export async function googleAuth(req,res){
    try{
        const {name,email,avatar} = req.body;
        if(!email){
            return res.status(400).json({message: "Email is required"})
        }
        const user = await User.findOne({email});
        if(user){
            return res.status(200).json({message: "User already exists", user})
        }
        const newUser = await User.create({name,email,avatar});
        if(!newUser){
            return res.status(400).json({message: "Error creating user"})
        }
        const token = await jwt.sign({
            id: newUser._id,
        },process.env.JWT_SECRET,{expiresIn: "7d"});
       res.cookie("token",token,{
        httpOnly: true,
        secure :false,
        sameSite: "strict",
         maxAge: 7 * 24 * 60 * 60 * 1000
       })
       return res.status(201).json({newUser, token});
    }
     catch (error) {
        return res.status(500).json({message: "google auth error", error})
    }
};

export async function logOut(req,res){
    try{
        return res.clearCookie("token",{
        httpOnly: true,
        secure :false,
        sameSite: "strict",

        }).status(200).json({message: "Logout successful"})
    }
    catch (error) {
        return res.status(500).json({message: "Logout error", error})
    }
};