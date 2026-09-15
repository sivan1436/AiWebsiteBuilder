import jwt from "jsonwebtoken";



async function isAuth(req,res,next) {
    try{
        const token = req.cookies.token;
        if(!token){
            return res.status(401).json({message:"Unauthorized"});
        }
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        req.Newuser = await User.findById(decoded.id).select("-password");
        next();

    }
    catch(error){
        console.error(error);
        res.status(500).json({message:"invalid token"});
    }
    
};

export default isAuth;