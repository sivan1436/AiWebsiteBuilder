import jwt from "jsonwebtoken";
import User from "../models/userModel.js";



async function isAuth(req,res,next) {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"token not found"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.user = await User.findById(decoded.id).select("-password");
        if(!req.user){
            return res.status(401).json({message:"User not found"});
        }
        next();

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"invalid token"});
    }
    
};

export default isAuth;