import { generateResponse } from "../config/openRouter.js";
import extractJson from "../utils/extractJson.js";

export async function getCurrentUser(req,res){
try{
    if(!req.user){
        return res.status(401).json({user:null});

    }
    res.status(200).json({user:req.user});

}
catch(error){
    console.error(error);
    res.status(500).json({message:`get current user failed: ${error}`});
}
}    

export async function GenerateWebSite(req,res) {
    try{
      const result = await generateResponse("hello")
      const data = await extractJson(result)
      return res.status(200).json(data)

    }
    catch (error) {
        console.log(error)
        return res.status(500).json({
            message:"website generation failed",
            error:error.message
        })
    }
}